import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Reward, RewardTemplate } from '../types';

interface AddRewardModalProps {
  onClose: () => void;
  onAdd: (reward: Omit<Reward, 'id'>) => void;
  defaultRewards: RewardTemplate[];
  magicalColors: string[];
  magicalIcons: string[];
}

const AddRewardModal: React.FC<AddRewardModalProps> = ({
  onClose,
  onAdd,
  defaultRewards,
  magicalColors,
  magicalIcons
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owlCost: 20,
    spell: '',
    spellDescription: '',
    icon: '🎁',
    color: '#8B5CF6',
    category: 'activities' as const,
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a reward name');
      return;
    }

    const newReward: Omit<Reward, 'id'> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      owlCost: formData.owlCost,
      spell: formData.spell || `${formData.name}us!`,
      spellDescription: formData.spellDescription || `Magical ${formData.name.toLowerCase()} spell`,
      icon: formData.icon,
      color: formData.color,
      isActive: formData.isActive,
      category: formData.category,
      currentUses: 0
    };

    onAdd(newReward);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            <span className="title-icon">✨</span>
            Add New Reward
          </h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Reward Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Pizza Night, Extra Screen Time"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this reward is..."
              rows={3}
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
              placeholder="e.g., Pizzario!, Screenus Maxim!"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Spell Description</label>
            <textarea
              className="form-input form-textarea"
              value={formData.spellDescription}
              onChange={(e) => setFormData({ ...formData, spellDescription: e.target.value })}
              placeholder="Describe what the spell does..."
              rows={2}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            >
              <option value="entertainment">Entertainment</option>
              <option value="food">Food</option>
              <option value="activities">Activities</option>
              <option value="privileges">Privileges</option>
              <option value="custom">Custom</option>
            </select>
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
              <span className="btn-icon">✨</span>
              Add Reward
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddRewardModal; 