
import { ethers } from 'ethers';
import { toast } from 'sonner';

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

// Helper function to detect if we're on a mobile device
export const isMobileDevice = () => {
  return (
    typeof window !== 'undefined' &&
    (navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i))
  );
};

// Helper to detect if wallet is available in mobile browser
export const isWalletAvailable = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for injected Ethereum provider (MetaMask, Trust Wallet, etc.)
  if (window.ethereum) return true;
  
  // Check for Phantom
  if (window.solana) return true;
  
  return false;
};

// Helper to open deep link for mobile wallets
export const openMobileWalletApp = () => {
  const isMobile = isMobileDevice();
  
  if (!isMobile) return;
  
  // For MetaMask mobile
  if (window.ethereum && window.ethereum.isMetaMask) {
    window.open('https://metamask.app.link/dapp/4f528623-c426-4504-9f3c-c2c0ec05c0e5.lovableproject.com/', '_blank');
    return;
  }
  
  // For other mobile wallets, try universal links
  // Detect user's device
  const isAndroid = /android/i.test(navigator.userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  
  if (isIOS) {
    // iOS deep links
    window.open('https://metamask.app.link/dapp/4f528623-c426-4504-9f3c-c2c0ec05c0e5.lovableproject.com/', '_blank');
  } else if (isAndroid) {
    // Android deep links
    window.open('https://metamask.app.link/dapp/4f528623-c426-4504-9f3c-c2c0ec05c0e5.lovableproject.com/', '_blank');
  }
};

export const connectMetaMask = async (): Promise<WalletInfo> => {
  // Check if MetaMask is installed
  if (!window.ethereum) {
    // If on mobile, suggest opening the wallet app
    if (isMobileDevice()) {
      toast.info("Opening wallet app. Please connect from there.");
      openMobileWalletApp();
      throw new Error('Please connect from your wallet app');
    } else {
      toast.error("MetaMask is not installed. Please install it to continue.");
      throw new Error('MetaMask is not installed');
    }
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
        // Try to add the network first instead of switching directly
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
        
        // Now try to switch to the added chain
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: MONAD_TESTNET.chainIdHex }]
        });
        console.log("Successfully switched chain");
      } catch (switchError: any) {
        console.log("Switch error:", switchError);
        
        if (switchError.code === 4902) {
          // This error means the chain hasn't been added yet - but we already tried to add it
          console.error("Failed to add the network: ", switchError);
          toast.error("Failed to add Monad network to your wallet.");
        } else if (isMobileDevice() && (switchError.code === 4901 || switchError.code === -32603)) {
          // Special handling for mobile wallet issues
          toast.info("Please open in your wallet's browser for best experience");
          openMobileWalletApp();
          throw new Error('Please connect through your wallet browser');
        } else {
          console.error("Failed to switch chains:", switchError);
          // Don't throw here, let the user continue with their current network
          toast.warning("Failed to switch to Monad network. Please try again or switch manually in your wallet.");
        }
      }
      
      // After switching or adding the chain, wait briefly for chain to be updated
      console.log("Waiting for chain update...");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Re-fetch updated info after chain switch attempt
    const updatedProvider = new ethers.BrowserProvider(window.ethereum);
    const updatedNetwork = await updatedProvider.getNetwork();
    const updatedBalance = await updatedProvider.getBalance(accounts[0]);
    const updatedFormattedBalance = ethers.formatEther(updatedBalance);
    
    console.log("Updated network chainId:", Number(updatedNetwork.chainId));
    
    // Allow connection to proceed regardless of chain to avoid blocking users
    return {
      address: accounts[0],
      balance: updatedFormattedBalance,
      chainId: Number(updatedNetwork.chainId),
      connected: true,
      provider: updatedProvider,
      type: 'metamask'
    };
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
};

export const connectPhantom = async (): Promise<WalletInfo> => {
  if (!window.solana) {
    // If on mobile, suggest opening the wallet app
    if (isMobileDevice()) {
      toast.info("Opening Phantom wallet. Please connect from there.");
      window.open('https://phantom.app/ul/browse/4f528623-c426-4504-9f3c-c2c0ec05c0e5.lovableproject.com', '_blank');
      throw new Error('Please connect from Phantom app');
    } else {
      toast.error("Phantom wallet is not installed");
      throw new Error('Phantom wallet is not installed');
    }
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
