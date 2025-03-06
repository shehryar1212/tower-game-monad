import React from 'react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Trophy, Medal, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const Leaderboard = () => {
  const { data: leaderboard, isLoading } = useLeaderboard();

  if (isLoading) {
    return (
      <div className="w-full max-w-sm p-4 animate-pulse">
        <div className="h-8 bg-muted rounded mb-4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-500" />
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        {/* Podium (Top 3) */}
        <div className="flex justify-center items-end gap-4 mb-8 pt-8">
          {/* Second Place */}
          {leaderboard && leaderboard[1] && (
            <div className="flex flex-col items-center">
              <User className="w-8 h-8 text-gray-400" />
              <div className="text-sm font-medium truncate max-w-[80px]">
                {leaderboard[1].player_name}
              </div>
              <div className="text-sm text-muted-foreground">{leaderboard[1].score}</div>
              <div className="w-16 h-20 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <Medal className="text-gray-400" />
              </div>
            </div>
          )}

          {/* First Place */}
          {leaderboard && leaderboard[0] && (
            <div className="flex flex-col items-center">
              <User className="w-10 h-10 text-yellow-500" />
              <div className="text-base font-bold truncate max-w-[80px]">
                {leaderboard[0].player_name}
              </div>
              <div className="text-sm text-muted-foreground">{leaderboard[0].score}</div>
              <div className="w-16 h-24 bg-yellow-100 rounded-t-lg flex items-center justify-center">
                <Trophy className="text-yellow-500" />
              </div>
            </div>
          )}

          {/* Third Place */}
          {leaderboard && leaderboard[2] && (
            <div className="flex flex-col items-center">
              <User className="w-8 h-8 text-amber-700" />
              <div className="text-sm font-medium truncate max-w-[80px]">
                {leaderboard[2].player_name}
              </div>
              <div className="text-sm text-muted-foreground">{leaderboard[2].score}</div>
              <div className="w-16 h-16 bg-amber-100 rounded-t-lg flex items-center justify-center">
                <Medal className="text-amber-700" />
              </div>
            </div>
          )}
        </div>

        {/* Rest of the leaderboard */}
        <div className="space-y-2">
          {leaderboard?.slice(3).map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
            >
              <span className="w-6 text-center font-medium">{index + 4}</span>
              <User className="w-5 h-5" />
              <span className="flex-1 font-medium truncate">{entry.player_name}</span>
              <span className="text-muted-foreground">{entry.score}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Leaderboard;
