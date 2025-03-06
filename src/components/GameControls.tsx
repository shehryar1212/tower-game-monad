
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GameState } from '../utils/gameLogic';
import { WalletInfo } from '../utils/walletUtils';
import { payGameFee, formatMonadAmount, GAME_FEE } from '../contracts/GameContract';
import { useToast } from '@/hooks/use-toast';
import AnimatedScore from './AnimatedScore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GameControlsProps {
  gameState: GameState;
  walletInfo: WalletInfo;
  onStartGame: () => void;
  onResetGame: () => void;
  onPlaceBlock: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  walletInfo,
  onStartGame,
  onResetGame,
  onPlaceBlock,
}) => {
  const { toast } = useToast();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleStartGame = async () => {
    if (!walletInfo.connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to play",
        variant: "destructive",
      });
      return;
    }
    
    // Instead of attempting payment immediately, show the payment confirmation dialog
    setShowPaymentDialog(true);
  };

  const handlePaymentConfirm = async () => {
    try {
      // Attempt to pay the game fee
      const success = await payGameFee(walletInfo);
      
      if (success) {
        toast({
          title: "Payment successful",
          description: "Your game fee has been processed. Good luck!",
        });
        
        // Close the dialog first
        setShowPaymentDialog(false);
        
        // Use setTimeout to ensure UI updates before game starts
        setTimeout(() => {
          onStartGame();
        }, 100);
      }
    } catch (error: any) {
      setShowPaymentDialog(false);
      toast({
        title: "Payment failed",
        description: error.message || "Failed to process game fee",
        variant: "destructive",
      });
    }
  };

  if (gameState.gameOver) {
    return (
      <>
        <div className="flex flex-col items-center gap-4 mt-4 bounce-in">
          <div className="text-xl font-bold mb-2">Game Over!</div>
          <div className="text-sm text-muted-foreground mb-4">
            Final Score: <AnimatedScore score={gameState.score} />
            {gameState.score >= gameState.highScore && gameState.score > 0 && (
              <span className="ml-2 text-game-block-success shine-effect">New High Score!</span>
            )}
          </div>
          <Button 
            className="bg-game-primary hover:bg-game-primary/90 text-white button-hover"
            onClick={handleStartGame}
          >
            Play Again
          </Button>
        </div>

        <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <AlertDialogContent className="scale-in">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
              <AlertDialogDescription>
                To play this game, a fee of {formatMonadAmount(GAME_FEE)} will be charged from your wallet.
                Do you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePaymentConfirm}>
                Pay & Play
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  if (!gameState.gameStarted) {
    return (
      <>
        <div className="flex flex-col items-center gap-4 mt-4 bounce-in">
          <div className="text-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Tower Blocks</h2>
            <p className="text-sm text-muted-foreground max-w-xs md:max-w-sm">
              Stack blocks to build the tallest tower. Click or tap to place a block.
            </p>
          </div>
          <Button 
            className="bg-game-primary hover:bg-game-primary/90 text-white button-hover"
            onClick={handleStartGame}
            disabled={!walletInfo.connected}
          >
            Start Game
          </Button>
        </div>

        <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <AlertDialogContent className="scale-in">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
              <AlertDialogDescription>
                To play this game, a fee of {formatMonadAmount(GAME_FEE)} will be charged from your wallet.
                Do you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePaymentConfirm}>
                Pay & Play
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <div className="flex justify-center w-full mt-4 slide-in-left">
      <Button 
        className="w-full max-w-xs bg-game-primary hover:bg-game-primary/90 text-white button-hover"
        onClick={onPlaceBlock}
      >
        Place Block
      </Button>
    </div>
  );
};

export default GameControls;
