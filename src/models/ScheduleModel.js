const mongoose = require('../config/database');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema ({
    date: {type: Date, required: true},                 //Required
    duration: {type: Number, required: true},           //Required
    start: {type: Date, required: true},                //Required
    end: {type: Date, required: true},                  //Required
    client: {
        name: {type: String, required: true},           //Required
        phone: {type: String, required: true}           //Required
    },
    coupon: {
        name: {type: String},                           //Required
        type: {type: String},                           //Required
        amount: {type: Number},                         //Required
    },
    statePayment: {type: String, required: true},              //Required
    amount: {type: Schema.Types.Decimal128, required: true},             //Required
    numberRacquet: {type: Number, default: 0},          
    ball: {type: Boolean, default: false},              
    typeSchedule: {type: String, required: true},       //Required
    recurrent: {type: Number, default: 0},
    created: {type: String, default: Date.now()} 
})

module.exports = mongoose.model('Schedule', ScheduleSchema);