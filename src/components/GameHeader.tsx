
import React from 'react';
import { GameState } from '../utils/gameLogic';

interface GameHeaderProps {
  gameState: GameState;
}

const GameHeader: React.FC<GameHeaderProps> = ({ gameState }) => {
  return (
    <div className="flex justify-between items-center w-full mb-4">
      <div className="flex flex-col items-start">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Score</div>
        <div className="text-3xl font-bold animate-fade-in">{gameState.score}</div>
        {gameState.combo > 1 && (
          <div className="mt-1 text-xs px-2 py-0.5 bg-game-accent text-white rounded-full animate-bounce-subtle">
            {gameState.combo}x Combo!
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Level</div>
        <div className="text-2xl font-bold">{gameState.level}</div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Best</div>
        <div className="text-2xl font-semibold">{gameState.highScore}</div>
      </div>
    </div>
  );
};

export default GameHeader;
