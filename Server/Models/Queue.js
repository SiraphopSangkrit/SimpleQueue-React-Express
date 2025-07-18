const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  queueNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed', 'cancelled'],
    default: 'waiting',
  },

  bookingDate: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

// Update the updatedAt field before saving
queueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const QueueModel = mongoose.model('Queue', queueSchema);

module.exports = QueueModel;


