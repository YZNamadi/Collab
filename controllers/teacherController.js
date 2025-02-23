const Teacher = require('../models/teacher');
const Student = require('../models/student');


exports.login = async (req, res) => {
    const { name, subject } = req.body;

    try {
        const teacher = await Teacher.findOne({ name, subject });
        if (!teacher) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: teacher._id, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};


exports.viewAssignedStudents = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.user.id).populate('students'); 
        if (!teacher) return res.status(404).json({ message: 'Teacher not found.' });

        res.json({ students: teacher.students });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch students.' });
    }
};


exports.updateStudentDetails = async (req, res) => {
    const { studentId, name, rollNumber } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found.' });

    
        const teacher = await Teacher.findById(req.user.id);
        if (!teacher.students.includes(student._id)) {
            return res.status(403).json({ message: 'Unauthorized access.' });
        }

        student.name = name || student.name;
        student.rollNumber = rollNumber || student.rollNumber;
        await student.save();

        res.json({ message: 'Student updated successfully.', student });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update student.' });
    }
};