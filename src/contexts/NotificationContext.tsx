import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'enrollment' | 'grade' | 'certificate' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string; // Optional navigation link
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showNotification: (type: NotificationType, title: string, message: string, link?: string) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'pana_notifications';
const MAX_NOTIFICATIONS = 50;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Notification[];
        // Rehydrate Date objects from JSON strings
        return parsed.map(n => ({ ...n, timestamp: new Date(n.timestamp) }));
      }
    } catch {
      // ignore parse errors
    }
    return [];
  });

  const { toast } = useToast();

  // Persist notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore storage errors (e.g. private browsing quota)
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const showNotification = (type: NotificationType, title: string, message: string, link?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newNotification: Notification = {
      id,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      link,
    };

    // Show toast (brief popup)
    toast({
      title,
      description: message,
      variant: type === 'error' ? 'destructive' : 'default',
    });

    // Add to persistent notification list (cap at MAX_NOTIFICATIONS)
    setNotifications(prev => [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, showNotification, removeNotification, markAsRead, markAllAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
