const { createUser, verifyMail,getallUser,getOneUser,changePassword,forgotPassword,resetPassword, userLogin} = require('../controllers/adminController')
const {authenticateToken} = require('../middleware/authMiddleware')
const {checkRole} = require('../middleware/authorization')

const router = require ('express').Router()

router.post('/user', createUser)
router.get('/mail/:id', verifyMail)
router.post('/login', userLogin)
router.get('/user',getallUser)
router.get('/one/:id',checkRole, getOneUser)
router.post("/change-password", changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router
