const jwt = require('jsonwebtoken');
const userModel = require('../models/admin')

exports.checkLogins = async (req, res, next) =>{
    if(!req.headers.authorization){
        return res.status(404).json({
            message:"Kindly Login to perform this Action"
        })
    }
    const checkToken = req.headers.authorization.split(" ")[1]

    
   const tokenOwner = await jwt.verify(checkToken, "secret_key", (error, data)=>{
       if(error){ 
        return res.status(400).json({
            message: error.message
        })
        
        }
        return data
    })
    console.log(tokenOwner )
    const checkUser = await userModel.findById(tokenOwner.id)
    if(!checkUser){
        return res.status(404).json({
            message: "School Not Found"
        })
    }
    next()
}
