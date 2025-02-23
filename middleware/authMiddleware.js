const jwt = require('jsonwebtoken');
require('dotenv').config();

//to verify JWT token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; 
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        next(); 
    } catch (err) {
        res.status(403).json({ message: 'Invalid token.' });
    }
}

module.exports = authenticateToken;