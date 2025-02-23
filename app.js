const express = require('express');
require("dotenv").config();
const DATABASE_URL = process.env.DATABASE_URL;
const mongoose = require('mongoose');
const routerS = require('./routes/adminRoutes');

const app = express();
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
