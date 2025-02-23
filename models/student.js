const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' } 
});


module.exports = mongoose.model('Student', studentSchema);