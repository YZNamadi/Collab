const Student = require('../models/student');


exports.login = async (req, res) => {
    const { rollNumber } = req.body;

    try {
        const student = await Student.findOne({ rollNumber });
        if (!student) {
            return res.status(400).json({ message: 'Invalid credentials.' })
        }

        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' })
    }
};


exports.viewOwnDetails = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).populate('teacher'); 
        if (!student) return res.status(404).json({ message: 'Student not found.' });

        res.json({ student })
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch student details.' });
    }
};