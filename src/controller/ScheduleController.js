const ScheduleModel = require('../model/ScheduleModel');
const { differenceInCalendarDays, addDays, endOfDay, addMilliseconds, differenceInHours, startOfDay, setHours, isAfter, addHours, format, isSameHour } = require('date-fns');

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

    async update(request, response) {

        await ScheduleModel.findByIdAndUpdate({'_id': request.params.id}, request.body, {new: true})
            .then(res => {
                return response.status(200).json(res);
            })
            .catch(error => {
                return response.status(500).json(error);
            })

    }

    async busy_beetween_dates(request, response) {
        await ScheduleModel.find({ 'start' : { '$gte': new Date(request.body.start)}, 'end' : {'$lte': new Date(request.body.end)}})
            .sort('start')
            .then(res => {
                return response.status(200).json(res);
            })
            .catch(error => {
                return response.status(500).json(error);
            })
    }

    async free_beetween_dates(request, response) {

        let start = new Date(request.body.start);
        let end = endOfDay(new Date(request.body.end));
        let duration = parseInt(request.body.duration);
        let modality = request.body.modality;
        let number_days =  differenceInCalendarDays(end, start);
        let courts = modality == "Vôlei de Praia" || modality == "FutVôlei" ? ["Quadra Areia 1"] : modality == "Beach Tennis" ? ["Quadra Areia 3", "Quadra Areia 2", "Quadra Areia 1"] : [];
        let days = [];

        for (let i = 0; i < number_days; i++) {

            let day_start = setHours(startOfDay(addDays(start, i)), 6); // pega 6 horas da manhã
            let day_end = addMilliseconds(endOfDay(day_start), 1);
            let number_hours = differenceInHours(day_end, day_start);

            let day = {
                day: day_start,
                free_schedules: []
            }

            for(let j = 0; j < number_hours; j++) {
                
                let free_schedule = {
                    start: addHours(day_start, j),
                    end: addHours(day_start, j + duration),
                    start1: format(addHours(day_start, j), 'HH:mm'),
                    end1: format(addHours(day_start, j + duration), 'HH:mm'),
                }

                if (!isAfter(free_schedule.end, day_end)) {

                    for(let court of courts) {

                        let schedules = await ScheduleModel.find({
                            'date' : {'$gte': day_start, '$lte': day_end},
                            'court' : { '$eq': court}
                        })

                        let busy_hours = []
                        for (let schedule of schedules) {
                            for (let i = 0; i < schedule.duration; i++) {
                                let temp = addHours(new Date(schedule.start), i);
                                busy_hours.push(temp);
                            }
                        }

                        let exists = false;
                        for (let i = 0; i < duration; i++) {

                            let hour = addHours(free_schedule.start, i);

                            for(let busy_hour of busy_hours) {
                                if (isSameHour(hour, busy_hour)) {
                                    exists = true;
                                    if(exists) break;
                                }
                            }

                            if(exists) break;
                        }

                        if(!exists) {
                            free_schedule.court = court;
                            day.free_schedules.push(free_schedule);
                            break;
                        } 

                    }


                } else break;
            }

            if(day.free_schedules.length != 0) days.push(day);

        }

        return response.status(200).json(days)
    }

    async show(request, response) {
        await ScheduleModel.findById(request.params.id)
            .then(res => {
                if (res) return response.status(200).json(res)
                else return response.status(404).json({error : "Schedule not found"});
            })
            .catch(error => {
                return response.status(500).json(error);
            })
    }

    async delete(request, response) {
        await ScheduleModel.deleteOne({'_id': request.params.id})
            .then(res => {
                if (res) return response.status(200).json(res)
                else return response.status(404).json({error : "Schedule not found"});
            })
            .catch(error => {
                return response.status(500).json(error);
            })
    }

    async check_its_free(start, end, court) {

        its_free = true;

        let schedules = await ScheduleModel.find({
                            'date' : {'$gt': start, '$lt': end},
                            'court' : { '$eq': court}
                        })
        
        

    }


}

module.exports = new ScheduleController();