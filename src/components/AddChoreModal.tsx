import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Chore, ChoreTemplate } from '../types';
import './AddChoreModal.css';

interface AddChoreModalProps {
  onClose: () => void;
  onAdd: (chore: Omit<Chore, 'id'>) => void;
  defaultChores: ChoreTemplate[];
  magicalColors: string[];
  magicalIcons: string[];
}

const AddChoreModal: React.FC<AddChoreModalProps> = ({
  onClose,
  onAdd,
  defaultChores,
  magicalColors,
  magicalIcons
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owlPoints: 5,
    category: 'daily' as 'daily' | 'weekly' | 'custom',
    icon: '🧹',
    color: '#8B5CF6',
    requiresApproval: false
  });

  const [selectedTemplate, setSelectedTemplate] = useState<ChoreTemplate | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a chore name');
      return;
    }

    const newChore: Omit<Chore, 'id'> = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      owlPoints: formData.owlPoints,
      isCompleted: false,
      requiresApproval: formData.requiresApproval,
      category: formData.category,
      icon: formData.icon,
      color: formData.color,
      streak: 0
    };

    onAdd(newChore);
  };

  const handleTemplateSelect = (template: ChoreTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      owlPoints: template.defaultOwlPoints,
      category: template.category,
      icon: template.icon,
      color: template.color,
      requiresApproval: false
    });
  };

  const handleColorSelect = (color: string) => {
    setFormData({ ...formData, color });
    setShowColorPicker(false);
  };

  const handleIconSelect = (icon: string) => {
    setFormData({ ...formData, icon });
    setShowIconPicker(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content add-chore-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            <span className="title-icon">✨</span>
            Add New Chore
          </h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Template Selection */}
          <div className="form-section">
            <label className="form-label">Choose from templates (optional)</label>
            <div className="template-grid">
              {defaultChores.slice(0, 6).map((template, index) => (
                <motion.button
                  key={index}
                  type="button"
                  className={`template-card ${selectedTemplate?.name === template.name ? 'selected' : ''}`}
                  onClick={() => handleTemplateSelect(template)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ borderColor: template.color }}
                >
                  <div className="template-icon" style={{ backgroundColor: template.color }}>
                    {template.icon}
                  </div>
                  <div className="template-info">
                    <span className="template-name">{template.name}</span>
                    <span className="template-points">{template.defaultOwlPoints} pts</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">Chore Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Make Bed, Clean Room"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description of the chore..."
                rows={3}
              />
            </div>
          </div>

          {/* Visual Customization */}
          <div className="form-section">
            <label className="form-label">Visual Customization</label>
            
            <div className="customization-grid">
              {/* Icon Selection */}
              <div className="customization-item">
                <label className="customization-label">Icon</label>
                <div className="icon-selector">
                  <button
                    type="button"
                    className="icon-preview"
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.icon}
                  </button>
                  
                  {showIconPicker && (
                    <div className="icon-picker">
                      <div className="icon-grid">
                        {magicalIcons.slice(0, 20).map((icon, index) => (
                          <button
                            key={index}
                            type="button"
                            className="icon-option"
                            onClick={() => handleIconSelect(icon)}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Color Selection */}
              <div className="customization-item">
                <label className="customization-label">Color</label>
                <div className="color-selector">
                  <button
                    type="button"
                    className="color-preview"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    style={{ backgroundColor: formData.color }}
                  >
                    <span className="color-checkmark">✓</span>
                  </button>
                  
                  {showColorPicker && (
                    <div className="color-picker">
                      <div className="color-grid">
                        {magicalColors.map((color, index) => (
                          <button
                            key={index}
                            type="button"
                            className="color-option"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorSelect(color)}
                          >
                            {formData.color === color && (
                              <span className="color-checkmark">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="form-section">
            <div className="settings-grid">
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
                <span className="form-hint">How many points this chore is worth</span>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.requiresApproval}
                  onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                />
                <span className="checkbox-text">Requires parent approval</span>
              </label>
              <span className="form-hint">Child must get approval before earning points</span>
            </div>
          </div>

          {/* Preview */}
          <div className="form-section">
            <label className="form-label">Preview</label>
            <div className="chore-preview">
              <div className="preview-icon" style={{ backgroundColor: formData.color }}>
                {formData.icon}
              </div>
              <div className="preview-info">
                <h4 className="preview-name">{formData.name || 'Chore Name'}</h4>
                {formData.description && (
                  <p className="preview-description">{formData.description}</p>
                )}
                <div className="preview-meta">
                  <span className="preview-points">
                    <span className="owl-icon">🦉</span>
                    {formData.owlPoints} points
                  </span>
                  <span className="preview-category">{formData.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <span className="btn-icon">✨</span>
              Add Chore
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddChoreModal; 