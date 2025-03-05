
import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  connected: boolean;
  provider?: any;
  type: 'metamask' | 'phantom' | null;
}

export const defaultWalletInfo: WalletInfo = {
  address: '',
  balance: '0',
  chainId: 0,
  connected: false,
  type: null
};

export const MONAD_TESTNET = {
  chainId: '0x2797', // 10143 in decimal
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com']
};

export const connectMetaMask = async (): Promise<WalletInfo> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    const network = await provider.getNetwork();
    const balance = await provider.getBalance(accounts[0]);
    const formattedBalance = ethers.formatEther(balance);

    // Switch to Monad Testnet if not already on it
    if (Number(network.chainId) !== MONAD_TESTNET.chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: MONAD_TESTNET.chainId }]
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET]
          });
        } else {
          throw switchError;
        }
      }
    }

    return {
      address: accounts[0],
      balance: formattedBalance,
      chainId: Number(network.chainId),
      connected: true,
      provider,
      type: 'metamask'
    };
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
};

export const connectPhantom = async (): Promise<WalletInfo> => {
  if (!window.solana) {
    throw new Error('Phantom wallet is not installed');
  }

  try {
    const resp = await window.solana.connect();
    
    return {
      address: resp.publicKey.toString(),
      balance: '0', // We would need to fetch this using Solana's web3.js
      chainId: 0, // Solana doesn't use chainId in the same way
      connected: true,
      provider: window.solana,
      type: 'phantom'
    };
  } catch (error) {
    console.error('Error connecting to Phantom:', error);
    throw error;
  }
};

export const disconnectWallet = async (walletInfo: WalletInfo): Promise<void> => {
  if (!walletInfo.connected) return;

  try {
    if (walletInfo.type === 'phantom' && window.solana) {
      await window.solana.disconnect();
    }
    // MetaMask doesn't have a disconnect method, the user has to do it manually
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
};

// Type declarations for window
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}
