const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    fullname:{
        type: String,
        required:true
    },
    email:{
        type:String,
        // required:true,
        lowerCase:true,
        
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    password:{
        type: String,
        required:true
    },
    isSuperAdmin:{
        type:Boolean,
        default:false
    },isAdmin:{
        type:Boolean,
        default:false
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher'
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    }]
})

const userModel = mongoose.model('user', userSchema)
module.exports = userModel