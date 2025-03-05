
import React, { useRef, useEffect } from 'react';
import { Block as BlockType } from '../utils/gameLogic';

interface BlockProps {
  block: BlockType;
  isBase?: boolean;
  isNew?: boolean;
}

const Block: React.FC<BlockProps> = ({ block, isBase = false, isNew = false }) => {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNew && blockRef.current) {
      blockRef.current.classList.add('block-enter');
      
      const timeout = setTimeout(() => {
        if (blockRef.current) {
          blockRef.current.classList.remove('block-enter');
        }
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [isNew]);

  // Calculate block shadow based on height
  const shadowIntensity = Math.min(0.3, 0.05 + (block.y * 0.01));
  
  return (
    <div
      ref={blockRef}
      className={`absolute game-block ${block.perfect ? 'shine-effect' : ''}`}
      style={{
        left: `${block.x}px`,
        bottom: `${block.y}px`,
        width: `${block.width}px`,
        height: `${isBase ? 10 : 30}px`,
        backgroundColor: block.color,
        boxShadow: `0 ${block.y > 300 ? 8 : 4}px 12px rgba(0, 0, 0, ${shadowIntensity})`,
        borderRadius: '2px',
        zIndex: block.id,
        transform: `${block.perfect ? 'scale(1.02)' : 'scale(1)'}`,
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out'
      }}
    />
  );
};

export default Block;
