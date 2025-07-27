import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Chore, User } from '../types';
import { format } from 'date-fns';
import './ChoreCard.css';

interface ChoreCardProps {
  chore: Chore;
  currentUser: User | null;
  isParentMode: boolean;
  onComplete: (choreId: string) => void;
  onUpdate: (choreId: string, updates: Partial<Chore>) => void;
  onDelete: (choreId: string) => void;
}

const ChoreCard: React.FC<ChoreCardProps> = ({
  chore,
  currentUser,
  isParentMode,
  onComplete,
  onUpdate,
  onDelete
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (isCompleting) return;
    
    setIsCompleting(true);
    
    // Add a small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onComplete(chore.id);
    setIsCompleting(false);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${chore.name}"?`)) {
      onDelete(chore.id);
    }
  };

  const getStreakText = () => {
    if (chore.streak === 0) return '';
    if (chore.streak === 1) return '🔥 1 day streak!';
    return `🔥 ${chore.streak} day streak!`;
  };

  const getLastCompletedText = () => {
    if (!chore.lastCompletedDate) return '';
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastCompleted = format(chore.lastCompletedDate, 'yyyy-MM-dd');
    
    if (lastCompleted === today) {
      return 'Completed today';
    }
    
    const yesterday = format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
    if (lastCompleted === yesterday) {
      return 'Completed yesterday';
    }
    
    return `Last completed: ${format(chore.lastCompletedDate, 'MMM d')}`;
  };

  return (
    <>
      <motion.div
        className={`chore-card ${chore.isCompleted ? 'completed' : ''} ${isCompleting ? 'completing' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Card Header */}
        <div className="card-header">
          <div className="chore-icon" style={{ backgroundColor: chore.color }}>
            <span className="icon-emoji">{chore.icon}</span>
          </div>
          
          <div className="chore-info">
            <h3 className="chore-name">{chore.name}</h3>
            {chore.description && (
              <p className="chore-description">{chore.description}</p>
            )}
            <div className="chore-meta">
              <span className="owl-points">
                <span className="owl-icon">🦉</span>
                {chore.owlPoints} points
              </span>
              {chore.category && (
                <span className="chore-category">{chore.category}</span>
              )}
            </div>
          </div>

          {isParentMode && (
            <div className="parent-actions">
              <button
                className="action-btn edit-btn"
                onClick={handleEdit}
                title="Edit chore"
              >
                ✏️
              </button>
              <button
                className="action-btn delete-btn"
                onClick={handleDelete}
                title="Delete chore"
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body">
          {chore.isCompleted && (
            <div className="completion-info">
              <div className="completion-badge">
                <span className="checkmark">✅</span>
                Completed
              </div>
              {chore.completedAt && (
                <span className="completion-time">
                  {format(chore.completedAt, 'h:mm a')}
                </span>
              )}
            </div>
          )}

          {!chore.isCompleted && (
            <div className="pending-info">
              <div className="streak-info">
                {getStreakText()}
              </div>
              <div className="last-completed">
                {getLastCompletedText()}
              </div>
            </div>
          )}

          {/* Dynamic points indicator */}
          {chore.lastCompletedDate && !chore.isCompleted && (
            <div className="dynamic-points">
              <span className="points-note">
                {format(chore.lastCompletedDate, 'yyyy-MM-dd') === format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd') 
                  ? '70% points (recently completed)'
                  : 'Full points available'
                }
              </span>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="card-footer">
          {!chore.isCompleted && currentUser?.role === 'child' && (
            <motion.button
              className="complete-btn"
              onClick={handleComplete}
              disabled={isCompleting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCompleting ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <>
                  <span className="btn-icon">✨</span>
                  Complete Chore
                </>
              )}
            </motion.button>
          )}

          {chore.isCompleted && (
            <div className="completed-status">
              <span className="status-icon">🎉</span>
              <span className="status-text">Great job!</span>
            </div>
          )}

          {chore.requiresApproval && chore.isCompleted && !chore.isApproved && (
            <div className="approval-pending">
              <span className="approval-icon">⏳</span>
              <span className="approval-text">Waiting for approval</span>
            </div>
          )}
        </div>

        {/* Completion animation overlay */}
        {isCompleting && (
          <motion.div
            className="completion-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="completion-animation">
              <span className="sparkle">✨</span>
              <span className="owl">🦉</span>
              <span className="sparkle">✨</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditChoreModal
          chore={chore}
          onClose={() => setShowEditModal(false)}
          onSave={(updates) => {
            onUpdate(chore.id, updates);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
};

// Simple Edit Modal Component
const EditChoreModal: React.FC<{
  chore: Chore;
  onClose: () => void;
  onSave: (updates: Partial<Chore>) => void;
}> = ({ chore, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: chore.name,
    description: chore.description || '',
    owlPoints: chore.owlPoints,
    requiresApproval: chore.requiresApproval
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
          <h3 className="modal-title">Edit Chore</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Chore Name</label>
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
            <label className="form-label">Owl Points</label>
            <input
              type="number"
              className="form-input"
              value={formData.owlPoints}
              onChange={(e) => setFormData({ ...formData, owlPoints: parseInt(e.target.value) || 0 })}
              min="1"
              max="50"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <input
                type="checkbox"
                checked={formData.requiresApproval}
                onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
              />
              Requires parent approval
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

export default ChoreCard; 