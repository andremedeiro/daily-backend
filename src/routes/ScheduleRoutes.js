const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/ScheduleController')

router.post('/create', ScheduleController.create);

module.exports = router;