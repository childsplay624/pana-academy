import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface UserGamification {
  id: string;
  user_id: string;
  total_points: number;
  level: number;
  experience_points: number;
  streak_days: number;
  last_activity_date: string | null;
}

interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string;
  requirement_type: string;
  requirement_value: number;
  points_reward: number;
}

interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badges: Badge;
}

interface PointsHistory {
  id: string;
  user_id: string;
  points: number;
  action_type: string;
  description: string | null;
  reference_id: string | null;
  created_at: string;
}

interface Leaderboard {
  user_id: string;
  total_points: number;
  level: number;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function useGamification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userGamification, setUserGamification] = useState<UserGamification | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([]);
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);

  // Initialize user gamification data
  const initializeGamification = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_gamification')
        .upsert({
          user_id: user.id,
          total_points: 0,
          level: 1,
          experience_points: 0,
          streak_days: 0
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error initializing gamification:', error);
    }
  };

  // Fetch user gamification data
  const fetchUserGamification = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        await initializeGamification();
        return fetchUserGamification();
      }

      setUserGamification(data);
    } catch (error) {
      console.error('Error fetching user gamification:', error);
    }
  };

  // Fetch user badges
  const fetchUserBadges = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setUserBadges(data || []);
    } catch (error) {
      console.error('Error fetching user badges:', error);
    }
  };

  // Fetch all badges
  const fetchAllBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('requirement_value', { ascending: true });

      if (error) throw error;
      setAllBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  // Fetch points history
  const fetchPointsHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('points_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPointsHistory(data || []);
    } catch (error) {
      console.error('Error fetching points history:', error);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('user_gamification')
        .select(`
          user_id,
          total_points,
          level
        `)
        .order('total_points', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Fetch profiles separately to avoid relation issues
      if (data && data.length > 0) {
        const userIds = data.map(item => item.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);

        const leaderboardWithProfiles = data.map(item => ({
          ...item,
          profiles: profiles?.find(p => p.id === item.user_id) || null
        }));

        setLeaderboard(leaderboardWithProfiles);
      } else {
        setLeaderboard([]);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  // Award points function
  const awardPoints = async (
    points: number,
    actionType: string,
    description?: string,
    referenceId?: string
  ) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('award_points', {
        _user_id: user.id,
        _points: points,
        _action_type: actionType,
        _description: description,
        _reference_id: referenceId
      });

      if (error) throw error;

      // Refresh data
      await Promise.all([
        fetchUserGamification(),
        fetchPointsHistory()
      ]);

      toast({
        title: "Points Earned! 🎉",
        description: `You earned ${points} points for ${description || actionType}`,
      });

      // Check for new badges
      await checkAndAwardBadges();

      return true;
    } catch (error) {
      console.error('Error awarding points:', error);
      return false;
    }
  };

  // Update streak
  const updateStreak = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('update_user_streak', {
        _user_id: user.id
      });

      if (error) throw error;
      await fetchUserGamification();
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  // Check and award badges
  const checkAndAwardBadges = async () => {
    if (!user || !userGamification) return;

    try {
      // Get stats for badge checking
      const { count: lessonCount } = await supabase
        .from('lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', user.id)
        .eq('completed', true);

      const { count: courseCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', user.id)
        .eq('status', 'completed');

      const earnedBadgeIds = userBadges.map(ub => ub.badge_id);
      
      for (const badge of allBadges) {
        if (earnedBadgeIds.includes(badge.id)) continue;

        let shouldAward = false;

        switch (badge.requirement_type) {
          case 'lessons_completed':
            shouldAward = (lessonCount || 0) >= badge.requirement_value;
            break;
          case 'courses_completed':
            shouldAward = (courseCount || 0) >= badge.requirement_value;
            break;
          case 'streak_days':
            shouldAward = userGamification.streak_days >= badge.requirement_value;
            break;
          case 'points_earned':
            shouldAward = userGamification.total_points >= badge.requirement_value;
            break;
        }

        if (shouldAward) {
          // Award badge
          const { error } = await supabase
            .from('user_badges')
            .insert({
              user_id: user.id,
              badge_id: badge.id
            });

          if (!error) {
            // Award badge points
            await awardPoints(
              badge.points_reward,
              'badge_earned',
              `Earned badge: ${badge.name}`,
              badge.id
            );

            toast({
              title: "New Badge Unlocked! 🏆",
              description: `You earned the "${badge.name}" badge!`,
            });
          }
        }
      }

      await fetchUserBadges();
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  // Get level progress
  const getLevelProgress = () => {
    if (!userGamification) return { current: 0, required: 100, percentage: 0 };
    
    const currentLevel = userGamification.level;
    const currentExp = userGamification.experience_points;
    
    // Level thresholds: Level n requires (n-1)^2 * 100 exp
    const currentLevelThreshold = Math.pow(currentLevel - 1, 2) * 100;
    const nextLevelThreshold = Math.pow(currentLevel, 2) * 100;
    
    const progressInLevel = currentExp - currentLevelThreshold;
    const expRequiredForLevel = nextLevelThreshold - currentLevelThreshold;
    const percentage = Math.min((progressInLevel / expRequiredForLevel) * 100, 100);

    return {
      current: progressInLevel,
      required: expRequiredForLevel,
      percentage: Math.round(percentage)
    };
  };

  // Fetch all data
  const fetchAllData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchUserGamification(),
        fetchUserBadges(),
        fetchAllBadges(),
        fetchPointsHistory(),
        fetchLeaderboard()
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    userGamification,
    userBadges,
    allBadges,
    pointsHistory,
    leaderboard,
    awardPoints,
    updateStreak,
    checkAndAwardBadges,
    getLevelProgress,
    refresh: fetchAllData
  };
}