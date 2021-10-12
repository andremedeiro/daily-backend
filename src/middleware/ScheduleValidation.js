const ScheduleModel = require('../model/ScheduleModel');
const { isPast, isValid, isSameDay, differenceInHours, isBefore, addHours, isSameHour } = require('date-fns')

const ScheduleValidation = async (request, response, next) => {

    const {date, duration, start, end, modality, court, client, statePayment, amount, typeSchedule, ball } = request.body;

    if (!date) {
        return response.status(400).json({error: 'date is required'});
    } else if (isPast(new Date(date)) || !isValid(new Date(date))) {
        return response.status(400).json({error: 'date is invalid'});
    } else if (!duration) {
        return response.status(400).json({error: 'duration is required'});
    } else if (typeof duration != 'number' || duration < 1 || duration > 18) {
        return response.status(400).json({error: 'duration is invalid'});
    } else if (!start) {
        return response.status(400).json({error: 'start is required'});
    } else if (isPast(new Date(start)) || !isValid(new Date(start)) || !isSameDay(new Date(date), new Date(start))) {
        return response.status(400).json({error: 'start is invalid'});
    } else if (!end) {
        return response.status(400).json({error: 'end is required'});
    } else if (isPast(new Date(end)) || !isValid(new Date(end)) || differenceInHours(new Date(end), new Date(start)) != duration || isBefore(new Date(end), new Date(start))) {
        return response.status(400).json({error: 'end is invalid'});
    } else if (!modality) {
        return response.status(400).json({error: 'modality is required'});
    } else if (!["Vôlei de Praia", "Beach Tennis", "FutVôlei"].includes(modality)) {
        return response.status(400).json({error: 'modality is invalid'});
    } else if (!court) {
        return response.status(400).json({error: 'court is required'});
    } else if ((court == "Quadra Areia 1" && !["Vôlei de Praia", "Beach Tennis", "FutVôlei"].includes(modality)) || (["Quadra Areia 2", "Quadra Areia 3"].includes(court) && modality != "Beach Tennis") || !["Quadra Areia 1", "Quadra Areia 2", "Quadra Areia 3"].includes(court)) {
        return response.status(400).json({error: 'court is invalid'});
    } else if (!client) {
        return response.status(400).json({error: 'client is required'});
    } else if (!client.name) {
        return response.status(400).json({error: 'client name is required'});
    } else if (!client.name.match('^[a-zA-Z záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]{2,30}$')) {
        return response.status(400).json({error: 'client name is insvalid'});
    } else if (!client.phone) {
        return response.status(400).json({error: 'client phone is required'});
    } else if (!client.phone.match('^[0-9]{8,13}$')) {
        return response.status(400).json({error: 'client phone is invalid'});
    } else if (!statePayment) {
        return response.status(400).json({error: 'statePayment is required'});
    } else if (!amount) {
        return response.status(400).json({error: 'amount is required'});
    } else if (!typeSchedule) {
        return response.status(400).json({error: 'typeSchedule is required'});
    } else if (typeSchedule != "Avulso" && typeSchedule != "Recorrente") {
        return response.status(400).json({error: 'typeSchedule is invalid'});
    } else if (ball && ball != true && ball != false) {
        return response.status(400).json({error: 'ball is invalid'});
    } else {
        
        let schedules;

        if (request.params.id) schedules = await ScheduleModel.find({
                                    '_id' : {'$ne': request.params.id},
                                    'date' : {'$eq': new Date(date)},
                                    'court' : {'$eq': court}
                                });
        else schedules = await ScheduleModel.find({
                              'date' : {'$eq': new Date(date)},
                              'court' : {'$eq': court}
                            });

        let busy_hours = []
        for (let schedule of schedules) {
            for (let i = 0; i < schedule.duration; i++) {
                let temp = addHours(new Date(schedule.start), i);
                busy_hours.push(temp);
            }
        }

        let exists = false;
        for (let i = 0; i < duration; i++) {

            let hour = addHours(new Date(start), i);

            for(let busy_hour of busy_hours) {
                if (isSameHour(hour, busy_hour)) {
                    exists = true;
                    if(exists) break;
                }
            }

            if(exists) break;
        }

        if(!exists) next();
        else return response.status(400).json({error: "there is already an appointment at this time"});
    
    }
    
}

module.exports = ScheduleValidation;