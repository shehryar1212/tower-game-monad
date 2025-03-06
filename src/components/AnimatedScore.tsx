
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedScoreProps {
  score: number;
  className?: string;
}

const AnimatedScore: React.FC<AnimatedScoreProps> = ({ score, className = '' }) => {
  const [displayScore, setDisplayScore] = useState(score);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevScoreRef = useRef(score);

  useEffect(() => {
    if (score !== prevScoreRef.current) {
      setIsAnimating(true);
      
      // Animate score counting up
      const difference = score - prevScoreRef.current;
      const increment = difference > 0 ? 1 : -1;
      const steps = Math.abs(difference);
      
      let current = prevScoreRef.current;
      const interval = Math.max(5, 200 / steps); // Adjust speed based on difference
      
      const timer = setInterval(() => {
        current += increment;
        setDisplayScore(current);
        
        if ((increment > 0 && current >= score) || 
            (increment < 0 && current <= score)) {
          clearInterval(timer);
          setDisplayScore(score);
          setIsAnimating(false);
        }
      }, interval);
      
      prevScoreRef.current = score;
      return () => clearInterval(timer);
    }
  }, [score]);

  return (
    <span className={`relative ${className} ${isAnimating ? 'text-game-primary' : ''}`}>
      <span className={`transition-colors duration-300 ${isAnimating ? 'scale-110' : ''}`} 
            style={{ display: 'inline-block', transition: 'transform 0.3s' }}>
        {displayScore}
      </span>
      {isAnimating && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-xs text-game-block-success animate-fadeUp">
          +{score - prevScoreRef.current + 1}
        </span>
      )}
    </span>
  );
};

export default AnimatedScore;
