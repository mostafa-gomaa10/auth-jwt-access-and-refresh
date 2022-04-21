const router = require('express').Router();
const { checkAuth } = require('../middlware/auth');
const { verifyAccessToken } = require('../config/jwt_helper');


router.get('/', verifyAccessToken, (req, res) => {
    res.json({ posts: 'you are permitted' });
})

router.get('/prev-check', checkAuth, (req, res) => {
    res.json({ posts: 'you are permitted' });
})

module.exports = router