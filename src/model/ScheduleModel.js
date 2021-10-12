const mongoose = require('../config/database');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

const ScheduleSchema = new Schema ({
    date: {type: Date, required: true},
    duration: {type: Number, required: true},
    start: {type: Date, required: true},
    end: {type: Date, required: true},
    modality: {type: String, required: true},
    court: {type: String, required: true},
    client: {
        name: {type: String, required: true},
        phone: {type: String, required: true}
    },
    coupon: {
        name: {type: String},
        type: {type: String},
        amount: {type: Number},
    },
    statePayment: {type: String, required: true},
    amount: {type: String, required: true},
    numberRacquet: {type: Number, default: 0},
    ball: {type: Boolean, default: false},
    typeSchedule: {type: String, required: true},
    recurrent: {type: Number, default: 0},
    created: {type: String, default: Date.now()}
})

module.exports = mongoose.model('Schedule', ScheduleSchema);