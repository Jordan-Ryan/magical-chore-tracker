import { ChoreTemplate, RewardTemplate } from '../types';

export const DEFAULT_CHORES: ChoreTemplate[] = [
  {
    name: 'Tidy Bedroom',
    description: 'Clean up your bedroom and put things away',
    defaultOwlPoints: 5,
    icon: '🏠',
    color: '#10B981',
    category: 'daily'
  },
  {
    name: 'Clear the Dinner Table',
    description: 'Help clear the table after one meal',
    defaultOwlPoints: 3,
    icon: '🍽️',
    color: '#F59E0B',
    category: 'daily'
  },
  {
    name: 'Take out Rubbish',
    description: 'Take the rubbish to the bin outside',
    defaultOwlPoints: 4,
    icon: '🗑️',
    color: '#6B7280',
    category: 'daily'
  },
  {
    name: 'Pack Own School Bag',
    description: 'Pack your school bag for tomorrow',
    defaultOwlPoints: 3,
    icon: '🎒',
    color: '#3B82F6',
    category: 'daily'
  },
  {
    name: 'Get Self Dressed',
    description: 'Get dressed by yourself',
    defaultOwlPoints: 2,
    icon: '👕',
    color: '#EC4899',
    category: 'daily'
  },
  {
    name: 'Make Bed',
    description: 'Make your bed nicely',
    defaultOwlPoints: 3,
    icon: '🛏️',
    color: '#8B5CF6',
    category: 'daily'
  },
  {
    name: 'Unload the Dishwasher',
    description: 'Put away the clean dishes',
    defaultOwlPoints: 4,
    icon: '🍽️',
    color: '#F97316',
    category: 'daily'
  },
  {
    name: 'Feed the Pets',
    description: 'Give food and water to the pets',
    defaultOwlPoints: 3,
    icon: '🐾',
    color: '#10B981',
    category: 'daily'
  }
];

export const DEFAULT_REWARDS: RewardTemplate[] = [
  {
    name: 'Cinema',
    description: 'A magical trip to the cinema',
    defaultOwlCost: 50,
    spell: 'Cinemagicus!',
    spellDescription: 'Summons the magic of moving pictures',
    icon: '🎬',
    color: '#8B5CF6',
    category: 'entertainment'
  },
  {
    name: 'Pizza Night',
    description: 'Delicious pizza for dinner',
    defaultOwlCost: 30,
    spell: 'Pizzario!',
    spellDescription: 'Conjures the most delicious pizza',
    icon: '🍕',
    color: '#F59E0B',
    category: 'food'
  },
  {
    name: 'Stay Up Late',
    description: 'Extra 30 minutes before bedtime',
    defaultOwlCost: 25,
    spell: 'Nocturnus Extendus!',
    spellDescription: 'Extends the night with magical time',
    icon: '🌙',
    color: '#3B82F6',
    category: 'privileges'
  },
  {
    name: 'Extra Screen Time',
    description: '30 minutes extra TV or gaming time',
    defaultOwlCost: 20,
    spell: 'Pixelis Maxim!',
    spellDescription: 'Maximizes screen magic',
    icon: '📱',
    color: '#EC4899',
    category: 'privileges'
  },
  {
    name: 'Playdate',
    description: 'Invite a friend over to play',
    defaultOwlCost: 40,
    spell: 'Amicus Summonum!',
    spellDescription: 'Summons a magical friend',
    icon: '👥',
    color: '#10B981',
    category: 'activities'
  },
  {
    name: 'Golf Trip',
    description: 'A fun day at the golf course',
    defaultOwlCost: 60,
    spell: 'Golfaricus Driveus!',
    spellDescription: 'Magical golf ball guidance',
    icon: '⛳',
    color: '#10B981',
    category: 'activities'
  },
  {
    name: 'Swimming',
    description: 'Splash around at the pool',
    defaultOwlCost: 35,
    spell: 'Aqua Splashium!',
    spellDescription: 'Creates magical water fun',
    icon: '🏊',
    color: '#3B82F6',
    category: 'activities'
  },
  {
    name: 'Baking',
    description: 'Bake something delicious together',
    defaultOwlCost: 25,
    spell: 'Bakerus Delicious!',
    spellDescription: 'Conjures the most delicious treats',
    icon: '🧁',
    color: '#F59E0B',
    category: 'activities'
  },
  {
    name: 'Soft Play',
    description: 'Bounce and play at soft play center',
    defaultOwlCost: 45,
    spell: 'Bounceus Maximus!',
    spellDescription: 'Maximum bouncy magic',
    icon: '🎪',
    color: '#EC4899',
    category: 'activities'
  },
  {
    name: 'Pudding',
    description: 'A special dessert treat',
    defaultOwlCost: 15,
    spell: 'Puddi Yum-Yum!',
    spellDescription: 'Summons the yummiest pudding',
    icon: '🍮',
    color: '#F59E0B',
    category: 'food'
  },
  {
    name: 'Chocolate/Sweets',
    description: 'A sweet chocolate or candy treat',
    defaultOwlCost: 10,
    spell: 'Chocoluxia Treatum!',
    spellDescription: 'Conjures the sweetest treats',
    icon: '🍫',
    color: '#8B5CF6',
    category: 'food'
  },
  {
    name: 'Toy Shop',
    description: 'Pick out a new toy',
    defaultOwlCost: 80,
    spell: 'Toyboxium Acquirus!',
    spellDescription: 'Acquires the most magical toys',
    icon: '🧸',
    color: '#F97316',
    category: 'activities'
  },
  {
    name: 'Trampoline Park',
    description: 'Jump and bounce at trampoline park',
    defaultOwlCost: 55,
    spell: 'Bouncicus Elevatum!',
    spellDescription: 'Elevates bouncing to new heights',
    icon: '🦘',
    color: '#EC4899',
    category: 'activities'
  }
];

export const MAGICAL_COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#F97316', // Orange
  '#EF4444', // Red
  '#06B6D4', // Cyan
];

export const MAGICAL_ICONS = [
  '🦉', '⭐', '✨', '🌟', '💫', '🔮', '🧙‍♀️', '🧙‍♂️', '🪄', '🎭', '🎪', '🎨', '🎵', '🎶', '🌈', '🌙', '☀️', '🌺', '🌸', '🌼', '🌻', '🌹', '🌷', '🍀', '🌿', '🌱', '🌳', '🌲', '🌴', '🌵', '🌾', '🌽', '🌻', '🌼', '🌺', '🌸', '🌹', '🌷', '🌱', '🌿', '🍀', '🌳', '🌲', '🌴', '🌵', '🌾', '🌽'
];

export const SPELL_ANIMATIONS = [
  'sparkle',
  'float',
  'bounce',
  'wiggle',
  'rotate',
  'scale',
  'fade',
  'slide'
];

export const SOUND_EFFECTS = {
  spell: 'magical-spell.mp3',
  owl: 'owl-hoot.mp3',
  success: 'success-chime.mp3',
  reward: 'reward-fanfare.mp3',
  click: 'magical-click.mp3'
}; 