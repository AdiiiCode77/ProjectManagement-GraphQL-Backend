const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ['Not Started', ' In Progress', 'Completed'],
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Projects', ProjectSchema);