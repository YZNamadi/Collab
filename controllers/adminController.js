const userModel = require('../models/admin');
const bcrypt = require('bcryptjs');
const sendMail = require('../helper/email');
const jwt = require('jsonwebtoken');


// Create User
exports.createUser = async (req, res) => {
    try {
        const { fullname, password, email } = req.body;
        const user = await userModel.findOne({email})
        if(user){
            return res.status(404).json({message:'user with this email already exist'})
        }
       

        // Check if email or password is missing
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new userModel({
            fullname,
            password: hash,  // Store the hashed password
            email,
        });

        // Save the user in the database
        await newUser.save();

        // Generate JWT token with an expiry of 3 minutes
        const token = await jwt.sign({ id: newUser._id }, process.env.secret, { expiresIn: '3mins' });

        // Generate the verification link
        const link = `${req.protocol}://${req.get('host')}/mail/${newUser._id}/${token}`;
console.log(link);

        // Send verification email
        const subject = "Welcome " + fullname;
        const text = `Welcome ${fullname}, kindly use this link to verify your email: ${link}`;
        sendMail({email:newUser.email, subject:subject, text:text});

        // Return successful response
        res.status(201).json({
            message: 'User created successfully',
            data: newUser, // Returning the user data (without password)
        });

    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Verify Email
exports.verifyMail = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.params.token);
        

        // Find user by ID
        const checkuser = await userModel.findById(id);
        if (!checkuser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if email is already verified
        if (checkuser.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        // Verify the JWT token
        jwt.verify(token, process.env.secret, async (error) => {
            if (error) {
                return res.status(404).json({
                    message: "Email verification link has expired"
                });
            }

            // Update the user as verified
            await userModel.findByIdAndUpdate(id, { isVerified: true });

            res.status(200).json({
                message: "Email verified successfully"
            });
        });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "An error occurred during verification" });
    }
};
exports.userLogin = async (req, res) => {
    try{
        const { email, passWord } = req.body
        const checkEmail = await userModel.findOne({email:email.toLowerCase()}) //.select(["fullName", "email", "_id", "password"])
        if(!checkEmail){
            return res.status(404).json({
                message: "Email not found"
            })
        }
        const checkPassword = await bcrypt.compare(passWord, checkEmail.password)
        if(!checkPassword){
            return res.status(400).json({
                message:" InCorrect Password"
            })
        }
        if(checkEmail.isVerified == false){
            return res.status(404).json({
                message: 'Email not Verified'
            })
        }
        const newData = {
            fullName: checkEmail.fullName,
            email: checkEmail.email,
            id: checkEmail._id
            
        }
        // const {isVerified,schoolImageUrl,schoolImageId,department,students,dateCreated,password, ...others} = checkEmail._doc

        // console.log(newData)
        const token = await jwt.sign({id:checkEmail._id}, process.env.secret, {expiresIn: '24hr'})
        res.status(200).json({
            message: "Login Succesfully",
            data: newData,
            token
        })

    }catch(error){
        res.status(500).json({
            message: "Unable to Login" + error.message
        })
    }
}
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const {id} = req.params;
        const school = await userModel.findById(id);
        if (!school) {
            return res.status(404).json({ message: "School not found" });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, school.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        // Hash new password and update
        const salt = await bcrypt.genSalt(10);
        school.password = await bcrypt.hash(newPassword, salt);
        await school.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
}
};

exports.forgotPassword = async (req, res) => {
    try {
        // const{id} = req.params
        const { email,newPassword } = req.body;
        const school = await userModel.findOne({ email: email.toLowerCase() });

        if (!school) {
            return res.status(404).json({ message: "Email not found" });
        }

        // Create reset token
        const token = jwt.sign({ id: school._id }, process.env.secret, { expiresIn: "15m" });

        // Send reset link via email
        const link = `${req.protocol}:${req.get("host")}/reset-password/${token}`;
        const text = `Hello ${school.fullName},kindly use this link to reset your password ${link}`
        await sendMail({
            subject: "Password Reset Request"+" "+ school.fullName,
            email: school.email,
            text
            //  html:signup(link, school.fullName) 
        });
        res.status(200).json({ message: "Password reset link sent to email" });
        
        
        // Hash new password and update
        const salt = await bcrypt.genSalt(10);
        school.password = await bcrypt.hash(newPassword, salt);
        await school.save();
       return res.status(200).json({ message: "Password changed successfully" });

       
    } catch (error) {
        res.status(500).json({ message: error.message });
}
};
exports.resetPassword = async (req, res) => {
    try {
        // const { id } = req.params;
        const { newPassword } = req.body;

        
        const checkuser = await userModel.findById( id )
    
        if (!checkuser) {
            return res.status(404).json({ message: "Invalid or expired token" });
        }
// Verify token
        await jwt.verify(req.params.token, process.env.secret, (error)=>{
            
            if(error){
                return res.status(404).json({
                    message: "Email Link Has Expired"
                })   
            }
         } )

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        school.password = await bcrypt.hash(newPassword, salt);
        await checkuser.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
}
};

exports.getallUser = async (req, res) => {
    try {
        const alluser = await userModel.find()
        res.status(200).json({
            message: `all user in database`,
            data:alluser
        })
    } catch (error) {
        res.status(500).json({
           message:error.message 
        })
    }
} 

exports.getOneUser = async (req, res) => {
    try {
        const {id}= req.params
        const alluser = await userModel.findById(id)
        if (!alluser) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        res.status(200).json({
            message: ` user in database found`,
            data:alluser
        })
    } catch (error) {
        res.status(500).json({
           message:error.message 
        })
    }
} 
exports.updateUser