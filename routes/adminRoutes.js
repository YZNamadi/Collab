const { createUser, verifyMail,getallUser,getOneUser,changePassword,forgotPassword,resetPassword } = require('../controllers/adminController')
const {checkLogins} = require('../middleware/authMiddleware')

const router = require ('express').Router()

router.post('/useer',checkLogins, createUser)
router.get('/mail/:id', verifyMail)
router.get('/user',getallUser)
router.get('/one/:id',getOneUser)
router.post("/change-password", changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router