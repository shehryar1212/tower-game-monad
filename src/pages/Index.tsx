
import React, { useEffect } from 'react';
import GameCanvas from '../components/GameCanvas';
import Leaderboard from '../components/Leaderboard';
import Navbar from '../components/Navbar';
import { ThemeProvider } from 'next-themes';

const Index = () => {
  // Apply initial animations when component mounts
  useEffect(() => {
    document.querySelector('.game-section')?.classList.add('appear');
    
    setTimeout(() => {
      document.querySelector('.leaderboard-section')?.classList.add('slide-in-right');
    }, 300);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 responsive-container">
          <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Leaderboard on top for mobile, right side for desktop */}
            <div className="leaderboard-section order-1 lg:order-2 w-full lg:w-1/3 opacity-0">
              <Leaderboard />
            </div>
            
            <div className="game-section order-2 lg:order-1 w-full lg:w-2/3 opacity-0">
              <GameCanvas />
            </div>
          </div>
        </main>
        
        <footer className="w-full p-4 border-t border-border text-center text-xs text-muted-foreground">
          <p className="scale-in" style={{ animationDelay: '500ms' }}>
            Tower Blocks Challenge &bull; Powered by Monad Blockchain
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;
