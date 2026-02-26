import { Bell, X, BookOpen, Award, Star, Info, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications, NotificationType, Notification } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const typeConfig: Record<NotificationType, {
  icon: React.ElementType;
  color: string;
  bg: string;
}> = {
  enrollment: { icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  certificate: { icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  grade: { icon: Star, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  error: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  warning: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  system: { icon: Info, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
};

function NotificationItem({ notification, onRemove, onMarkRead }: {
  notification: Notification;
  onRemove: (id: string) => void;
  onMarkRead: (id: string) => void;
}) {
  const navigate = useNavigate();
  const config = typeConfig[notification.type] || typeConfig.info;
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.read) onMarkRead(notification.id);
    if (notification.link) navigate(notification.link);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'relative flex items-start gap-3 px-4 py-3 transition-colors duration-150 group',
        !notification.read ? 'bg-blue-50/40 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        notification.link && 'cursor-pointer'
      )}
      onClick={handleClick}
    >
      {/* Type icon */}
      <div className={cn('flex-shrink-0 mt-0.5 p-1.5 rounded-full', config.bg)}>
        <Icon className={cn('h-3.5 w-3.5', config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm font-medium leading-tight', !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300')}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-blue-500" aria-label="Unread" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
        <p className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
        </p>
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(notification.id);
        }}
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </motion.div>
  );
}

export function NotificationBell() {
  const { notifications, unreadCount, removeNotification, markAsRead, markAllAsRead, clearAll } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-600 hover:text-white dark:text-gray-300 dark:hover:text-white transition-all duration-200"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell className="h-5 w-5 transition-transform duration-200 ease-in-out hover:rotate-12" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0 shadow-xl" align="end">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-400 hover:text-red-500"
                onClick={clearAll}
                aria-label="Clear all notifications"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        {notifications.length > 0 ? (
          <ScrollArea className="max-h-[420px]">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              <AnimatePresence initial={false}>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRemove={removeNotification}
                    onMarkRead={markAsRead}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col h-36 items-center justify-center text-muted-foreground gap-2">
            <Bell className="h-8 w-8 opacity-30" />
            <div className="text-center">
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs text-gray-400">No new notifications</p>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
