const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerLineId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


CustomerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const CustomerModel = mongoose.model('Customer', CustomerSchema);

module.exports = CustomerModel;


