const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        toUpperCase:true
    },
    email:{
        type:String,
        required:true,
        lowerCase:true,
        unique:true
    },
    phoneNumber:{
        type:String
    },
    address:{
        type:String
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    }]

})
const teacherModel = mongoose.model('teacher', teacherSchema)
module.exports = teacherModel