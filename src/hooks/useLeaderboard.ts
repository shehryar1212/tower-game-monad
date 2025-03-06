
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { LeaderboardEntry } from '@/types/leaderboard';

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    }
  });
};
