
import React from 'react';
import GameCanvas from '../components/GameCanvas';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-2">Tower Blocks</h1>
          <span className="text-xs py-0.5 px-2 bg-muted rounded-full text-muted-foreground">Beta</span>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href="https://testnet.monadexplorer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Monad Explorer
          </a>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <GameCanvas />
      </main>
      
      <footer className="w-full p-4 border-t border-border text-center text-xs text-muted-foreground">
        <p>
          Tower Blocks Challenge &bull; Powered by Monad Blockchain
        </p>
      </footer>
    </div>
  );
};

export default Index;
