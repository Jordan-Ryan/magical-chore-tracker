import React from 'react';
import { motion } from 'framer-motion';
import { TabType, User } from '../types';
import './TabNavigation.css';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentUser: User | null;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  currentUser
}) => {
  const tabs = [
    {
      id: 'chores' as TabType,
      label: 'Chores',
      icon: '🧹',
      description: 'Daily tasks'
    },
    {
      id: 'rewards' as TabType,
      label: 'Rewards',
      icon: '🎁',
      description: 'Owl store'
    },
    {
      id: 'progress' as TabType,
      label: 'Progress',
      icon: '📊',
      description: 'Your stats'
    },
    {
      id: 'settings' as TabType,
      label: 'Settings',
      icon: '⚙️',
      description: 'App settings'
    }
  ];

  return (
    <nav className="tab-navigation">
      <div className="tab-container">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="tab-icon">{tab.icon}</div>
            <div className="tab-content">
              <span className="tab-label">{tab.label}</span>
              <span className="tab-description">{tab.description}</span>
            </div>
            {activeTab === tab.id && (
              <motion.div
                className="tab-indicator"
                layoutId="tabIndicator"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Quick stats for child users */}
      {currentUser && currentUser.role === 'child' && (
        <motion.div 
          className="quick-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="stat-item">
            <span className="stat-icon">🦉</span>
            <span className="stat-value">{currentUser.totalOwlPoints}</span>
            <span className="stat-label">Owls</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✅</span>
            <span className="stat-value">{currentUser.completedChores}</span>
            <span className="stat-label">Done</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{currentUser.currentStreak}</span>
            <span className="stat-label">Streak</span>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default TabNavigation; 