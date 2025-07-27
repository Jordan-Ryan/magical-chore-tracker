import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { Notification } from '../types';
import './NotificationToast.css';

interface NotificationToastProps {
  notification: Notification;
  onRemove: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="notification-icon success" />;
      case 'error':
        return <AlertCircle className="notification-icon error" />;
      case 'warning':
        return <AlertTriangle className="notification-icon warning" />;
      case 'info':
        return <Info className="notification-icon info" />;
      default:
        return <Info className="notification-icon info" />;
    }
  };

  const getTypeClass = () => {
    return `notification-toast ${notification.type}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className={getTypeClass()}
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        layout
      >
        <div className="notification-content">
          <div className="notification-icon-container">
            {getIcon()}
            {notification.showSpell && (
              <motion.div
                className="spell-indicator"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Sparkles className="spell-icon" />
              </motion.div>
            )}
          </div>
          
          <div className="notification-text">
            <h4 className="notification-title">{notification.title}</h4>
            <p className="notification-message">{notification.message}</p>
          </div>
          
          <button 
            className="notification-close"
            onClick={onRemove}
            aria-label="Close notification"
          >
            <X className="close-icon" />
          </button>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        {notification.duration && (
          <motion.div
            className="notification-progress"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ 
              duration: notification.duration / 1000,
              ease: "linear"
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationToast; 