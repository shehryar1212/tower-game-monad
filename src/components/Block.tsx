
import React, { useEffect, useState } from 'react';
import { Block as BlockType } from '../utils/gameLogic';

interface BlockProps {
  block: BlockType;
  isNew?: boolean;
  initialX?: number;
  centered?: boolean;
}

const Block: React.FC<BlockProps> = ({ block, isNew = false, initialX, centered = false }) => {
  const [mounted, setMounted] = useState(false);
  
  // Apply an effect to make sure new blocks animate in smoothly
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);
  
  // For the base block or first block specifically, use the initialX if provided
  let blockX = initialX !== undefined ? initialX : block.x;
  
  // Apply centering if requested
  const style: React.CSSProperties = {
    width: block.width,
    height: 30,
    left: centered ? '50%' : blockX,
    bottom: block.y,
    backgroundColor: block.color,
    transition: 'opacity 0.3s, transform 0.3s',
    transform: mounted ? (centered ? `translateX(-50%) scale(1)` : 'scale(1)') : 'scale(0.95)',
    zIndex: block.id + 1,
    borderRadius: '2px',
    boxShadow: block.perfect ? '0 0 10px rgba(255, 255, 255, 0.7)' : 'none',
    position: 'absolute',
  };
  
  return (
    <div
      className={`game-block ${isNew ? 'block-enter' : ''} ${mounted ? 'opacity-100' : 'opacity-0'}`}
      style={style}
    >
      {block.perfect && (
        <div className="absolute inset-0 shine-effect"></div>
      )}
    </div>
  );
};

export default Block;
