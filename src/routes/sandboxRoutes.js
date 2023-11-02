const express = require('express');
const router = express.Router();
const sandBoxController = require('../controllers/sandboxController');


router.get('/', sandBoxController.sanboxResponseHello);
router.get('/jwt', sandBoxController.generateSandBox);

router.get('/fb', sandBoxController.testDb)


module.exports = router;