const mongoose = require('mongoose');


const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }] 
});


module.exports = mongoose.model('Teacher', teacherSchema);