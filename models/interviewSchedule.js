const mongoose = require('mongoose');

const interviewScheduleSchema = new mongoose.Schema({
    date:{type:Date, required:true},
    time:{type:String, required:true},
    googleMeetLink :{type:String, required:true},
    isInterviewScheduled:{type:Boolean,default:false},
    developerId:{type:mongoose.Types.ObjectId,ref:'developer'}
});

module.exports = mongoose.model('interviewSchedule',interviewScheduleSchema);