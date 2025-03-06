
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { LeaderboardEntry } from '@/types/leaderboard';

// Mock data to show when Supabase is not available
const mockLeaderboardData: LeaderboardEntry[] = [
  { id: '1', player_name: 'Champion', score: 325, created_at: new Date().toISOString() },
  { id: '2', player_name: 'Runner-up', score: 290, created_at: new Date().toISOString() },
  { id: '3', player_name: 'ThirdPlace', score: 268, created_at: new Date().toISOString() },
  { id: '4', player_name: 'ProGamer', score: 255, created_at: new Date().toISOString() },
  { id: '5', player_name: 'BlockMaster', score: 241, created_at: new Date().toISOString() },
  { id: '6', player_name: 'TowerExpert', score: 230, created_at: new Date().toISOString() },
  { id: '7', player_name: 'StackKing', score: 218, created_at: new Date().toISOString() },
  { id: '8', player_name: 'BuilderOne', score: 205, created_at: new Date().toISOString() },
  { id: '9', player_name: 'BlockStacker', score: 193, created_at: new Date().toISOString() },
  { id: '10', player_name: 'GamePlayer', score: 180, created_at: new Date().toISOString() },
];

// Check if we're using placeholder Supabase credentials
const isUsingPlaceholderCredentials = () => {
  return !import.meta.env.VITE_SUPABASE_URL || 
         import.meta.env.VITE_SUPABASE_URL === 'https://placeholder-url.supabase.co';
};

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      try {
        // Check if we're using placeholder values
        if (isUsingPlaceholderCredentials()) {
          console.log('Using mock leaderboard data since Supabase is not configured');
          return mockLeaderboardData;
        }

        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .order('score', { ascending: false })
          .limit(10);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Use mock data as fallback when there's an error
        console.log('Falling back to mock leaderboard data');
        return mockLeaderboardData;
      }
    },
    // Prevent retries causing too many requests
    retry: 1,
    // Gracefully fail without breaking the whole app
    refetchOnWindowFocus: false
  });
};
