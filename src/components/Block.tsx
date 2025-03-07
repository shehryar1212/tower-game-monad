
import React, { useEffect, useState } from 'react';
import { Block as BlockType } from '../utils/gameLogic';

interface BlockProps {
  block: BlockType;
  isNew?: boolean;
  initialX?: number;
}

const Block: React.FC<BlockProps> = ({ block, isNew = false, initialX }) => {
  const [mounted, setMounted] = useState(false);
  
  // Apply an effect to make sure new blocks animate in smoothly
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);
  
  // For the base block or first block specifically, use the initialX if provided
  const blockX = initialX !== undefined ? initialX : block.x;
  
  return (
    <div
      className={`absolute game-block ${isNew ? 'block-enter' : ''} ${mounted ? 'opacity-100' : 'opacity-0'}`}
      style={{
        width: block.width,
        height: 30,
        left: blockX,
        bottom: block.y,
        backgroundColor: block.color,
        transition: 'opacity 0.3s, transform 0.3s',
        transform: mounted ? 'scale(1)' : 'scale(0.95)',
        zIndex: block.id + 1,
        borderRadius: '2px',
        boxShadow: block.perfect ? '0 0 10px rgba(255, 255, 255, 0.7)' : 'none',
      }}
    >
      {block.perfect && (
        <div className="absolute inset-0 shine-effect"></div>
      )}
    </div>
  );
};

export default Block;
