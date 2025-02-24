// const express = require('express');
// const router = express.Router();
// const {login,viewAssignedStudents,updateStudentDetails} = require('../controllers/teacherController');
// const {authenticateToken} = require('../middleware/authMiddleware');


// router.post('/login', login);

// router.get('/students', authenticateToken, viewAssignedStudents);


// router.put('/students/:studentId', authenticateToken, updateStudentDetails);

// module.exports = router;



const express = require('express');
const router = express.Router();
const {login,viewAssignedStudents,updateStudentDetails,createStudent,getallteacher} = require('../controllers/teacherController');
const {authenticateToken} = require('../middleware/authMiddleware');


router.post('/login', login);

router.get('/students', authenticateToken, viewAssignedStudents);
router.post('/teacher/:id', createStudent)
router.get('/teacher',getallteacher )

router.put('/students/:studentId', authenticateToken, updateStudentDetails);

module.exports = router;