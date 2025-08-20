
// NotificationDropdown.tsx - TypeScript Notification Component

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useClickOutside } from './useClickOutside';
import { INotification, NotificationDropdownProps } from './types';

/**
 * Hook for mobile detection with TypeScript
 */
const useMobileDetection = (): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} => {
  const [screenSize, setScreenSize] = useState<{
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  }>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const checkScreenSize = (): void => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return (): void => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return screenSize;
};

/**
 * Default notifications data
 */
const defaultNotifications: INotification[] = [
  {
    id: 1,
    title: 'New Order',
    message: 'You have a new order from customer',
    time: '2 mins ago',
    unread: true,
    type: 'info',
  },
  {
    id: 2,
    title: 'Payment Received',
    message: 'Payment of $150 has been received',
    time: '5 mins ago',
    unread: true,
    type: 'success',
  },
  {
    id: 3,
    title: 'Product Updated',
    message: 'Your product has been updated successfully',
    time: '1 hour ago',
    unread: false,
    type: 'info',
  },
  {
    id: 4,
    title: 'System Alert',
    message: 'Server maintenance scheduled for tonight',
    time: '2 hours ago',
    unread: false,
    type: 'warning',
  },
];

/**
 * Individual Notification Item Component
 */
interface NotificationItemProps {
  notification: INotification;
  onClick: (notification: INotification) => void;
  onMarkAsRead: (id: string | number) => void;
  className?: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
  onMarkAsRead,
  className = '',
}) => {
  const handleClick = useCallback((): void => {
    onClick(notification);
    if (notification.unread) {
      onMarkAsRead(notification.id);
    }
  }, [notification, onClick, onMarkAsRead]);

  const getTypeColor = (type: INotification['type']): string => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div
      className={`notification-item ${notification.unread ? 'unread' : ''} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Notification: ${notification.title}`}
    >
      <div className="notification-content">
        <h4 className={getTypeColor(notification.type)}>{notification.title}</h4>
        <p>{notification.message}</p>
        <span className="time">{notification.time}</span>
      </div>
      {notification.unread && <div className="unread-indicator" aria-hidden="true" />}
    </div>
  );
};

/**
 * Main NotificationDropdown Component
 */
const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications = defaultNotifications,
  className = '',
  style,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
  maxDisplayCount = 5,
  showUnreadOnly = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notificationList, setNotificationList] = useState<INotification[]>(notifications);

  const { isMobile, isTablet, isDesktop } = useMobileDetection();

  // Click outside functionality
  const dropdownRef = useClickOutside<HTMLDivElement>(
    useCallback(() => {
      setIsOpen(false);
    }, [])
  );

  // Update notifications when props change
  useEffect(() => {
    setNotificationList(notifications);
  }, [notifications]);

  // Filter and limit notifications
  const displayedNotifications = useMemo((): INotification[] => {
    let filtered = showUnreadOnly 
      ? notificationList.filter(n => n.unread)
      : notificationList;

    return filtered.slice(0, maxDisplayCount);
  }, [notificationList, showUnreadOnly, maxDisplayCount]);

  // Calculate unread count
  const unreadCount = useMemo((): number => {
    return notificationList.filter(n => n.unread).length;
  }, [notificationList]);

  // Toggle dropdown
  const toggleDropdown = useCallback((): void => {
    setIsOpen(prev => !prev);
  }, []);

  // Handle notification click
  const handleNotificationClick = useCallback((notification: INotification): void => {
    onNotificationClick?.(notification);
    if (isMobile) {
      setIsOpen(false);
    }
  }, [onNotificationClick, isMobile]);

  // Mark single notification as read
  const handleMarkAsRead = useCallback((id: string | number): void => {
    setNotificationList(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
    onMarkAsRead?.(id);
  }, [onMarkAsRead]);

  // Mark all as read
  const handleMarkAllAsRead = useCallback((): void => {
    setNotificationList(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
    onMarkAllAsRead?.();
  }, [onMarkAllAsRead]);

  // Handle view all
  const handleViewAll = useCallback((): void => {
    onViewAll?.();
    setIsOpen(false);
  }, [onViewAll]);

  // Get dropdown position class
  const getDropdownPositionClass = (): string => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  };

  return (
    <div className={`notification-container ${className}`} style={style} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        className="notification-button"
        onClick={toggleDropdown}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        type="button"
      >
        <svg
          className="w-6 h-6 text-gray-600 dark:text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge" aria-hidden="true">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={`notification-dropdown ${getDropdownPositionClass()}`}
          role="menu"
          aria-label="Notifications menu"
        >
          {/* Header */}
          <div className="dropdown-header">
            <h3>Notifications</h3>
            <div className="header-actions">
              {unreadCount > 0 && (
                <span className="count">{unreadCount} new</span>
              )}
              {unreadCount > 0 && (
                <button
                  className="mark-all-read-btn"
                  onClick={handleMarkAllAsRead}
                  type="button"
                  aria-label="Mark all notifications as read"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="dropdown-content">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            ) : (
              <div className="no-notifications">
                <svg
                  className="no-notifications-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5-5-5 5h5zm0 0v-5"
                  />
                </svg>
                <p>No notifications</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notificationList.length > maxDisplayCount && (
            <div className="dropdown-footer">
              <button 
                className="view-all-btn" 
                onClick={handleViewAll}
                type="button"
                aria-label="View all notifications"
              >
                View All Notifications ({notificationList.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

// Export types for external use
export type { INotification, NotificationDropdownProps };
export { useMobileDetection };
