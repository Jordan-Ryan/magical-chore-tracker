import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Star, Heart, Crown, Gem } from 'lucide-react';
import { Spell } from '../types';
import './SpellAnimation.css';

interface SpellAnimationProps {
  spell: Spell;
}

const SpellAnimation: React.FC<SpellAnimationProps> = ({ spell }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5
    }));
    setParticles(newParticles);
  }, [spell.name]);

  const getSpellIcon = () => {
    switch (spell.animation) {
      case 'sparkle':
        return <Sparkles />;
      case 'lightning':
        return <Zap />;
      case 'star':
        return <Star />;
      case 'heart':
        return <Heart />;
      case 'crown':
        return <Crown />;
      case 'gem':
        return <Gem />;
      default:
        return <Sparkles />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="spell-animation-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="spell-container">
          {/* Main spell effect */}
          <motion.div 
            className="spell-effect"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              duration: 0.8, 
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            style={{ color: spell.color }}
          >
            {getSpellIcon()}
          </motion.div>

          {/* Spell name */}
          <motion.h2 
            className="spell-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ color: spell.color }}
          >
            {spell.name}
          </motion.h2>

          {/* Spell description */}
          <motion.p 
            className="spell-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {spell.description}
          </motion.p>

          {/* Floating particles */}
          <div className="particles-container">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="particle"
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: particle.x - 50,
                  y: particle.y - 50
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: particle.x - 50 + (Math.random() - 0.5) * 100,
                  y: particle.y - 50 + (Math.random() - 0.5) * 100
                }}
                transition={{ 
                  duration: 2,
                  delay: particle.delay,
                  ease: "easeOut"
                }}
                style={{ color: spell.color }}
              >
                {getSpellIcon()}
              </motion.div>
            ))}
          </div>

          {/* Ring effects */}
          <motion.div 
            className="spell-ring ring-1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, delay: 0.2 }}
            style={{ borderColor: spell.color }}
          />
          <motion.div 
            className="spell-ring ring-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: [0, 1, 0] }}
            transition={{ duration: 2, delay: 0.4 }}
            style={{ borderColor: spell.color }}
          />
          <motion.div 
            className="spell-ring ring-3"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2.5, opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, delay: 0.6 }}
            style={{ borderColor: spell.color }}
          />

          {/* Background glow */}
          <motion.div 
            className="spell-glow"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              background: `radial-gradient(circle, ${spell.color}20 0%, transparent 70%)`
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SpellAnimation; 