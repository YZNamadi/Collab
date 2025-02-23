const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authenticateToken = require('../middleware/authMiddleware');


router.post('/login', teacherController.login);

router.get('/students', authenticateToken, teacherController.viewAssignedStudents);


router.put('/students/:studentId', authenticateToken, teacherController.updateStudentDetails);

module.exports = router;