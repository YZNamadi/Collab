// const express = require('express');
// const router = express.Router();
// const {login,viewOwnDetails} = require('../controllers/studentController');
// const {authenticateToken} = require('../middleware/authMiddleware');


// router.post('/login', login);

// router.get('/details', authenticateToken, viewOwnDetails);

// module.exports = router;


const studentRouter = require ('express').Router()
const {getOneStudent} = require ('../controller/studentController');


// adminRouter.post('/student/:id', checkLogins, createStudent);
studentRouter.get('/student/:id', getOneStudent);

module.exports = studentRouter;