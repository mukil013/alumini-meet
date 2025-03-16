const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectTitle: {
        type: String,
        required: true,
        trim: true, 
    },
    projectDescription: {
        type: String,
        required: true,
        trim: true, 
    },
    gitLink: {
        type: String,
        required: true,
        trim: true, 
    },
    userId: {
        type: String,
        required: true,
        trim: true,
    }

});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;