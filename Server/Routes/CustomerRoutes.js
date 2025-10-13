const express =  require('express');
const router = express.Router();
const CustomerController = require('../Controllers/CustomerController.js');
const customerController = new CustomerController();


router.get('/', customerController.getAllCustomers);

module.exports = router;