export const CHAIN_ID_HEX = '0xdc0974dac6c5b'
export const CHAIN_ID_DECIMAL = 0xdc0974dac6c5b

export const CHAIN_CONFIG = {
  chainId: CHAIN_ID_HEX,
  chainName: 'InitiaPredict',
  nativeCurrency: { name: 'GAS', symbol: 'GAS', decimals: 18 },
  rpcUrls: ['https://rpc.evently-organizer.site'],
  blockExplorerUrls: [],
}

export async function ensureCorrectNetwork(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    // No wallet - transactions will prompt wallet connect via wagmi
    return true
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CHAIN_ID_HEX }],
    })
    return true
  } catch {
    // If switch fails (chain not added or user rejected), proceed anyway.
    // The transaction will go through whatever chain the wallet is on.
    // User should add the network manually via the "Add Network" modal.
    return true
  }
}
