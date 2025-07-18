const express = require('express');
const queueRouter = express.Router();

const QueueController = require('../Controllers/QueueController');

// Create instance of QueueController
const queueController = new QueueController();

// Basic CRUD operations
queueRouter.get('/', queueController.getAllQueues);
queueRouter.get('/:id', queueController.getQueueById);
queueRouter.post('/', queueController.createQueue);
queueRouter.put('/:id', queueController.updateQueue);
queueRouter.delete('/:id', queueController.deleteQueue);

// Queue management routes
queueRouter.patch('/:id/status', queueController.updateQueueStatus);
queueRouter.get('/status/:status', queueController.getQueuesByStatus);
queueRouter.get('/today/list', queueController.getTodaysQueues);
queueRouter.get('/stats/overview', queueController.getQueueStats);
queueRouter.get('/next/waiting', queueController.getNextQueue);

module.exports = queueRouter;

