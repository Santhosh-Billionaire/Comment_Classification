import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react';
import { Notification } from '../types';
import { getNotifications, markNotificationAsRead } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'mentions' | 'likes' | 'comments' | 'follows'>('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'mentions') return notification.type === 'mention';
    if (activeFilter === 'likes') return notification.type === 'like';
    if (activeFilter === 'comments') return notification.type === 'comment';
    if (activeFilter === 'follows') return notification.type === 'follow';
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={20} className="text-error" />;
      case 'comment':
        return <MessageCircle size={20} className="text-accent-blue" />;
      case 'follow':
        return <UserPlus size={20} className="text-primary" />;
      case 'mention':
        return <AtSign size={20} className="text-accent-blue" />;
      default:
        return <Heart size={20} />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      case 'mention':
        return 'mentioned you in a comment';
      default:
        return 'interacted with you';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Notifications</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            { label: 'All', value: 'all' },
            { label: 'Mentions', value: 'mentions' },
            { label: 'Likes', value: 'likes' },
            { label: 'Comments', value: 'comments' },
            { label: 'Follows', value: 'follows' }
          ].map((filter) => (
            <button
              key={filter.value}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                activeFilter === filter.value
                  ? 'bg-primary text-white'
                  : 'bg-background-lighter text-text-secondary hover:bg-background-card'
              }`}
              onClick={() => setActiveFilter(filter.value as any)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="loader"></div>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-1">
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              className={`card p-3 flex ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                if (!notification.read) {
                  handleMarkAsRead(notification.id);
                }
              }}
            >
              <div className="mr-3 mt-1">{getNotificationIcon(notification.type)}</div>
              
              <div className="flex-1">
                <div className="flex items-start">
                  <Link 
                    to={`/profile/${notification.sourceUser.username}`}
                    className="flex items-center"
                  >
                    {notification.sourceUser.avatar ? (
                      <img 
                        src={notification.sourceUser.avatar}
                        alt={notification.sourceUser.displayName}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                        <span className="text-primary font-bold text-xs">
                          {notification.sourceUser.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </Link>
                  
                  <div className="flex-1">
                    <p>
                      <Link 
                        to={`/profile/${notification.sourceUser.username}`}
                        className="font-medium hover:underline"
                      >
                        {notification.sourceUser.displayName}
                      </Link>{' '}
                      <span>{getNotificationText(notification)}</span>
                    </p>
                    
                    <p className="text-text-secondary text-sm">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
              
              {!notification.read && (
                <div className="h-2 w-2 rounded-full bg-primary self-start mt-2"></div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-2">No notifications found</p>
          <p className="text-text-muted">
            {activeFilter !== 'all' 
              ? `You don't have any ${activeFilter} notifications yet`
              : 'Notifications will appear here when someone interacts with your content'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;