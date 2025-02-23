const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware');


router.post('/login', adminController.login);

// router.post('/admins', authenticateToken, adminController.createAdmin);
router.post('/teachers', authenticateToken, adminController.createTeacher);

router.post('/students', authenticateToken, adminController.createStudent);

router.post('/setup', adminController.createFirstAdmin);

module.exports = router;