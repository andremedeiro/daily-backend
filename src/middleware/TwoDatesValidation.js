const { isValid, isSameHour, isBefore, differenceInHours } = require('date-fns')

const TwoDatesValidation = async (request, response, next) => {

    const { start, end, duration, modality } = request.body;

    if (!start) {
        return response.status(400).json({error: 'start is required'});
    } else if (!isValid(new Date(start))) {
        return response.status(400).json({error: 'start is invalid'});
    } else if (!end) {
        return response.status(400).json({error: 'end is required'});
    } else if (!isValid(new Date(end)) || isBefore(new Date(end), new Date(start)) || isSameHour(new Date(start), new Date(end))) {
        return response.status(400).json({error: 'end is invalid'});
    } else if (request.url == '/free' && !duration) {
        return response.status(400).json({error: 'duration is required'});
    } else if (request.url == '/free' && (typeof duration != 'number' || duration < 1 || duration > 18 || duration > differenceInHours(new Date(end), new Date(start)))) {
        return response.status(400).json({error: 'duration is invalid'});
    } else if (request.url == '/free' && !modality) {
        return response.status(400).json({error: 'modality is required'});
    } else if (request.url == '/free' && !["Vôlei de Praia", "FutVôlei", "Beach Tennis"].includes(modality)) {
        return response.status(400).json({error: 'modality is invalid'});
    } else {
        next();
    }
    
}

module.exports = TwoDatesValidation;