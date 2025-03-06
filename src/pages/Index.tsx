
import React, { useEffect } from 'react';
import GameCanvas from '../components/GameCanvas';
import Leaderboard from '../components/Leaderboard';

const Index = () => {
  // Apply initial animations when component mounts
  useEffect(() => {
    document.querySelector('header')?.classList.add('fade-up');
    
    // Staggered animations for main content
    setTimeout(() => {
      document.querySelector('.game-section')?.classList.add('appear');
    }, 100);
    
    setTimeout(() => {
      document.querySelector('.leaderboard-section')?.classList.add('slide-in-right');
    }, 300);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full p-4 sm:p-6 border-b border-border flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl sm:text-2xl font-bold mr-2">Tower Blocks</h1>
          <span className="text-xs py-0.5 px-2 bg-muted rounded-full text-muted-foreground">Beta</span>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href="https://testnet.monadexplorer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Monad Explorer
          </a>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-4 sm:p-6 responsive-container">
        <div className="game-section w-full lg:w-2/3 opacity-0">
          <GameCanvas />
        </div>
        <div className="leaderboard-section w-full lg:w-1/3 opacity-0">
          <Leaderboard />
        </div>
      </main>
      
      <footer className="w-full p-4 border-t border-border text-center text-xs text-muted-foreground">
        <p className="scale-in" style={{ animationDelay: '500ms' }}>
          Tower Blocks Challenge &bull; Powered by Monad Blockchain
        </p>
      </footer>
    </div>
  );
};

export default Index;
