const express = require('express');
const router = express.Router();

const SettingsController = require('../Controllers/SettingsController');
const settingsController = new SettingsController();


router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);
router.post('/service-types', settingsController.createServiceType); 
router.delete('/service-types/:id', settingsController.deleteServiceType);


module.exports = router;