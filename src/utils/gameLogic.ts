
export interface Block {
  id: number;
  width: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  perfect: boolean;
}

export interface GameState {
  blocks: Block[];
  currentBlock: Block | null;
  score: number;
  gameOver: boolean;
  highScore: number;
  gameStarted: boolean;
  direction: 'left' | 'right';
  level: number;
  combo: number;
}

export const GAME_WIDTH = 600;
export const INITIAL_BLOCK_WIDTH = GAME_WIDTH * 0.3;
export const BLOCK_HEIGHT = 30;
export const INITIAL_BLOCK_SPEED = 2;
export const MAX_SPEED = 8;
export const PERFECT_MARGIN = 5; // Pixels margin to consider a perfect landing

export const COLORS = [
  '#007AFF', // Blue
  '#5AC8FA', // Light Blue
  '#34C759', // Green
  '#FF9500', // Orange
  '#FF2D55', // Pink
  '#AF52DE', // Purple
];

export const createInitialState = (): GameState => {
  const baseBlock: Block = {
    id: 0,
    width: INITIAL_BLOCK_WIDTH,
    x: (GAME_WIDTH - INITIAL_BLOCK_WIDTH) / 2,
    y: 0,
    speed: INITIAL_BLOCK_SPEED,
    color: COLORS[0],
    perfect: false,
  };

  return {
    blocks: [baseBlock],
    currentBlock: null,
    score: 0,
    gameOver: false,
    highScore: getHighScore(),
    gameStarted: false,
    direction: 'right',
    level: 1,
    combo: 0,
  };
};

export const getHighScore = (): number => {
  const storedScore = localStorage.getItem('highScore');
  return storedScore ? parseInt(storedScore) : 0;
};

export const saveHighScore = (score: number): void => {
  const currentHighScore = getHighScore();
  if (score > currentHighScore) {
    localStorage.setItem('highScore', score.toString());
  }
};

export const createNextBlock = (state: GameState): Block => {
  const lastBlock = state.blocks[state.blocks.length - 1];
  const newBlockWidth = lastBlock.perfect ? lastBlock.width : Math.max(lastBlock.width * 0.95, 30);
  
  // Calculate level-based speed increase
  const levelSpeedMultiplier = 1 + (state.level - 1) * 0.2;
  const newSpeed = Math.min(lastBlock.speed * levelSpeedMultiplier, MAX_SPEED);
  
  // Alternate starting position
  const startFromLeft = state.direction === 'right';
  const newX = startFromLeft ? -newBlockWidth : GAME_WIDTH;
  
  return {
    id: lastBlock.id + 1,
    width: newBlockWidth,
    x: newX,
    y: (state.blocks.length) * BLOCK_HEIGHT,
    speed: newSpeed,
    color: COLORS[state.blocks.length % COLORS.length],
    perfect: false,
  };
};

export const updateBlockPosition = (block: Block, direction: 'left' | 'right'): Block => {
  let newX = block.x;
  
  if (direction === 'right') {
    newX += block.speed;
    if (newX > GAME_WIDTH) {
      return { ...block, x: -block.width };
    }
  } else {
    newX -= block.speed;
    if (newX + block.width < 0) {
      return { ...block, x: GAME_WIDTH };
    }
  }
  
  return { ...block, x: newX };
};

export const placeBlock = (state: GameState): GameState => {
  if (!state.currentBlock || state.blocks.length === 0 || state.gameOver) {
    return state;
  }
  
  const lastBlock = state.blocks[state.blocks.length - 1];
  const currentBlock = { ...state.currentBlock };
  
  // Check if the current block is within the boundaries of the last block
  const rightEdgeOfCurrent = currentBlock.x + currentBlock.width;
  const rightEdgeOfLast = lastBlock.x + lastBlock.width;
  
  // Calculate overlap
  const leftOverlap = Math.max(0, rightEdgeOfLast - currentBlock.x);
  const rightOverlap = Math.max(0, rightEdgeOfCurrent - lastBlock.x);
  const overlapWidth = Math.min(leftOverlap, rightOverlap);
  
  if (overlapWidth <= 0) {
    // Block missed, game over
    return {
      ...state,
      gameOver: true,
      currentBlock: null
    };
  }
  
  // Calculate the new block position and width
  const newX = Math.max(currentBlock.x, lastBlock.x);
  const newWidth = overlapWidth;
  
  // Check if it's a perfect placement
  const isPerfect = Math.abs(newWidth - lastBlock.width) <= PERFECT_MARGIN 
                 && Math.abs(newX - lastBlock.x) <= PERFECT_MARGIN;
  
  const placedBlock: Block = {
    ...currentBlock,
    x: newX,
    width: newWidth,
    perfect: isPerfect
  };
  
  // Update combo count
  const newCombo = isPerfect ? state.combo + 1 : 0;
  
  // Calculate score bonus
  const perfectBonus = isPerfect ? 10 : 0;
  const comboBonus = newCombo > 1 ? newCombo * 5 : 0;
  const scoreIncrease = 1 + perfectBonus + comboBonus;
  
  // Calculate new level (every 5 blocks)
  const newLevel = Math.floor(state.blocks.length / 5) + 1;
  
  // Fix: explicitly type the direction as 'left' | 'right'
  const newDirection: 'left' | 'right' = state.direction === 'left' ? 'right' : 'left';
  
  // Create the next block immediately
  const nextBlock = createNextBlock({
    ...state,
    blocks: [...state.blocks, placedBlock],
    direction: newDirection,
    level: newLevel
  });
  
  // Update game state
  const newState = {
    ...state,
    blocks: [...state.blocks, placedBlock],
    currentBlock: nextBlock, // Immediately set the next block
    score: state.score + scoreIncrease,
    level: newLevel,
    combo: newCombo,
    direction: newDirection,
    gameOver: state.gameOver,
    highScore: state.highScore,
    gameStarted: state.gameStarted
  };
  
  // Save high score if needed
  if (newState.score > state.highScore) {
    saveHighScore(newState.score);
    newState.highScore = newState.score;
  }
  
  return newState;
};

export const startGame = (state: GameState): GameState => {
  if (state.gameStarted) return state;
  
  const newState = createInitialState();
  newState.gameStarted = true;
  newState.currentBlock = createNextBlock(newState);
  
  return newState;
};

export const resetGame = (): GameState => {
  const newState = createInitialState();
  return newState;
};

export const updateGame = (state: GameState): GameState => {
  if (!state.gameStarted || state.gameOver || !state.currentBlock) {
    return state;
  }
  
  // Update current block position
  const updatedBlock = updateBlockPosition(state.currentBlock, state.direction);
  
  return {
    ...state,
    currentBlock: updatedBlock
  };
};
