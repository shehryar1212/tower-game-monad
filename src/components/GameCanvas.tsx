
import React, { useEffect, useRef, useState } from 'react';
import Block from './Block';
import GameHeader from './GameHeader';
import GameControls from './GameControls';
import WalletConnect from './WalletConnect';
import { 
  GameState, 
  GAME_WIDTH, 
  BLOCK_HEIGHT,
  createInitialState, 
  startGame, 
  updateGame, 
  placeBlock, 
  resetGame 
} from '../utils/gameLogic';
import { WalletInfo, defaultWalletInfo } from '../utils/walletUtils';

const GameCanvas: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [walletInfo, setWalletInfo] = useState<WalletInfo>(defaultWalletInfo);
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  
  // Visibility check to pause game when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameRef.current);
      } else if (gameState.gameStarted && !gameState.gameOver) {
        lastUpdateTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [gameState.gameStarted, gameState.gameOver]);
  
  // Main game loop
  const gameLoop = (timestamp: number) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }
    
    const deltaTime = timestamp - lastUpdateTimeRef.current;
    
    // Update game at around 60fps
    if (deltaTime > 16) {
      lastUpdateTimeRef.current = timestamp;
      setGameState(prevState => updateGame(prevState));
    }
    
    if (gameState.gameStarted && !gameState.gameOver) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  };
  
  // Start/stop game loop based on game state
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver) {
      lastUpdateTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState.gameStarted, gameState.gameOver]);
  
  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handlePlaceBlock();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Start a new game
  const handleStartGame = () => {
    // First completely reset the state
    const freshState = resetGame();
    // Then start the game with the fresh state
    setGameState(startGame(freshState));
    console.log("Game started with fresh state");
  };
  
  // Reset the game
  const handleResetGame = () => {
    setGameState(resetGame());
  };
  
  // Place a block
  const handlePlaceBlock = () => {
    setGameState(prevState => {
      const newState = placeBlock(prevState);
      console.log("After placing block - gameOver:", newState.gameOver, "currentBlock:", newState.currentBlock);
      return newState;
    });
  };
  
  // Handle wallet connection
  const handleWalletConnect = (wallet: WalletInfo) => {
    setWalletInfo(wallet);
  };
  
  // Handle wallet disconnection
  const handleWalletDisconnect = () => {
    setWalletInfo(defaultWalletInfo);
  };
  
  // Calculate the visible height for the game canvas
  const canvasHeight = Math.max(
    600, // Minimum height
    gameState.blocks.length * BLOCK_HEIGHT + 100 // Dynamic height based on blocks
  );
  
  // Calculate how much to scroll the view to focus on the current block
  const scrollOffset = Math.max(0, (gameState.blocks.length * BLOCK_HEIGHT) - 400);
  
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4">
      <div className="mb-6 w-full">
        <WalletConnect 
          walletInfo={walletInfo}
          onWalletConnect={handleWalletConnect}
          onWalletDisconnect={handleWalletDisconnect}
        />
      </div>
      
      <GameHeader gameState={gameState} />
      
      <div 
        className="relative border border-border rounded-lg overflow-hidden bg-gradient-to-b from-background to-secondary"
        style={{ 
          width: GAME_WIDTH, 
          height: 600,
        }}
      >
        {/* Game canvas area */}
        <div 
          ref={canvasRef}
          className="absolute inset-0 game-canvas"
          onClick={handlePlaceBlock}
          style={{ 
            overflow: 'hidden',
            transform: `translateY(${-scrollOffset}px)`,
            transition: 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)',
          }}
        >
          {/* Base platform */}
          <div
            className="absolute bottom-0 left-0 w-full h-10 bg-gray-800 rounded-b-lg"
            style={{ zIndex: 0 }}
          />
          
          {/* Render all placed blocks */}
          {gameState.blocks.map(block => (
            <Block key={block.id} block={block} />
          ))}
          
          {/* Render current moving block */}
          {gameState.currentBlock && (
            <Block 
              block={gameState.currentBlock} 
              isNew={true} 
            />
          )}
        </div>
        
        {/* Game overlay message for game over or not started */}
        {(gameState.gameOver || !gameState.gameStarted) && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="glass p-6 rounded-lg">
              <GameControls 
                gameState={gameState}
                walletInfo={walletInfo}
                onStartGame={handleStartGame}
                onResetGame={handleResetGame}
                onPlaceBlock={handlePlaceBlock}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Game controls (only show when game is active) */}
      {gameState.gameStarted && !gameState.gameOver && (
        <GameControls 
          gameState={gameState}
          walletInfo={walletInfo}
          onStartGame={handleStartGame}
          onResetGame={handleResetGame}
          onPlaceBlock={handlePlaceBlock}
        />
      )}
      
      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Click, tap or press SPACE to place blocks</p>
        <p className="mt-2 text-xs">
          Build the tallest tower you can by stacking blocks!
        </p>
      </div>
    </div>
  );
};

export default GameCanvas;
