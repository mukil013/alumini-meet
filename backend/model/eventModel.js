const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    eventTitle: {
        type: String,
        required: true,
        trim: true, 
    },
    eventDescription: {
        type: String,
        required: true,
        trim: true, 
    },
    applyLink: {
        type: String,
        required: true,
        trim: true, 
    }

});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;