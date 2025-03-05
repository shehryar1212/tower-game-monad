
import { ethers } from 'ethers';
import { WalletInfo } from '../utils/walletUtils';

// ABI for a simple game contract that charges a fee
// This is a placeholder ABI for a contract that will be deployed on Monad
const GAME_CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "playGame",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameFee",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// This would be the actual contract address once deployed
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; 

// The game fee in MON
export const GAME_FEE = ethers.parseEther('0.0001');

export const payGameFee = async (walletInfo: WalletInfo): Promise<boolean> => {
  if (!walletInfo.connected || walletInfo.type !== 'metamask') {
    throw new Error('MetaMask wallet not connected');
  }

  try {
    // For now, since we don't have a real contract deployed, we'll simulate the fee payment
    // In a real scenario, we would connect to the contract and call the playGame function
    
    // This is how you would connect to the actual contract
    // const provider = new ethers.BrowserProvider(window.ethereum);
    // const signer = await provider.getSigner();
    // const contract = new ethers.Contract(CONTRACT_ADDRESS, GAME_CONTRACT_ABI, signer);
    
    // For simulation purposes, we'll just check if the wallet has enough balance
    const balance = ethers.parseEther(walletInfo.balance);
    
    // Fix: use < comparison operator instead of .lt() for bigint
    if (balance < GAME_FEE) {
      throw new Error('Insufficient balance to pay game fee');
    }
    
    // In a real scenario, we would call:
    // await contract.playGame({ value: GAME_FEE });
    
    console.log(`Simulating payment of ${ethers.formatEther(GAME_FEE)} MON`);
    return true;
  } catch (error) {
    console.error('Error paying game fee:', error);
    throw error;
  }
};

export const formatMonadAmount = (amount: bigint): string => {
  return `${ethers.formatEther(amount)} MON`;
};
