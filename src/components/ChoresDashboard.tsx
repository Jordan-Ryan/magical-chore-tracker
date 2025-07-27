import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chore, User, ChoreCompletion } from '../types';
import { DEFAULT_CHORES, MAGICAL_COLORS, MAGICAL_ICONS } from '../data/constants';
import ChoreCard from './ChoreCard';
import AddChoreModal from './AddChoreModal';
import './ChoresDashboard.css';

interface ChoresDashboardProps {
  chores: Chore[];
  currentUser: User | null;
  isParentMode: boolean;
  choreCompletions: ChoreCompletion[];
  onCompleteChore: (choreId: string) => void;
  onCancelPendingChore: (choreId: string) => void;
  onAddChore: (chore: Omit<Chore, 'id'>) => void;
  onUpdateChore: (choreId: string, updates: Partial<Chore>) => void;
  onDeleteChore: (choreId: string) => void;
  onResetChores: () => void;
}

const ChoresDashboard: React.FC<ChoresDashboardProps> = ({
  chores,
  currentUser,
  isParentMode,
  choreCompletions,
  onCompleteChore,
  onCancelPendingChore,
  onAddChore,
  onUpdateChore,
  onDeleteChore,
  onResetChores
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredChores = chores.filter(chore => {
    if (filter === 'completed') return chore.isCompleted;
    if (filter === 'pending') return !chore.isCompleted;
    return true;
  });

  const completedCount = chores.filter(chore => chore.isCompleted).length;
  const totalCount = chores.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCompleteChore = (choreId: string) => {
    onCompleteChore(choreId);
  };

  const handleAddChore = (choreData: Omit<Chore, 'id'>) => {
    onAddChore(choreData);
    setShowAddModal(false);
  };

  return (
    <div className="chores-dashboard">
      {/* Header with progress */}
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <div className="header-left">
            <h2 className="dashboard-title">
              <span className="title-icon">🧹</span>
              Daily Chores
            </h2>
            <p className="dashboard-subtitle">
              Complete tasks to earn magical owls!
            </p>
          </div>
          
          <div className="header-right">
            <div className="progress-summary">
              <div className="progress-circle">
                <svg viewBox="0 0 36 36" className="progress-ring">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--primary-purple)"
                    strokeWidth="2"
                    strokeDasharray={`${completionPercentage}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-percentage">{completionPercentage}%</span>
                  <span className="progress-count">{completedCount}/{totalCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span className="progress-label">
            {completedCount} of {totalCount} chores completed
          </span>
        </div>
      </motion.div>

      {/* Filters and Actions */}
      <motion.div 
        className="dashboard-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({totalCount})
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({totalCount - completedCount})
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="action-buttons">
          {isParentMode && (
            <>
              <button
                className="btn-secondary btn-small"
                onClick={() => setShowAddModal(true)}
              >
                <span className="btn-icon">➕</span>
                Add Chore
              </button>
              <button
                className="btn-secondary btn-small"
                onClick={onResetChores}
              >
                <span className="btn-icon">🔄</span>
                Reset Daily
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Chores Grid */}
      <motion.div 
        className="chores-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <AnimatePresence>
          {filteredChores.length > 0 ? (
            filteredChores.map((chore, index) => (
              <motion.div
                key={chore.id}
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
                <ChoreCard
                  chore={chore}
                  currentUser={currentUser}
                  isParentMode={isParentMode}
                  choreCompletions={choreCompletions}
                  onComplete={handleCompleteChore}
                  onCancelPending={onCancelPendingChore}
                  onUpdate={onUpdateChore}
                  onDelete={onDeleteChore}
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
              <div className="empty-state-icon">🧹</div>
              <h3>No chores found</h3>
              <p>
                {filter === 'completed' 
                  ? "No chores completed yet. Start working on your tasks!"
                  : filter === 'pending'
                  ? "All chores are completed! Great job!"
                  : "No chores available. Add some tasks to get started!"
                }
              </p>
              {isParentMode && filter === 'all' && (
                <button
                  className="btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  <span className="btn-icon">➕</span>
                  Add Your First Chore
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add Chore Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddChoreModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddChore}
            defaultChores={DEFAULT_CHORES}
            magicalColors={MAGICAL_COLORS}
            magicalIcons={MAGICAL_ICONS}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChoresDashboard; 