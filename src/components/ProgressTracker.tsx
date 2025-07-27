import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar, 
  Star, 
  Award,
  Flame,
  Zap,
  Crown,
  Gem
} from 'lucide-react';
import { User, ChoreCompletion, RewardRedemption, Chore, Reward } from '../types';
import './ProgressTracker.css';

interface ProgressTrackerProps {
  currentUser: User;
  choreCompletions: ChoreCompletion[];
  rewardRedemptions: RewardRedemption[];
  chores: Chore[];
  rewards: Reward[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentUser,
  choreCompletions,
  rewardRedemptions,
  chores,
  rewards
}) => {
  const stats = useMemo(() => {
    const userCompletions = choreCompletions.filter(c => c.userId === currentUser.id);
    const userRedemptions = rewardRedemptions.filter(r => r.userId === currentUser.id);
    
    // Weekly progress
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    const weeklyCompletions = userCompletions.filter(c => 
      c.completedAt >= weekStart && c.completedAt <= weekEnd
    );
    
    const weeklyPoints = weeklyCompletions.reduce((sum, c) => sum + c.owlPointsEarned, 0);
    const weeklySpent = userRedemptions
      .filter(r => r.redeemedAt >= weekStart && r.redeemedAt <= weekEnd)
      .reduce((sum, r) => sum + r.owlPointsSpent, 0);
    
    // Daily streak calculation
    const sortedCompletions = userCompletions
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    
    let currentStreak = 0;
    let lastDate: string | null = null;
    
    for (const completion of sortedCompletions) {
      const completionDate = format(completion.completedAt, 'yyyy-MM-dd');
      if (!lastDate) {
        lastDate = completionDate;
        currentStreak = 1;
      } else {
        const dayDiff = Math.floor(
          (new Date(lastDate).getTime() - new Date(completionDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dayDiff === 1) {
          currentStreak++;
          lastDate = completionDate;
        } else {
          break;
        }
      }
    }
    
    // Achievements
    const achievements: Array<{ name: string; icon: any; color: string }> = [];
    if (currentUser.completedChores >= 10) achievements.push({ name: 'Getting Started', icon: Star, color: '#FFD700' });
    if (currentUser.completedChores >= 50) achievements.push({ name: 'Chore Champion', icon: Trophy, color: '#FF6B6B' });
    if (currentUser.completedChores >= 100) achievements.push({ name: 'Master Helper', icon: Crown, color: '#4ECDC4' });
    if (currentUser.currentStreak >= 7) achievements.push({ name: 'Week Warrior', icon: Flame, color: '#FF8C42' });
    if (currentUser.currentStreak >= 30) achievements.push({ name: 'Streak Master', icon: Zap, color: '#A8E6CF' });
    if (currentUser.totalOwlPoints >= 100) achievements.push({ name: 'Owl Collector', icon: Gem, color: '#9B59B6' });
    
    return {
      weeklyCompletions: weeklyCompletions.length,
      weeklyPoints,
      weeklySpent,
      currentStreak,
      weekDays,
      achievements,
      totalEarned: currentUser.earnedOwlPoints,
      totalSpent: currentUser.spentOwlPoints,
      averagePointsPerChore: userCompletions.length > 0 
        ? Math.round(currentUser.earnedOwlPoints / userCompletions.length) 
        : 0
    };
  }, [currentUser, choreCompletions, rewardRedemptions]);

  const getDayStatus = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const hasCompletion = choreCompletions.some(c => 
      c.userId === currentUser.id && 
      format(c.completedAt, 'yyyy-MM-dd') === dayStr
    );
    const isToday = isSameDay(day, new Date());
    const isPast = day < new Date();
    
    if (isToday) return 'today';
    if (hasCompletion) return 'completed';
    if (isPast) return 'missed';
    return 'future';
  };

  return (
    <div className="progress-tracker">
      <motion.div 
        className="progress-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>🦉 Progress & Achievements</h2>
        <p>Track your magical journey and unlock achievements!</p>
      </motion.div>

      <div className="progress-grid">
        {/* Weekly Overview */}
        <motion.div 
          className="progress-card weekly-overview"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3>📅 This Week's Progress</h3>
          <div className="weekly-stats">
            <div className="stat-item">
              <Target className="stat-icon" />
              <div>
                <span className="stat-value">{stats.weeklyCompletions}</span>
                <span className="stat-label">Chores Done</span>
              </div>
            </div>
            <div className="stat-item">
              <TrendingUp className="stat-icon" />
              <div>
                <span className="stat-value">{stats.weeklyPoints}</span>
                <span className="stat-label">Owl Points Earned</span>
              </div>
            </div>
            <div className="stat-item">
              <Zap className="stat-icon" />
              <div>
                <span className="stat-value">{stats.weeklySpent}</span>
                <span className="stat-label">Points Spent</span>
              </div>
            </div>
          </div>
          
          <div className="weekly-calendar">
            <h4>Daily Activity</h4>
            <div className="calendar-grid">
              {stats.weekDays.map((day, index) => {
                const status = getDayStatus(day);
                return (
                  <div 
                    key={index} 
                    className={`calendar-day ${status}`}
                    title={format(day, 'EEEE, MMM d')}
                  >
                    <span className="day-name">{format(day, 'EEE')[0]}</span>
                    <span className="day-number">{format(day, 'd')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Overall Stats */}
        <motion.div 
          className="progress-card overall-stats"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3>📊 Overall Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <Trophy className="stat-icon-large" />
              <div className="stat-content">
                <span className="stat-number">{currentUser.completedChores}</span>
                <span className="stat-title">Total Chores</span>
              </div>
            </div>
            <div className="stat-card">
              <Flame className="stat-icon-large" />
              <div className="stat-content">
                <span className="stat-number">{currentUser.currentStreak}</span>
                <span className="stat-title">Current Streak</span>
              </div>
            </div>
            <div className="stat-card">
              <Award className="stat-icon-large" />
              <div className="stat-content">
                <span className="stat-number">{currentUser.longestStreak}</span>
                <span className="stat-title">Longest Streak</span>
              </div>
            </div>
            <div className="stat-card">
              <Star className="stat-icon-large" />
              <div className="stat-content">
                <span className="stat-number">{stats.averagePointsPerChore}</span>
                <span className="stat-title">Avg Points/Chore</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div 
          className="progress-card achievements"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3>🏆 Achievements</h3>
          {stats.achievements.length > 0 ? (
            <div className="achievements-grid">
              {stats.achievements.map((achievement, index) => (
                <motion.div 
                  key={achievement.name}
                  className="achievement-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <achievement.icon 
                    className="achievement-icon" 
                    style={{ color: achievement.color }}
                  />
                  <span className="achievement-name">{achievement.name}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-achievements">
              <p>Complete more chores to unlock achievements!</p>
              <div className="achievement-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((currentUser.completedChores / 10) * 100, 100)}%` }}
                  />
                </div>
                <span>{currentUser.completedChores}/10 chores for first achievement</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Points Summary */}
        <motion.div 
          className="progress-card points-summary"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>🦉 Owl Points Summary</h3>
          <div className="points-breakdown">
            <div className="points-item earned">
              <span className="points-label">Total Earned</span>
              <span className="points-value">+{stats.totalEarned}</span>
            </div>
            <div className="points-item spent">
              <span className="points-label">Total Spent</span>
              <span className="points-value">-{stats.totalSpent}</span>
            </div>
            <div className="points-item current">
              <span className="points-label">Current Balance</span>
              <span className="points-value">{currentUser.totalOwlPoints}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressTracker; 