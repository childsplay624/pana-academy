import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeData {
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
  badge_id: string;
  earned_at: string;
  badges: BadgeData;
}

interface BadgeDisplayProps {
  userBadges: UserBadge[];
  allBadges: BadgeData[];
  compact?: boolean;
}

export function BadgeDisplay({ userBadges, allBadges, compact = false }: BadgeDisplayProps) {
  const earnedBadgeIds = userBadges.map(ub => ub.badge_id);
  
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {userBadges.slice(0, 3).map((userBadge) => (
          <TooltipProvider key={userBadge.id}>
            <Tooltip>
              <TooltipTrigger>
                <div 
                  className="flex items-center justify-center w-8 h-8 rounded-full text-lg border-2"
                  style={{ 
                    borderColor: userBadge.badges.color,
                    backgroundColor: `${userBadge.badges.color}20`
                  }}
                >
                  {userBadge.badges.icon || '🏆'}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-semibold">{userBadge.badges.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {userBadge.badges.description}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        {userBadges.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{userBadges.length - 3} more
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {allBadges.map((badge) => {
        const isEarned = earnedBadgeIds.includes(badge.id);
        const userBadge = userBadges.find(ub => ub.badge_id === badge.id);
        
        return (
          <Card 
            key={badge.id} 
            className={`transition-all hover:scale-105 ${
              isEarned ? 'ring-2' : 'opacity-60'
            }`}
            style={isEarned ? { borderColor: badge.color } : {}}
          >
            <CardContent className="p-4 text-center space-y-2">
              <div 
                className="flex items-center justify-center w-16 h-16 rounded-full text-2xl mx-auto border-4"
                style={{ 
                  borderColor: badge.color,
                  backgroundColor: isEarned ? `${badge.color}20` : 'transparent'
                }}
              >
                {badge.icon || '🏆'}
              </div>
              
              <div>
                <h4 className="font-semibold text-sm">{badge.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {badge.description}
                </p>
              </div>
              
              <div className="space-y-1">
                <Badge variant={isEarned ? "default" : "outline"} className="text-xs">
                  {badge.points_reward} pts
                </Badge>
                {isEarned && userBadge && (
                  <p className="text-xs text-green-600 font-medium">
                    Earned {new Date(userBadge.earned_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}