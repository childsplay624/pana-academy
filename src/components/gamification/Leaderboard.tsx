import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  level: number;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentUserId?: string;
}

export function Leaderboard({ leaderboard, currentUserId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <div className="h-5 w-5 flex items-center justify-center text-sm font-bold">{rank}</div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaderboard.map((entry, index) => {
          const rank = index + 1;
          const isCurrentUser = entry.user_id === currentUserId;
          
          return (
            <div
              key={entry.user_id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(rank)}
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.profiles?.avatar_url || ''} />
                <AvatarFallback>
                  {entry.profiles?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">
                    {entry.profiles?.full_name || 'Anonymous User'}
                    {isCurrentUser && (
                      <span className="text-primary text-sm ml-1">(You)</span>
                    )}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Level {entry.level}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {entry.total_points.toLocaleString()} points
                </p>
              </div>
              
              {rank <= 3 && (
                <div 
                  className={`px-2 py-1 rounded-full text-white text-xs font-bold ${getRankColor(rank)}`}
                >
                  #{rank}
                </div>
              )}
            </div>
          );
        })}
        
        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No leaderboard data yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}