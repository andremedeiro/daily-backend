const ScheduleModel = require('../models/ScheduleModel');

class ScheduleController {

    async create(request, response) {
        const Schedule = new ScheduleModel(request.body);
        await Schedule
                .save()
                .then(res => {
                    return response.status(200).json(res);
                })
                .catch(error => {
                    return response.status(500).json(error)
                })
    }

}

module.exports = new ScheduleController();