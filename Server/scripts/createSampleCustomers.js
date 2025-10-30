const mongoose = require('mongoose');
const CustomerModel = require('../Models/Customer.js');

async function createSampleCustomers() {
  try {
    // Connect to MongoDB
    const MONGO_DB_URL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/queuedb';
    await mongoose.connect(MONGO_DB_URL);
    console.log('Connected to MongoDB');

    // Check if customers already exist
    const existingCustomers = await CustomerModel.find();
    if (existingCustomers.length > 0) {
      console.log('Sample customers already exist. Skipping creation.');
      await mongoose.disconnect();
      return;
    }

    // Sample customer data
    const sampleCustomers = [
      {
        customerName: 'สมชาย ใจดี',
        customerPhone: '081-234-5678',
        customerLineId: 'somchai123'
      },
      {
        customerName: 'สมหญิง สวยงาม',
        customerPhone: '082-345-6789',
        customerLineId: 'somying456'
      },
      {
        customerName: 'จิรายุ ขยันทำ',
        customerPhone: '083-456-7890',
        customerLineId: 'jirayu789'
      },
      {
        customerName: 'อนุชา เรียนรู้',
        customerPhone: '084-567-8901',
        customerLineId: 'anucha012'
      },
      {
        customerName: 'ปิยะดา ช่วยเหลือ',
        customerPhone: '085-678-9012'
        // No Line ID for this customer
      }
    ];

    // Insert sample customers
    const result = await CustomerModel.insertMany(sampleCustomers);
    console.log(`Successfully created ${result.length} sample customers:`);
    result.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.customerName} - ${customer.customerPhone}`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating sample customers:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createSampleCustomers();