const express = require('express');
const router = express.Router();

const SettingsController = require('../Controllers/SettingsController');
const settingsController = new SettingsController();


router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);
router.get('/service-types', settingsController.getServiceTypes);
router.post('/service-types', settingsController.createServiceType); 
router.put('/service-types/:id', settingsController.updateServiceType);
router.delete('/service-types/:id', settingsController.deleteServiceType);


module.exports = router;