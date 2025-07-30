const mongoose = require('mongoose');

// Sub-schemas for organization
const OpeningHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    required: true
  },
  isOpen: { type: Boolean, default: true },
  openTime: { type: String, required: function() { return this.isOpen; } },
  closeTime: { type: String, required: function() { return this.isOpen; } },
  breakTime: {
    start: String,
    end: String
  }
}, { _id: false });

const ServiceTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
});

const SettingSchema = new mongoose.Schema({
  // General Settings
  appName: { type: String, default: 'My Portfolio' },
  appDescription: String,
  companyName: String,
  contactEmail: String,
  phoneNumber: String,
  address: String,
  
  // Opening Hours
  openingHours: [OpeningHoursSchema],
  
  // Service Types
  serviceTypes: [ServiceTypeSchema],
  
  // Business Settings

  
  // System
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Singleton pattern - only one settings document
SettingSchema.statics.getSingle = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this();
    // Initialize defaults
    settings.openingHours = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      .map(day => ({
        day,
        isOpen: true,
        openTime: '09:00',
        closeTime: '17:00',
        breakTime: { start: '12:00', end: '13:00' }
      }));
    await settings.save();
  }
  return settings;
};

// Update the updatedAt field before saving
SettingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const SettingModel = mongoose.model('Setting', SettingSchema);

module.exports = SettingModel;
