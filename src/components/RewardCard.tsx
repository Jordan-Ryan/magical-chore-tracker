import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Reward, User } from '../types';
import './RewardCard.css';

interface RewardCardProps {
  reward: Reward;
  currentUser: User | null;
  isParentMode: boolean;
  onRedeem: (rewardId: string) => void;
  onUpdate: (rewardId: string, updates: Partial<Reward>) => void;
  onDelete: (rewardId: string) => void;
}

const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  currentUser,
  isParentMode,
  onRedeem,
  onUpdate,
  onDelete
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const canAfford = currentUser && currentUser.totalOwlPoints >= reward.owlCost;
  const isAffordable = canAfford;

  const handleRedeem = async () => {
    if (isRedeeming || !canAfford) return;
    
    setIsRedeeming(true);
    
    // Add a small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onRedeem(reward.id);
    setIsRedeeming(false);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${reward.name}"?`)) {
      onDelete(reward.id);
    }
  };

  const handleToggleActive = () => {
    onUpdate(reward.id, { isActive: !reward.isActive });
  };

  return (
    <>
      <motion.div
        className={`reward-card ${isAffordable ? 'affordable' : 'expensive'} ${isRedeeming ? 'redeeming' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Card Header */}
        <div className="card-header">
          <div className="reward-icon" style={{ backgroundColor: reward.color }}>
            <span className="icon-emoji">{reward.icon}</span>
          </div>
          
          <div className="reward-info">
            <h3 className="reward-name">{reward.name}</h3>
            <p className="reward-description">{reward.description}</p>
            <div className="reward-meta">
              <span className="owl-cost">
                <span className="owl-icon">🦉</span>
                {reward.owlCost} owls
              </span>
              <span className="reward-category">{reward.category}</span>
            </div>
          </div>

          {isParentMode && (
            <div className="parent-actions">
              <button
                className="action-btn toggle-btn"
                onClick={handleToggleActive}
                title={reward.isActive ? 'Deactivate reward' : 'Activate reward'}
              >
                {reward.isActive ? '✅' : '❌'}
              </button>
              <button
                className="action-btn edit-btn"
                onClick={handleEdit}
                title="Edit reward"
              >
                ✏️
              </button>
              <button
                className="action-btn delete-btn"
                onClick={handleDelete}
                title="Delete reward"
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body">
          <div className="spell-info">
            <div className="spell-name">{reward.spell}</div>
            <div className="spell-description">{reward.spellDescription}</div>
          </div>

          {reward.maxUses && (
            <div className="usage-info">
              <span className="usage-text">
                Used {reward.currentUses} of {reward.maxUses} times
              </span>
              <div className="usage-bar">
                <div 
                  className="usage-fill" 
                  style={{ width: `${(reward.currentUses / reward.maxUses) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="card-footer">
          {currentUser?.role === 'child' && reward.isActive && (
            <motion.button
              className={`redeem-btn ${canAfford ? 'affordable' : 'expensive'}`}
              onClick={handleRedeem}
              disabled={isRedeeming || !canAfford}
              whileHover={canAfford ? { scale: 1.05 } : {}}
              whileTap={canAfford ? { scale: 0.95 } : {}}
            >
              {isRedeeming ? (
                <span className="loading-spinner">⏳</span>
              ) : canAfford ? (
                <>
                  <span className="btn-icon">🪄</span>
                  Cast Spell
                </>
              ) : (
                <>
                  <span className="btn-icon">🔒</span>
                  Need {reward.owlCost - (currentUser?.totalOwlPoints || 0)} more Owls
                </>
              )}
            </motion.button>
          )}

          {!reward.isActive && (
            <div className="inactive-status">
              <span className="status-icon">⏸️</span>
              <span className="status-text">Currently unavailable</span>
            </div>
          )}
        </div>

        {/* Redemption animation overlay */}
        {isRedeeming && (
          <motion.div
            className="redemption-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="redemption-animation">
              <span className="sparkle">✨</span>
              <span className="wand">🪄</span>
              <span className="sparkle">✨</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditRewardModal
          reward={reward}
          onClose={() => setShowEditModal(false)}
          onSave={(updates) => {
            onUpdate(reward.id, updates);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
};

// Simple Edit Modal Component
const EditRewardModal: React.FC<{
  reward: Reward;
  onClose: () => void;
  onSave: (updates: Partial<Reward>) => void;
}> = ({ reward, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: reward.name,
    description: reward.description,
    owlCost: reward.owlCost,
    spell: reward.spell,
    spellDescription: reward.spellDescription,
    isActive: reward.isActive,
    maxUses: reward.maxUses || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      maxUses: formData.maxUses > 0 ? formData.maxUses : undefined
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <div className="modal-header">
          <h3 className="modal-title">Edit Reward</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Reward Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Owl Cost</label>
            <input
              type="number"
              className="form-input"
              value={formData.owlCost}
              onChange={(e) => setFormData({ ...formData, owlCost: parseInt(e.target.value) || 0 })}
              min="1"
              max="1000"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Spell Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.spell}
              onChange={(e) => setFormData({ ...formData, spell: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Spell Description</label>
            <textarea
              className="form-input form-textarea"
              value={formData.spellDescription}
              onChange={(e) => setFormData({ ...formData, spellDescription: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Max Uses (0 for unlimited)</label>
            <input
              type="number"
              className="form-input"
              value={formData.maxUses}
              onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 0 })}
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span className="checkbox-text">Active</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RewardCard; 