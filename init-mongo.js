// MongoDB initialization script
db = db.getSiblingDB('SimpleQueues');

// Create collections if they don't exist
db.createCollection('users');
db.createCollection('queues');
db.createCollection('customers');
db.createCollection('settings');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.queues.createIndex({ "queueId": 1 }, { unique: true });
db.customers.createIndex({ "email": 1 });
db.customers.createIndex({ "phone": 1 });

// Insert default settings if none exist
if (db.settings.countDocuments({}) === 0) {
    db.settings.insertOne({
        businessName: "Simple Queue System",
        businessHours: {
            start: "09:00",
            end: "17:00"
        },
        queueSettings: {
            maxQueueSize: 100,
            estimatedServiceTime: 15
        },
        createdAt: new Date(),
        updatedAt: new Date()
    });
}

print('Database initialized successfully!');