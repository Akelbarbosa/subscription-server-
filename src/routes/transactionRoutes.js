const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticationMiddleware = require('../middleware/authentication');

//router.get('/', authenticationMiddleware, subscriptionController.getAllSubscriptions);
//router.get('/:transaction', subscriptionController.newSubscription)
router.post('/appstore', transactionController.receiveAppleTransaction)
router.post('/playstore', transactionController.receiveGoogleTransaction)

module.exports = router;
