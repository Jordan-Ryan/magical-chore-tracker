export interface Chore {
  id: string;
  name: string;
  description?: string;
  owlPoints: number;
  isCompleted: boolean;
  completedAt?: Date;
  completedBy?: string;
  requiresApproval: boolean;
  isApproved?: boolean;
  category: 'daily' | 'weekly' | 'custom';
  icon: string;
  color: string;
  lastCompletedDate?: Date;
  streak: number;
  userId: string; // Associate chore with specific child
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  owlCost: number;
  spell: string;
  spellDescription: string;
  icon: string;
  color: string;
  isActive: boolean;
  category: 'entertainment' | 'food' | 'activities' | 'privileges' | 'custom';
  maxUses?: number;
  currentUses: number;
}

export interface Spell {
  name: string;
  description: string;
  animation: string;
  soundEffect?: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  role: 'child' | 'parent';
  avatar?: string;
  totalOwlPoints: number;
  earnedOwlPoints: number;
  spentOwlPoints: number;
  completedChores: number;
  currentStreak: number;
  longestStreak: number;
  joinDate: Date;
}

export interface ChoreCompletion {
  id: string;
  choreId: string;
  userId: string;
  completedAt: Date;
  owlPointsEarned: number;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  userId: string;
  redeemedAt: Date;
  owlPointsSpent: number;
  spellCast: string;
}

export interface AppState {
  users: User[];
  currentUser: User | null;
  chores: Chore[];
  rewards: Reward[];
  choreCompletions: ChoreCompletion[];
  rewardRedemptions: RewardRedemption[];
  isParentMode: boolean;
  showSpellAnimation: boolean;
  currentSpell: Spell | null;
}

export interface ChoreTemplate {
  name: string;
  description: string;
  defaultOwlPoints: number;
  icon: string;
  color: string;
  category: 'daily' | 'weekly' | 'custom';
}

export interface RewardTemplate {
  name: string;
  description: string;
  defaultOwlCost: number;
  spell: string;
  spellDescription: string;
  icon: string;
  color: string;
  category: 'entertainment' | 'food' | 'activities' | 'privileges' | 'custom';
}

export type TabType = 'chores' | 'rewards' | 'progress' | 'settings';

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  showSpell?: boolean;
} 