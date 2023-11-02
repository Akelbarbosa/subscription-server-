const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authenticationMiddleware = require('../middleware/authentication');

//router.get('/', authenticationMiddleware, subscriptionController.getAllSubscriptions);
router.get('/:transaction', subscriptionController.newSubscription)


module.exports = router;
