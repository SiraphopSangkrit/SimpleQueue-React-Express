const express = require('express');
const router = express.Router();
const QueueController = require('../Controllers/QueueController');
const queueController = new QueueController();

// Put specific routes BEFORE parameterized routes
router.get('/stats', queueController.getQueueStats);
router.get('/today', queueController.getTodaysQueues);
router.get('/next', queueController.getNextQueue);
router.get('/weekend', queueController.getQueuesByWeekend);
router.get('/weekend/:week/:year', queueController.getQueuesForWeekend);
router.get('/week', queueController.getQueuesByWeek);
router.get('/week/:week/:year', queueController.getQueuesByWeekNumber);
router.get('/status/:status', queueController.getQueuesByStatus);
router.get('/month/weeks', queueController.getQueuesByMonthSplitByWeek);
router.get('/month/iso-weeks', queueController.getQueuesByMonthWithISOWeeks);


// Put parameterized routes AFTER specific routes
router.get('/:id', queueController.getQueueById);
router.post('/create', queueController.createQueue);
router.put('/update/:id', queueController.updateQueue);
router.patch('/:id/update/status', queueController.updateQueueStatus);
router.delete('/delete/:id', queueController.deleteQueue);
router.get('/', queueController.getAllQueues);

module.exports = router;

