const express = require('express');
const router = express.Router();

const ScheduleController = require('../controller/ScheduleController')
const ScheduleValidation = require('../middleware/ScheduleValidation')
const TwoDatesValidation = require('../middleware/TwoDatesValidation')


router.post('/', ScheduleValidation, ScheduleController.create);
router.put('/:id', ScheduleValidation, ScheduleController.update);
router.get('/:id', ScheduleController.show);
router.delete('/:id', ScheduleController.delete);

router.post('/busy', TwoDatesValidation, ScheduleController.busy_beetween_dates);
router.post('/free', TwoDatesValidation, ScheduleController.free_beetween_dates);

module.exports = router;