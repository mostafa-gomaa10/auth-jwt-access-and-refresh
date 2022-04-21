const router = require('express').Router();
const { regsiterPost, loginPost, refreshToken, logoutPost } = require('../controllers/authController');


router.post('/register', regsiterPost);
router.post('/login', loginPost)
router.post('/refresh-token', refreshToken)
router.post('/logout', logoutPost)

module.exports = router