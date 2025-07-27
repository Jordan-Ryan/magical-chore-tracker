import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { AppState, User, Chore, Reward, TabType, Notification } from './types';
import { DEFAULT_CHORES, DEFAULT_REWARDS } from './data/constants';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import ChoresDashboard from './components/ChoresDashboard';
import RewardsStore from './components/RewardsStore';
import ProgressTracker from './components/ProgressTracker';
import Settings from './components/Settings';
import SpellAnimation from './components/SpellAnimation';
import NotificationToast from './components/NotificationToast';
import './App.css';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('choreChartState');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Initialize with default data
    const defaultUsers: User[] = [
      {
        id: uuidv4(),
        name: 'Esmé',
        role: 'child',
        totalOwlPoints: 0,
        earnedOwlPoints: 0,
        spentOwlPoints: 0,
        completedChores: 0,
        currentStreak: 0,
        longestStreak: 0,
        joinDate: new Date()
      },
      {
        id: uuidv4(),
        name: 'Parent',
        role: 'parent',
        totalOwlPoints: 0,
        earnedOwlPoints: 0,
        spentOwlPoints: 0,
        completedChores: 0,
        currentStreak: 0,
        longestStreak: 0,
        joinDate: new Date()
      }
    ];

    const defaultChores: Chore[] = DEFAULT_CHORES.map(template => ({
      id: uuidv4(),
      name: template.name,
      description: template.description,
      owlPoints: template.defaultOwlPoints,
      isCompleted: false,
      requiresApproval: false,
      category: template.category,
      icon: template.icon,
      color: template.color,
      streak: 0
    }));

    const defaultRewards: Reward[] = DEFAULT_REWARDS.map(template => ({
      id: uuidv4(),
      name: template.name,
      description: template.description,
      owlCost: template.defaultOwlCost,
      spell: template.spell,
      spellDescription: template.spellDescription,
      icon: template.icon,
      color: template.color,
      isActive: true,
      category: template.category,
      currentUses: 0
    }));

    return {
      users: defaultUsers,
      currentUser: defaultUsers[0], // Start with child
      chores: defaultChores,
      rewards: defaultRewards,
      choreCompletions: [],
      rewardRedemptions: [],
      isParentMode: false,
      showSpellAnimation: false,
      currentSpell: null
    };
  });

  const [activeTab, setActiveTab] = useState<TabType>('chores');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('choreChartState', JSON.stringify(appState));
  }, [appState]);

  // Add notification
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4()
    };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after duration
    if (notification.duration !== undefined) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, notification.duration);
    }
  };

  // Complete a chore
  const completeChore = (choreId: string) => {
    const chore = appState.chores.find(c => c.id === choreId);
    const currentUser = appState.currentUser;
    
    if (!chore || !currentUser) return;

    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const lastCompleted = chore.lastCompletedDate ? format(chore.lastCompletedDate, 'yyyy-MM-dd') : null;
    
    // Check if already completed today
    if (lastCompleted === today) {
      addNotification({
        type: 'warning',
        title: 'Already Completed!',
        message: 'This chore has already been completed today!',
        duration: 3000
      });
      return;
    }

    // Calculate dynamic points (decrease if done recently)
    let points = chore.owlPoints;
    if (lastCompleted && isYesterday(lastCompleted)) {
      points = Math.max(1, Math.floor(points * 0.7)); // 30% reduction
    }

    // Check if parent approval is required for children
    if (chore.requiresApproval && currentUser.role === 'child') {
      // Create pending completion record
      const choreCompletion = {
        id: uuidv4(),
        choreId,
        userId: currentUser.id,
        completedAt: now,
        owlPointsEarned: points,
        isApproved: false
      };

      setAppState(prev => ({
        ...prev,
        choreCompletions: [...prev.choreCompletions, choreCompletion]
      }));

      addNotification({
        type: 'info',
        title: 'Chore Submitted! 📋',
        message: 'Your chore has been submitted for parent approval.',
        duration: 3000
      });
      
      return;
    }

    // Auto-approve for parents or chores that don't require approval
    const updatedChore: Chore = {
      ...chore,
      isCompleted: true,
      completedAt: now,
      completedBy: currentUser.id,
      lastCompletedDate: now,
      streak: lastCompleted && isYesterday(lastCompleted) ? chore.streak + 1 : 1,
      isApproved: true
    };

    const updatedUser: User = {
      ...currentUser,
      totalOwlPoints: currentUser.totalOwlPoints + points,
      earnedOwlPoints: currentUser.earnedOwlPoints + points,
      completedChores: currentUser.completedChores + 1,
      currentStreak: Math.max(currentUser.currentStreak, updatedChore.streak),
      longestStreak: Math.max(currentUser.longestStreak, updatedChore.streak)
    };

    const choreCompletion = {
      id: uuidv4(),
      choreId,
      userId: currentUser.id,
      completedAt: now,
      owlPointsEarned: points,
      isApproved: true,
      approvedBy: currentUser.id,
      approvedAt: now
    };

    setAppState(prev => ({
      ...prev,
      chores: prev.chores.map(c => c.id === choreId ? updatedChore : c),
      users: prev.users.map(u => u.id === currentUser.id ? updatedUser : u),
      currentUser: updatedUser,
      choreCompletions: [...prev.choreCompletions, choreCompletion]
    }));

    addNotification({
      type: 'success',
      title: 'Chore Completed! 🦉',
      message: `You earned ${points} owls!`,
      duration: 3000
    });
  };

  // Cancel a pending chore completion
  const cancelPendingChore = (choreId: string) => {
    const currentUser = appState.currentUser;
    if (!currentUser) return;

    // Find the pending completion for this chore by this user
    const pendingCompletion = appState.choreCompletions.find(
      c => c.choreId === choreId && 
           c.userId === currentUser.id && 
           !c.isApproved
    );

    if (!pendingCompletion) {
      addNotification({
        type: 'warning',
        title: 'No Pending Chore',
        message: 'No pending chore found to cancel.',
        duration: 3000
      });
      return;
    }

    // Remove the pending completion
    setAppState(prev => ({
      ...prev,
      choreCompletions: prev.choreCompletions.filter(c => c.id !== pendingCompletion.id)
    }));

    addNotification({
      type: 'info',
      title: 'Chore Cancelled! ❌',
      message: 'Your pending chore has been cancelled.',
      duration: 3000
    });
  };

  // Redeem a reward
  const redeemReward = (rewardId: string) => {
    const reward = appState.rewards.find(r => r.id === rewardId);
    const currentUser = appState.currentUser;
    
    if (!reward || !currentUser) return;

    if (currentUser.totalOwlPoints < reward.owlCost) {
      addNotification({
        type: 'error',
        title: 'Not Enough Owls!',
        message: `You need ${reward.owlCost - currentUser.totalOwlPoints} more owls!`,
        duration: 3000
      });
      return;
    }

    if (!reward.isActive) {
      addNotification({
        type: 'warning',
        title: 'Reward Unavailable',
        message: 'This reward is currently not available.',
        duration: 3000
      });
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      totalOwlPoints: currentUser.totalOwlPoints - reward.owlCost,
      spentOwlPoints: currentUser.spentOwlPoints + reward.owlCost
    };

    const updatedReward: Reward = {
      ...reward,
      currentUses: reward.currentUses + 1
    };

    const rewardRedemption = {
      id: uuidv4(),
      rewardId,
      userId: currentUser.id,
      redeemedAt: new Date(),
      owlPointsSpent: reward.owlCost,
      spellCast: reward.spell
    };

    setAppState(prev => ({
      ...prev,
      rewards: prev.rewards.map(r => r.id === rewardId ? updatedReward : r),
      users: prev.users.map(u => u.id === currentUser.id ? updatedUser : u),
      currentUser: updatedUser,
      rewardRedemptions: [...prev.rewardRedemptions, rewardRedemption],
      showSpellAnimation: true,
      currentSpell: {
        name: reward.spell,
        description: reward.spellDescription,
        animation: 'sparkle',
        color: reward.color
      }
    }));

    // Hide spell animation after 3 seconds
    setTimeout(() => {
      setAppState(prev => ({
        ...prev,
        showSpellAnimation: false,
        currentSpell: null
      }));
    }, 3000);

    addNotification({
      type: 'success',
      title: 'Reward Claimed! ✨',
      message: `You cast ${reward.spell}!`,
      duration: 4000,
      showSpell: true
    });
  };

  // Toggle parent mode
  const toggleParentMode = () => {
    setAppState(prev => ({
      ...prev,
      isParentMode: !prev.isParentMode
    }));
  };

  // Switch user
  const switchUser = (userId: string) => {
    const user = appState.users.find(u => u.id === userId);
    if (user) {
      setAppState(prev => ({
        ...prev,
        currentUser: user
      }));
    }
  };

  // Helper function to check if date is yesterday
  const isYesterday = (dateString: string) => {
    const yesterday = format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
    return dateString === yesterday;
  };

  // Add new chore (parent only)
  const addChore = (chore: Omit<Chore, 'id'>) => {
    const newChore: Chore = {
      ...chore,
      id: uuidv4()
    };
    setAppState(prev => ({
      ...prev,
      chores: [...prev.chores, newChore]
    }));
  };

  // Add new reward (parent only)
  const addReward = (reward: Omit<Reward, 'id'>) => {
    const newReward: Reward = {
      ...reward,
      id: uuidv4()
    };
    setAppState(prev => ({
      ...prev,
      rewards: [...prev.rewards, newReward]
    }));
  };

  // Update chore (parent only)
  const updateChore = (choreId: string, updates: Partial<Chore>) => {
    setAppState(prev => ({
      ...prev,
      chores: prev.chores.map(c => c.id === choreId ? { ...c, ...updates } : c)
    }));
  };

  // Update reward (parent only)
  const updateReward = (rewardId: string, updates: Partial<Reward>) => {
    setAppState(prev => ({
      ...prev,
      rewards: prev.rewards.map(r => r.id === rewardId ? { ...r, ...updates } : r)
    }));
  };

  // Delete chore (parent only)
  const deleteChore = (choreId: string) => {
    setAppState(prev => ({
      ...prev,
      chores: prev.chores.filter(c => c.id !== choreId)
    }));
  };

  // Delete reward (parent only)
  const deleteReward = (rewardId: string) => {
    setAppState(prev => ({
      ...prev,
      rewards: prev.rewards.filter(r => r.id !== rewardId)
    }));
  };

  // Reset daily chores
  const resetDailyChores = () => {
    setAppState(prev => ({
      ...prev,
      chores: prev.chores.map(chore => ({
        ...chore,
        isCompleted: false,
        completedAt: undefined,
        completedBy: undefined,
        isApproved: undefined
      }))
    }));
  };

  // Approve or reject a pending chore completion
  const approveChoreCompletion = (completionId: string, approved: boolean) => {
    const completion = appState.choreCompletions.find(c => c.id === completionId);
    const currentUser = appState.currentUser;
    
    if (!completion || !currentUser || currentUser.role !== 'parent') return;

    const chore = appState.chores.find(c => c.id === completion.choreId);
    const childUser = appState.users.find(u => u.id === completion.userId);
    
    if (!chore || !childUser) return;

    if (approved) {
      // Approve the completion
      const updatedCompletion = {
        ...completion,
        isApproved: true,
        approvedBy: currentUser.id,
        approvedAt: new Date()
      };

      const updatedChore: Chore = {
        ...chore,
        isCompleted: true,
        completedAt: completion.completedAt,
        completedBy: completion.userId,
        lastCompletedDate: completion.completedAt,
        isApproved: true
      };

      const updatedChildUser: User = {
        ...childUser,
        totalOwlPoints: childUser.totalOwlPoints + completion.owlPointsEarned,
        earnedOwlPoints: childUser.earnedOwlPoints + completion.owlPointsEarned,
        completedChores: childUser.completedChores + 1
      };

      setAppState(prev => ({
        ...prev,
        chores: prev.chores.map(c => c.id === chore.id ? updatedChore : c),
        users: prev.users.map(u => u.id === childUser.id ? updatedChildUser : u),
        choreCompletions: prev.choreCompletions.map(c => c.id === completionId ? updatedCompletion : c)
      }));

      addNotification({
        type: 'success',
        title: 'Chore Approved! ✅',
        message: `${childUser.name} earned ${completion.owlPointsEarned} owls!`,
        duration: 3000
      });
    } else {
      // Reject the completion
      setAppState(prev => ({
        ...prev,
        choreCompletions: prev.choreCompletions.filter(c => c.id !== completionId)
      }));

      addNotification({
        type: 'warning',
        title: 'Chore Rejected! ❌',
        message: `${childUser.name}'s chore was not approved.`,
        duration: 3000
      });
    }
  };

  return (
    <div className="app">
      <Toaster position="top-center" />
      
      <AnimatePresence>
        {appState.showSpellAnimation && appState.currentSpell && (
          <SpellAnimation spell={appState.currentSpell} />
        )}
      </AnimatePresence>

      <Header 
        currentUser={appState.currentUser}
        users={appState.users}
        isParentMode={appState.isParentMode}
        onToggleParentMode={toggleParentMode}
        onSwitchUser={switchUser}
      />

      <main className="main-content">
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          currentUser={appState.currentUser}
        />

        <AnimatePresence mode="wait">
          {activeTab === 'chores' && (
            <motion.div
              key="chores"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ChoresDashboard
                chores={appState.chores}
                currentUser={appState.currentUser}
                isParentMode={appState.isParentMode}
                choreCompletions={appState.choreCompletions}
                onCompleteChore={completeChore}
                onCancelPendingChore={cancelPendingChore}
                onAddChore={addChore}
                onUpdateChore={updateChore}
                onDeleteChore={deleteChore}
                onResetChores={resetDailyChores}
              />
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RewardsStore
                rewards={appState.rewards}
                currentUser={appState.currentUser}
                isParentMode={appState.isParentMode}
                onRedeemReward={redeemReward}
                onAddReward={addReward}
                onUpdateReward={updateReward}
                onDeleteReward={deleteReward}
              />
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProgressTracker
                currentUser={appState.currentUser!}
                choreCompletions={appState.choreCompletions}
                rewardRedemptions={appState.rewardRedemptions}
                chores={appState.chores}
                rewards={appState.rewards}
              />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Settings
                appState={appState}
                setAppState={setAppState}
                isParentMode={appState.isParentMode}
                onApproveChoreCompletion={approveChoreCompletion}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
        />
      ))}
    </div>
  );
};

export default App; 