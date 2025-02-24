const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    gender:{
        type:String,
    },
    email:{
        type:String,
        lowercase:true,
        unique:true
    },
    phoneNumber:{
        type:String
    },

})

const studentModel = mongoose.model('users', studentSchema)
module.exports = studentModel