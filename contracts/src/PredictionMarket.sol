// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title PredictionMarket - Binary prediction market with CPMM pricing
/// @notice Deployed on Initia EVM appchain for the InitiaPredict platform
contract PredictionMarket {
    // ── Types ──
    enum Outcome { Unresolved, Yes, No, Invalid }

    struct Market {
        uint256 id;
        address creator;
        string  question;
        string  description;
        string  resolutionSource;
        string  category;
        uint256 endTime;
        uint256 createdAt;
        bool    resolved;
        Outcome outcome;
        uint256 yesPool;          // virtual YES liquidity
        uint256 noPool;           // virtual NO liquidity
        uint256 totalYesShares;
        uint256 totalNoShares;
        uint256 totalLiquidity;   // total native tokens locked
    }

    // ── State ──
    uint256 public nextMarketId;
    uint256 public constant FEE_BPS = 200;           // 2%
    uint256 public constant MIN_LIQUIDITY = 0.01 ether;
    address public owner;
    address public treasury;

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => uint256)) public yesSharesOf;
    mapping(uint256 => mapping(address => uint256)) public noSharesOf;
    mapping(uint256 => mapping(address => bool)) public claimed;

    // ── Events ──
    event MarketCreated(
        uint256 indexed marketId, address indexed creator,
        string question, uint256 endTime, uint256 initialLiquidity
    );
    event SharesBought(
        uint256 indexed marketId, address indexed buyer,
        bool isYes, uint256 amount, uint256 sharesMinted, uint256 newPrice
    );
    event SharesSold(
        uint256 indexed marketId, address indexed seller,
        bool isYes, uint256 sharesAmount, uint256 payout
    );
    event MarketResolved(uint256 indexed marketId, Outcome outcome);
    event WinningsClaimed(
        uint256 indexed marketId, address indexed user, uint256 payout
    );

    // ── Modifiers ──
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    modifier marketExists(uint256 _id) {
        require(_id < nextMarketId, "Market does not exist");
        _;
    }
    modifier notResolved(uint256 _id) {
        require(!markets[_id].resolved, "Market already resolved");
        _;
    }

    // ── Constructor ──
    constructor(address _treasury) {
        owner = msg.sender;
        treasury = _treasury;
    }

    // ═══════════════════════════════════════════════════
    //  Market Creation
    // ═══════════════════════════════════════════════════

    /// @notice Create a new binary prediction market
    /// @param _question The yes/no question for the market
    /// @param _description Additional context about the market
    /// @param _category Market category (crypto, politics, sports, etc.)
    /// @param _resolutionSource URL or authority for resolution
    /// @param _endTime Unix timestamp when trading ends
    /// @return marketId The ID of the newly created market
    function createMarket(
        string calldata _question,
        string calldata _description,
        string calldata _category,
        string calldata _resolutionSource,
        uint256 _endTime
    ) external payable returns (uint256 marketId) {
        require(msg.value >= MIN_LIQUIDITY, "Insufficient initial liquidity");
        require(_endTime > block.timestamp, "End time must be in the future");
        require(bytes(_question).length > 0, "Question required");

        marketId = nextMarketId++;
        uint256 halfLiq = msg.value / 2;

        markets[marketId] = Market({
            id: marketId,
            creator: msg.sender,
            question: _question,
            description: _description,
            resolutionSource: _resolutionSource,
            category: _category,
            endTime: _endTime,
            createdAt: block.timestamp,
            resolved: false,
            outcome: Outcome.Unresolved,
            yesPool: halfLiq,
            noPool: halfLiq,
            totalYesShares: 0,
            totalNoShares: 0,
            totalLiquidity: msg.value
        });

        emit MarketCreated(marketId, msg.sender, _question, _endTime, msg.value);
    }

    // ═══════════════════════════════════════════════════
    //  Trading: Buy Shares
    // ═══════════════════════════════════════════════════

    /// @notice Buy YES or NO shares using CPMM pricing
    /// @dev shares = pool_opposite - (k / (pool_same + amount))
    /// @param _marketId The market to buy shares in
    /// @param _isYes True for YES shares, false for NO shares
    /// @param _minShares Minimum shares expected (slippage protection)
    function buyShares(
        uint256 _marketId,
        bool _isYes,
        uint256 _minShares
    ) external payable marketExists(_marketId) notResolved(_marketId) {
        require(msg.value > 0, "Must send value");
        Market storage m = markets[_marketId];
        require(block.timestamp < m.endTime, "Market ended");

        uint256 k = m.yesPool * m.noPool;
        uint256 shares;

        if (_isYes) {
            uint256 newNoPool = m.noPool + msg.value;
            uint256 newYesPool = k / newNoPool;
            shares = m.yesPool - newYesPool;
            m.yesPool = newYesPool;
            m.noPool = newNoPool;
            m.totalYesShares += shares;
            yesSharesOf[_marketId][msg.sender] += shares;
        } else {
            uint256 newYesPool = m.yesPool + msg.value;
            uint256 newNoPool = k / newYesPool;
            shares = m.noPool - newNoPool;
            m.yesPool = newYesPool;
            m.noPool = newNoPool;
            m.totalNoShares += shares;
            noSharesOf[_marketId][msg.sender] += shares;
        }

        require(shares >= _minShares, "Slippage exceeded");
        m.totalLiquidity += msg.value;

        emit SharesBought(
            _marketId, msg.sender, _isYes,
            msg.value, shares, getYesPrice(_marketId)
        );
    }

    // ═══════════════════════════════════════════════════
    //  Trading: Sell Shares
    // ═══════════════════════════════════════════════════

    /// @notice Sell shares back to the pool
    /// @param _marketId The market to sell shares in
    /// @param _isYes True to sell YES shares, false for NO
    /// @param _sharesAmount Number of shares to sell
    /// @param _minPayout Minimum payout expected (slippage protection)
    function sellShares(
        uint256 _marketId,
        bool _isYes,
        uint256 _sharesAmount,
        uint256 _minPayout
    ) external marketExists(_marketId) notResolved(_marketId) {
        require(_sharesAmount > 0, "Zero shares");
        Market storage m = markets[_marketId];

        uint256 k = m.yesPool * m.noPool;
        uint256 payout;

        if (_isYes) {
            require(yesSharesOf[_marketId][msg.sender] >= _sharesAmount, "Insufficient shares");
            uint256 newYesPool = m.yesPool + _sharesAmount;
            uint256 newNoPool = k / newYesPool;
            payout = m.noPool - newNoPool;
            m.yesPool = newYesPool;
            m.noPool = newNoPool;
            m.totalYesShares -= _sharesAmount;
            yesSharesOf[_marketId][msg.sender] -= _sharesAmount;
        } else {
            require(noSharesOf[_marketId][msg.sender] >= _sharesAmount, "Insufficient shares");
            uint256 newNoPool = m.noPool + _sharesAmount;
            uint256 newYesPool = k / newNoPool;
            payout = m.yesPool - newYesPool;
            m.noPool = newNoPool;
            m.yesPool = newYesPool;
            m.totalNoShares -= _sharesAmount;
            noSharesOf[_marketId][msg.sender] -= _sharesAmount;
        }

        require(payout >= _minPayout, "Slippage exceeded");
        m.totalLiquidity -= payout;

        (bool ok, ) = payable(msg.sender).call{value: payout}("");
        require(ok, "Transfer failed");

        emit SharesSold(_marketId, msg.sender, _isYes, _sharesAmount, payout);
    }

    // ═══════════════════════════════════════════════════
    //  Resolution
    // ═══════════════════════════════════════════════════

    /// @notice Resolve a market with a final outcome (owner only)
    function resolveMarket(
        uint256 _marketId,
        Outcome _outcome
    ) external onlyOwner marketExists(_marketId) notResolved(_marketId) {
        require(_outcome != Outcome.Unresolved, "Invalid outcome");
        Market storage m = markets[_marketId];
        m.resolved = true;
        m.outcome = _outcome;
        emit MarketResolved(_marketId, _outcome);
    }

    // ═══════════════════════════════════════════════════
    //  Claim Winnings
    // ═══════════════════════════════════════════════════

    /// @notice Claim winnings after market resolution
    /// @dev 2% fee is deducted and sent to treasury
    function claimWinnings(uint256 _marketId) external marketExists(_marketId) {
        Market storage m = markets[_marketId];
        require(m.resolved, "Market not resolved");
        require(!claimed[_marketId][msg.sender], "Already claimed");

        uint256 userShares;
        uint256 totalWinningShares;

        if (m.outcome == Outcome.Yes) {
            userShares = yesSharesOf[_marketId][msg.sender];
            totalWinningShares = m.totalYesShares;
        } else if (m.outcome == Outcome.No) {
            userShares = noSharesOf[_marketId][msg.sender];
            totalWinningShares = m.totalNoShares;
        } else {
            // Invalid outcome: refund proportional to all shares
            uint256 totalAll = m.totalYesShares + m.totalNoShares;
            userShares = yesSharesOf[_marketId][msg.sender]
                       + noSharesOf[_marketId][msg.sender];
            totalWinningShares = totalAll;
        }

        require(userShares > 0, "No shares to claim");
        claimed[_marketId][msg.sender] = true;

        uint256 grossPayout = (m.totalLiquidity * userShares) / totalWinningShares;
        uint256 fee = (grossPayout * FEE_BPS) / 10000;
        uint256 netPayout = grossPayout - fee;

        (bool feeOk, ) = payable(treasury).call{value: fee}("");
        require(feeOk, "Fee transfer failed");

        (bool ok, ) = payable(msg.sender).call{value: netPayout}("");
        require(ok, "Payout transfer failed");

        emit WinningsClaimed(_marketId, msg.sender, netPayout);
    }

    // ═══════════════════════════════════════════════════
    //  View Functions
    // ═══════════════════════════════════════════════════

    /// @notice Get YES price in basis points (0-10000 = 0%-100%)
    function getYesPrice(uint256 _marketId) public view returns (uint256) {
        Market storage m = markets[_marketId];
        if (m.yesPool + m.noPool == 0) return 5000;
        return (m.noPool * 10000) / (m.yesPool + m.noPool);
    }

    /// @notice Get NO price in basis points
    function getNoPrice(uint256 _marketId) public view returns (uint256) {
        return 10000 - getYesPrice(_marketId);
    }

    /// @notice Get full market data
    function getMarket(uint256 _marketId) external view returns (Market memory) {
        return markets[_marketId];
    }

    /// @notice Get user's position in a market
    function getUserPosition(uint256 _marketId, address _user)
        external view returns (uint256 yesShares, uint256 noShares)
    {
        return (
            yesSharesOf[_marketId][_user],
            noSharesOf[_marketId][_user]
        );
    }

    /// @notice Get count of active (unresolved) markets
    function getActiveMarketCount() external view returns (uint256) {
        uint256 count;
        for (uint256 i = 0; i < nextMarketId; i++) {
            if (!markets[i].resolved) count++;
        }
        return count;
    }

    // ═══════════════════════════════════════════════════
    //  Admin
    // ═══════════════════════════════════════════════════

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    receive() external payable {}
}
