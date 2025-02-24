const express = require('express');
const router = express.Router();
const {login,viewOwnDetails} = require('../controllers/studentController');
const {authenticateToken} = require('../middleware/authMiddleware');


router.post('/login', login);

router.get('/details', authenticateToken, viewOwnDetails);

module.exports = router;