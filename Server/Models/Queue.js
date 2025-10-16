const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  queueId: {
    type: Number,
    required: true,
    unique: true,
  },
  queueNumber: {
    type: Number,
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  lineId: {
    type: String,
  },
  referenceId:{
    type: String,
    required: true,
    unique: true,
  },
  serviceTypeId: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.ObjectId,
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

// Indexes
queueSchema.index({ queueId: 1, bookingDate: 1 }, { 
  unique: true,
});


// Update the updatedAt field before saving
queueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const QueueModel = mongoose.model('Queue', queueSchema);

module.exports = QueueModel;


