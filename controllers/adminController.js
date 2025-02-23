const Admin = require('../models/admin');
const Teacher = require('../models/teacher');
const Student = require('../models/student');
const bcrypt = require('bcryptjs')

exports.createFirstAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            return res.status(400).json({ message: 'An admin already exists. Please login.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

       
        const admin = new Admin({ username, password: hashedPassword });
        await admin.save();

       
        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'First admin created successfully.',
            admin,
            token
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create the first admin.' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};


exports.createTeacher = async (req, res) => {
    const { name, subject } = req.body;

    try {
        const teacher = new Teacher({ name, subject });
        await teacher.save();
        res.status(201).json({ message: 'Teacher created successfully.', teacher });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create teacher.' });
    }
};

// Create a new student
exports.createStudent = async (req, res) => {
    const { name, rollNumber, teacherId } = req.body;

    try {
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found.' });

        const student = new Student({ name, rollNumber, teacher: teacherId });
        await student.save();
        teacher.students.push(student._id);
        await teacher.save();
        res.status(201).json({ message: 'Student created successfully.', student });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create student.' });
    }
};