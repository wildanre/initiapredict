// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PredictionMarket.sol";

contract PredictionMarketTest is Test {
    PredictionMarket public pm;
    address public treasury;
    address public alice;
    address public bob;

    function setUp() public {
        treasury = makeAddr("treasury");
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        pm = new PredictionMarket(treasury);
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(address(this), 100 ether);
    }

    function testCreateMarket() public {
        uint256 id = pm.createMarket{value: 1 ether}(
            "Will BTC hit $200k?", "Bitcoin price prediction",
            "crypto", "coingecko.com", block.timestamp + 7 days
        );
        assertEq(id, 0);

        PredictionMarket.Market memory m = pm.getMarket(0);
        assertEq(m.question, "Will BTC hit $200k?");
        assertEq(m.totalLiquidity, 1 ether);
        assertEq(m.creator, address(this));
        assertFalse(m.resolved);

        // Starting price should be 50% (5000 bps)
        uint256 yesPrice = pm.getYesPrice(0);
        assertEq(yesPrice, 5000);
    }

    function testBuyYesShares() public {
        pm.createMarket{value: 1 ether}(
            "Test?", "", "test", "", block.timestamp + 7 days
        );

        vm.prank(alice);
        pm.buyShares{value: 0.1 ether}(0, true, 0);

        (uint256 yes, uint256 no) = pm.getUserPosition(0, alice);
        assertGt(yes, 0);
        assertEq(no, 0);

        // YES price should increase after buying YES
        assertGt(pm.getYesPrice(0), 5000);
    }

    function testBuyNoShares() public {
        pm.createMarket{value: 1 ether}(
            "Test?", "", "test", "", block.timestamp + 7 days
        );

        vm.prank(bob);
        pm.buyShares{value: 0.1 ether}(0, false, 0);

        (uint256 yes, uint256 no) = pm.getUserPosition(0, bob);
        assertEq(yes, 0);
        assertGt(no, 0);

        // YES price should decrease (NO price increases)
        assertLt(pm.getYesPrice(0), 5000);
    }

    function testSellShares() public {
        pm.createMarket{value: 1 ether}(
            "Test?", "", "test", "", block.timestamp + 7 days
        );

        vm.startPrank(alice);
        pm.buyShares{value: 0.5 ether}(0, true, 0);
        (uint256 yesBefore, ) = pm.getUserPosition(0, alice);
        uint256 balBefore = alice.balance;

        pm.sellShares(0, true, yesBefore / 2, 0);
        assertGt(alice.balance, balBefore);

        (uint256 yesAfter, ) = pm.getUserPosition(0, alice);
        assertLt(yesAfter, yesBefore);
        vm.stopPrank();
    }

    function testResolveAndClaim() public {
        pm.createMarket{value: 1 ether}(
            "Test?", "", "test", "", block.timestamp + 7 days
        );

        // Alice buys YES, Bob buys NO
        vm.prank(alice);
        pm.buyShares{value: 0.5 ether}(0, true, 0);
        vm.prank(bob);
        pm.buyShares{value: 0.5 ether}(0, false, 0);

        // Resolve as YES
        pm.resolveMarket(0, PredictionMarket.Outcome.Yes);

        // Alice (YES holder) claims
        uint256 aliceBefore = alice.balance;
        vm.prank(alice);
        pm.claimWinnings(0);
        assertGt(alice.balance, aliceBefore);

        // Treasury received fee (2%)
        assertGt(treasury.balance, 0);
    }

    function testCannotBuyAfterEnd() public {
        pm.createMarket{value: 1 ether}(
            "Test?", "", "test", "", block.timestamp + 1
        );

        vm.warp(block.timestamp + 2);
        vm.expectRevert("Market ended");
        vm.prank(alice);
        pm.buyShares{value: 0.1 ether}(0, true, 0);
    }

    function testSlippageProtection() public {
        pm.createMarket{value: 1 ether}(
            "Test?", "", "test", "", block.timestamp + 7 days
        );

        vm.expectRevert("Slippage exceeded");
        vm.prank(alice);
        pm.buyShares{value: 0.1 ether}(0, true, type(uint256).max);
    }

    function testDoubleClaimReverts() public {
        pm.createMarket{value: 1 ether}(
            "Test?", "", "test", "", block.timestamp + 7 days
        );

        vm.prank(alice);
        pm.buyShares{value: 0.5 ether}(0, true, 0);

        pm.resolveMarket(0, PredictionMarket.Outcome.Yes);

        vm.startPrank(alice);
        pm.claimWinnings(0);
        vm.expectRevert("Already claimed");
        pm.claimWinnings(0);
        vm.stopPrank();
    }

    receive() external payable {}
}
