import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reward, User } from '../types';
import { DEFAULT_REWARDS, MAGICAL_COLORS, MAGICAL_ICONS } from '../data/constants';
import RewardCard from './RewardCard';
import AddRewardModal from './AddRewardModal';
import './RewardsStore.css';

interface RewardsStoreProps {
  rewards: Reward[];
  currentUser: User | null;
  isParentMode: boolean;
  onRedeemReward: (rewardId: string) => void;
  onAddReward: (reward: Omit<Reward, 'id'>) => void;
  onUpdateReward: (rewardId: string, updates: Partial<Reward>) => void;
  onDeleteReward: (rewardId: string) => void;
}

const RewardsStore: React.FC<RewardsStoreProps> = ({
  rewards,
  currentUser,
  isParentMode,
  onRedeemReward,
  onAddReward,
  onUpdateReward,
  onDeleteReward
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'affordable' | 'expensive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['all', 'entertainment', 'food', 'activities', 'privileges', 'custom'];

  const filteredRewards = rewards.filter(reward => {
    if (!reward.isActive) return false;
    
    if (categoryFilter !== 'all' && reward.category !== categoryFilter) {
      return false;
    }

    if (filter === 'affordable' && currentUser) {
      return reward.owlCost <= currentUser.totalOwlPoints;
    }
    
    if (filter === 'expensive' && currentUser) {
      return reward.owlCost > currentUser.totalOwlPoints;
    }
    
    return true;
  });

  const affordableCount = rewards.filter(r => r.isActive && currentUser && r.owlCost <= currentUser.totalOwlPoints).length;
  const totalActiveCount = rewards.filter(r => r.isActive).length;

  const handleRedeemReward = (rewardId: string) => {
    onRedeemReward(rewardId);
  };

  const handleAddReward = (rewardData: Omit<Reward, 'id'>) => {
    onAddReward(rewardData);
    setShowAddModal(false);
  };

  return (
    <div className="rewards-store">
      {/* Header */}
      <motion.div 
        className="store-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <div className="header-left">
            <h2 className="store-title">
              <span className="title-icon">🎁</span>
              Owl Store
            </h2>
            <p className="store-subtitle">
              Trade your Owl points for magical rewards!
            </p>
          </div>
          
          <div className="header-right">
            {currentUser && currentUser.role === 'child' && (
              <div className="owl-balance">
                <div className="balance-icon animate-float">🦉</div>
                <div className="balance-info">
                  <span className="balance-label">Your Balance</span>
                  <span className="balance-amount">{currentUser.totalOwlPoints} Owls</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="store-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="filter-section">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({totalActiveCount})
            </button>
            <button
              className={`filter-tab ${filter === 'affordable' ? 'active' : ''}`}
              onClick={() => setFilter('affordable')}
            >
              Affordable ({affordableCount})
            </button>
            <button
              className={`filter-tab ${filter === 'expensive' ? 'active' : ''}`}
              onClick={() => setFilter('expensive')}
            >
              Expensive ({totalActiveCount - affordableCount})
            </button>
          </div>

          <div className="category-filter">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="action-buttons">
          {isParentMode && (
            <button
              className="btn-secondary btn-small"
              onClick={() => setShowAddModal(true)}
            >
              <span className="btn-icon">➕</span>
              Add Reward
            </button>
          )}
        </div>
      </motion.div>

      {/* Rewards Grid */}
      <motion.div 
        className="rewards-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <AnimatePresence>
          {filteredRewards.length > 0 ? (
            filteredRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                layout
              >
                <RewardCard
                  reward={reward}
                  currentUser={currentUser}
                  isParentMode={isParentMode}
                  onRedeem={handleRedeemReward}
                  onUpdate={onUpdateReward}
                  onDelete={onDeleteReward}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="empty-state-icon">🎁</div>
              <h3>No rewards found</h3>
              <p>
                {filter === 'affordable' 
                  ? "You don't have enough Owl points for any rewards yet. Complete more chores!"
                  : filter === 'expensive'
                  ? "All rewards are affordable! Great job earning Owl points!"
                  : categoryFilter !== 'all'
                  ? `No ${categoryFilter} rewards available.`
                  : "No rewards available. Add some magical rewards to get started!"
                }
              </p>
              {isParentMode && filter === 'all' && categoryFilter === 'all' && (
                <button
                  className="btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  <span className="btn-icon">✨</span>
                  Add Your First Reward
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add Reward Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddRewardModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddReward}
            defaultRewards={DEFAULT_REWARDS}
            magicalColors={MAGICAL_COLORS}
            magicalIcons={MAGICAL_ICONS}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardsStore; 