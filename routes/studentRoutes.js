const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticateToken = require('../middleware/authMiddleware');


router.post('/login', studentController.login);

router.get('/details', authenticateToken, studentController.viewOwnDetails);

module.exports = router;