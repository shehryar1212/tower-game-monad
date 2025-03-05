
import React from 'react';
import { WalletInfo, connectMetaMask, connectPhantom } from '../utils/walletUtils';
import { Button } from '@/components/ui/button';
import { formatMonadAmount, GAME_FEE } from '../contracts/GameContract';

interface WalletConnectProps {
  walletInfo: WalletInfo;
  onWalletConnect: (wallet: WalletInfo) => void;
  onWalletDisconnect: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  walletInfo,
  onWalletConnect,
  onWalletDisconnect,
}) => {
  const handleMetaMaskConnect = async () => {
    try {
      const wallet = await connectMetaMask();
      onWalletConnect(wallet);
    } catch (error) {
      console.error('MetaMask connection error:', error);
    }
  };

  const handlePhantomConnect = async () => {
    try {
      const wallet = await connectPhantom();
      onWalletConnect(wallet);
    } catch (error) {
      console.error('Phantom connection error:', error);
    }
  };

  const handleDisconnect = () => {
    onWalletDisconnect();
  };

  if (walletInfo.connected) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2 glass p-2 px-4 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-subtle"></div>
          <span className="text-sm font-medium truncate max-w-[120px]">
            {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          Balance: {walletInfo.balance.slice(0, 8)} MON
        </div>
        <div className="text-xs text-muted-foreground">
          Game Fee: {formatMonadAmount(GAME_FEE).slice(0, 8)}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={handleDisconnect}
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <p className="text-sm text-center mb-2">
        Connect your wallet to play<br />
        <span className="text-xs text-muted-foreground">Fee: {formatMonadAmount(GAME_FEE)}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline"
          className="wallet-button flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0"
          onClick={handleMetaMaskConnect}
        >
          <svg width="20" height="20" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32.9582 1L19.8241 10.7183L22.2665 5.09986L32.9582 1Z" fill="white" stroke="white" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.04183 1L15.0487 10.809L12.7335 5.09986L2.04183 1Z" fill="white" stroke="white" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28.2044 23.4114L24.6488 28.7829L32.1835 30.8624L34.3333 23.5347L28.2044 23.4114Z" fill="white" stroke="white" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M0.683353 23.5347L2.81662 30.8624L10.3513 28.7829L6.79573 23.4114L0.683353 23.5347Z" fill="white" stroke="white" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.95511 14.5114L7.8779 17.6689L15.3307 18.0077L15.0759 10.0417L9.95511 14.5114Z" fill="white" stroke="white" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M25.0449 14.5114L19.8697 9.95169L19.8241 18.0077L27.2587 17.6689L25.0449 14.5114Z" fill="white" stroke="white" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.3513 28.7829L14.821 26.6306L10.9699 23.5981L10.3513 28.7829Z" fill="white" stroke="white" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.179 26.6306L24.6488 28.7829L24.0301 23.5981L20.179 26.6306Z" fill="white" stroke="white" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          MetaMask
        </Button>
        <Button 
          variant="outline"
          className="wallet-button flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0"
          onClick={handlePhantomConnect}
        >
          <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z" fill="white"/>
            <path d="M110.584 64.9142L71.3818 25.7279C68.1215 22.4706 62.9652 22.4706 59.7049 25.7279L49.631 35.7958L63.5354 49.6952C67.0552 48.298 71.2284 49.284 73.7899 52.4791C76.3579 55.6834 76.8685 59.8845 75.4456 63.4123L88.7284 76.6951C92.2456 75.2664 96.4437 75.7706 99.0118 78.9781C102.491 82.4573 102.491 88.1126 99.0118 91.5918C95.5294 95.0742 89.8741 95.0742 86.3949 91.5918C83.7425 88.3077 83.2877 83.913 84.8827 80.3122L72.5088 67.9352L72.508 92.4168C73.3546 92.8328 74.1362 93.3843 74.7777 94.0242C78.2602 97.5034 78.2602 103.159 74.7777 106.644C71.2953 110.126 65.64 110.126 62.1608 106.644C58.6784 103.159 58.6784 97.5034 62.1608 94.0242C62.9279 93.2587 63.8514 92.6658 64.8473 92.2384V67.5561C63.8514 67.1319 62.9279 66.5452 62.1577 65.7735C59.4857 63.1047 59.0371 58.662 60.6784 55.0446L46.9602 41.326L20.7363 67.5499C17.4729 70.8102 17.4729 75.9665 20.7363 79.2269L59.9449 118.44C63.2052 121.698 68.3615 121.698 71.6218 118.44L110.584 79.4778C113.848 76.2144 113.848 71.0581 110.584 67.7978" fill="url(#paint0_linear)"/>
            <defs>
              <linearGradient id="paint0_linear" x1="66.5002" y1="22.763" x2="66.5002" y2="121.405" gradientUnits="userSpaceOnUse">
                <stop stopColor="#534BB1"/>
                <stop offset="1" stopColor="#551BF9"/>
              </linearGradient>
            </defs>
          </svg>
          Phantom
        </Button>
      </div>
    </div>
  );
};

export default WalletConnect;
