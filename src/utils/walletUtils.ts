
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
  chainId: 10143, // Using decimal format directly
  chainIdHex: '0x2797', // Keep hex format for RPC calls
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
    
    console.log("Current network chainId:", Number(network.chainId));
    console.log("Target Monad chainId:", MONAD_TESTNET.chainId);
    
    // Check if we need to switch chains - comparing both as numbers
    if (Number(network.chainId) !== MONAD_TESTNET.chainId) {
      console.log("Chain mismatch detected, attempting to switch...");
      try {
        // MetaMask requires the chainId in hex format for RPC calls
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: MONAD_TESTNET.chainIdHex }]
        });
        console.log("Successfully switched chain");
      } catch (switchError: any) {
        console.log("Switch error:", switchError);
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          console.log("Chain not added, attempting to add...");
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: MONAD_TESTNET.chainIdHex,
              chainName: MONAD_TESTNET.chainName,
              nativeCurrency: MONAD_TESTNET.nativeCurrency,
              rpcUrls: MONAD_TESTNET.rpcUrls,
              blockExplorerUrls: MONAD_TESTNET.blockExplorerUrls
            }]
          });
          console.log("Successfully added chain");
        } else {
          console.error("Failed to switch chains:", switchError);
          throw switchError;
        }
      }
      
      // After switching or adding the chain, wait briefly for chain to be updated
      console.log("Waiting for chain update...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Re-initialize the provider to get the updated info
      const updatedProvider = new ethers.BrowserProvider(window.ethereum);
      const updatedNetwork = await updatedProvider.getNetwork();
      const updatedBalance = await updatedProvider.getBalance(accounts[0]);
      const updatedFormattedBalance = ethers.formatEther(updatedBalance);
      
      console.log("Updated network chainId:", Number(updatedNetwork.chainId));
      
      return {
        address: accounts[0],
        balance: updatedFormattedBalance,
        chainId: Number(updatedNetwork.chainId),
        connected: true,
        provider: updatedProvider,
        type: 'metamask'
      };
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
