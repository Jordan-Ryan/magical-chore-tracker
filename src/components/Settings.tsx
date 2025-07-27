import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Users, 
  Shield, 
  Palette, 
  Bell, 
  Save,
  Plus,
  Trash2,
  Edit,
  User as UserIcon,
  Baby,
  Crown
} from 'lucide-react';
import { AppState, User, Chore, Reward } from '../types';
import { v4 as uuidv4 } from 'uuid';
import './Settings.css';

interface SettingsProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  isParentMode: boolean;
}

const Settings: React.FC<SettingsProps> = ({ appState, setAppState, isParentMode }) => {
  const [activeSection, setActiveSection] = useState<'general' | 'users' | 'appearance' | 'notifications'>('general');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'child' | 'parent'>('child');

  if (!isParentMode) {
    return (
      <div className="settings-locked">
        <motion.div 
          className="locked-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Shield className="lock-icon" />
          <h2>🔒 Parent Access Required</h2>
          <p>Only parents can access the settings. Please switch to parent mode to manage the app configuration.</p>
        </motion.div>
      </div>
    );
  }

  const addUser = () => {
    if (!newUserName.trim()) return;

    const newUser: User = {
      id: uuidv4(),
      name: newUserName.trim(),
      role: newUserRole,
      totalOwlPoints: 0,
      earnedOwlPoints: 0,
      spentOwlPoints: 0,
      completedChores: 0,
      currentStreak: 0,
      longestStreak: 0,
      joinDate: new Date()
    };

    setAppState(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));

    setNewUserName('');
    setNewUserRole('child');
  };

  const deleteUser = (userId: string) => {
    if (appState.users.length <= 1) return; // Don't delete the last user
    
    setAppState(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId),
      currentUser: prev.currentUser?.id === userId ? prev.users[0] : prev.currentUser
    }));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setAppState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, ...updates } : u),
      currentUser: prev.currentUser?.id === userId ? { ...prev.currentUser, ...updates } : prev.currentUser
    }));
  };

  const resetAllData = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      localStorage.removeItem('choreChartState');
      window.location.reload();
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chore-chart-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setAppState(data);
        localStorage.setItem('choreChartState', JSON.stringify(data));
      } catch (error) {
        alert('Invalid backup file. Please try again.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="settings">
      <motion.div 
        className="settings-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>⚙️ Settings & Configuration</h2>
        <p>Manage your magical chore chart settings</p>
      </motion.div>

      <div className="settings-container">
        {/* Navigation */}
        <motion.div 
          className="settings-nav"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <button 
            className={`nav-item ${activeSection === 'general' ? 'active' : ''}`}
            onClick={() => setActiveSection('general')}
          >
            <SettingsIcon className="nav-icon" />
            <span>General</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <Users className="nav-icon" />
            <span>Users</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveSection('appearance')}
          >
            <Palette className="nav-icon" />
            <span>Appearance</span>
          </button>
          <button 
            className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            <Bell className="nav-icon" />
            <span>Notifications</span>
          </button>
        </motion.div>

        {/* Content */}
        <motion.div 
          className="settings-content"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {activeSection === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              
              <div className="setting-group">
                <h4>Data Management</h4>
                <div className="setting-actions">
                  <button className="action-btn export" onClick={exportData}>
                    <Save className="btn-icon" />
                    Export Data
                  </button>
                  <label className="action-btn import">
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={importData}
                      style={{ display: 'none' }}
                    />
                    <Save className="btn-icon" />
                    Import Data
                  </label>
                  <button className="action-btn danger" onClick={resetAllData}>
                    <Trash2 className="btn-icon" />
                    Reset All Data
                  </button>
                </div>
              </div>

              <div className="setting-group">
                <h4>App Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Version</span>
                    <span className="info-value">1.0.0</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Users</span>
                    <span className="info-value">{appState.users.length}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Chores</span>
                    <span className="info-value">{appState.chores.length}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Rewards</span>
                    <span className="info-value">{appState.rewards.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="settings-section">
              <h3>User Management</h3>
              
              <div className="setting-group">
                <h4>Add New User</h4>
                <div className="add-user-form">
                  <input
                    type="text"
                    placeholder="Enter user name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="user-input"
                  />
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as 'child' | 'parent')}
                    className="role-select"
                  >
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                  </select>
                  <button className="add-btn" onClick={addUser}>
                    <Plus className="btn-icon" />
                    Add User
                  </button>
                </div>
              </div>

              <div className="setting-group">
                <h4>Manage Users</h4>
                <div className="users-list">
                  {appState.users.map((user) => (
                    <motion.div 
                      key={user.id}
                      className="user-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.role === 'parent' ? <Crown className="avatar-icon" /> : <Baby className="avatar-icon" />}
                        </div>
                        <div className="user-details">
                          <span className="user-name">{user.name}</span>
                          <span className="user-role">{user.role}</span>
                        </div>
                      </div>
                      <div className="user-stats">
                        <span className="stat">{user.totalOwlPoints} 🦉</span>
                        <span className="stat">{user.completedChores} ✅</span>
                      </div>
                      <div className="user-actions">
                        <button 
                          className="action-btn small"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="btn-icon" />
                        </button>
                        {appState.users.length > 1 && (
                          <button 
                            className="action-btn small danger"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Trash2 className="btn-icon" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="settings-section">
              <h3>Appearance Settings</h3>
              
              <div className="setting-group">
                <h4>Theme Options</h4>
                <p>Theme customization coming soon! 🎨</p>
                <div className="theme-preview">
                  <div className="theme-option">
                    <div className="theme-preview-box current">
                      <span>Current Theme</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="setting-group">
                <h4>Animation Settings</h4>
                <div className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" defaultChecked />
                    <span>Enable Animations</span>
                  </label>
                </div>
                <div className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" defaultChecked />
                    <span>Show Spell Effects</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              
              <div className="setting-group">
                <h4>Notification Preferences</h4>
                <div className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" defaultChecked />
                    <span>Chore Completion Notifications</span>
                  </label>
                </div>
                <div className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" defaultChecked />
                    <span>Reward Redemption Notifications</span>
                  </label>
                </div>
                <div className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" defaultChecked />
                    <span>Achievement Unlock Notifications</span>
                  </label>
                </div>
                <div className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" />
                    <span>Daily Reminders</span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <h4>Sound Settings</h4>
                <div className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" defaultChecked />
                    <span>Enable Sound Effects</span>
                  </label>
                </div>
                <div className="setting-item">
                  <label className="setting-label">
                    <input type="checkbox" defaultChecked />
                    <span>Spell Casting Sounds</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings; 