import React from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import './Header.css';

interface HeaderProps {
  currentUser: User | null;
  users: User[];
  isParentMode: boolean;
  onToggleParentMode: () => void;
  onSwitchUser: (userId: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  currentUser,
  users,
  isParentMode,
  onToggleParentMode,
  onSwitchUser
}) => {
  const childUsers = users.filter(user => user.role === 'child');
  const parentUsers = users.filter(user => user.role === 'parent');

  return (
    <header className="header">
      <div className="header-content">
        <motion.div 
          className="header-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="app-title">
            <span className="app-icon">🦉</span>
            <h1>Chore Chart</h1>
          </div>
          <p className="app-subtitle">Magical Owl Rewards</p>
        </motion.div>

        <motion.div 
          className="header-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {currentUser && (
            <div className="user-info">
              <div className="user-avatar">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} />
                ) : (
                  <span className="avatar-placeholder">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="user-details">
                <h2 className="user-name">{currentUser.name}</h2>
                <span className="user-role">
                  {currentUser.role === 'child' ? '🧒 Child' : '👨‍👩‍👧‍👦 Parent'}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div 
          className="header-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {currentUser && currentUser.role === 'child' && (
            <div className="owl-points-display">
              <div className="owl-icon animate-float">🦉</div>
              <div className="points-info">
                <span className="points-label">Owls</span>
                <span className="points-value">{currentUser.totalOwlPoints}</span>
              </div>
            </div>
          )}

          <div className="header-actions">
            {childUsers.length > 1 && (
              <div className="user-switcher">
                <select
                  value={currentUser?.id || ''}
                  onChange={(e) => onSwitchUser(e.target.value)}
                  className="user-select"
                >
                  {childUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className={`mode-toggle ${isParentMode ? 'parent-mode' : 'child-mode'}`}
              onClick={onToggleParentMode}
              title={isParentMode ? 'Switch to Child Mode' : 'Switch to Parent Mode'}
            >
              {isParentMode ? '👨‍👩‍👧‍👦' : '🧒'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* User selector for mobile */}
      <div className="mobile-user-selector">
        {childUsers.length > 1 && (
          <div className="mobile-user-tabs">
            {childUsers.map(user => (
              <button
                key={user.id}
                className={`mobile-user-tab ${currentUser?.id === user.id ? 'active' : ''}`}
                onClick={() => onSwitchUser(user.id)}
              >
                <div className="mobile-user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="mobile-user-name">{user.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 