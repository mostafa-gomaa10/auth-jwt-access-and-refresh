const User = require('../models/User');
const RefreshTokenModel = require('../models/RefreshToken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../config/jwt_helper');
const createError = require('http-errors');


const regsiterPost = async (req, res) => {
    const validation = registerValidation(req.body);

    if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message })
    }

    const { email, password } = validation.value
    const emailExist = await User.findOne({ email: email });

    if (emailExist) {
        return res.status(400).json({ error: 'Email Already Registered' })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name: req.body.name,
        email: email,
        password: hashedPassword,
    })

    try {
        const savedUser = await user.save();
        if (savedUser) {
            res.status(201).json({
                success: 'user created',
                user: { id: user._id, name: user.name, email: user.email }
            })
        }
    } catch (error) {
        res.status(400).json({
            error: {
                email: error.errors.email,
                name: error.errors.name,
                password: error.errors.password,
            }
        });
    }
}


const loginPost = async (req, res, next) => {
    try {

        const validation = loginValidation(req.body);

        if (validation.error) {
            return res.status(400).json({ error: validation.error.details[0].message })
        }

        const { email, password } = validation.value
        const user = await User.findOne({ email: email });
        if (!user) {
            throw createError.NotFound('User not registered')
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            throw createError.Unauthorized('Username/password not valid')
        }

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.send({
            success: 'login success',
            user: { id: user.id, name: user.name, email: user.email },
            accessToken: accessToken,
            refreshToken: refreshToken,
        })

    } catch (error) {
        if (error.isJoi === true)
            return next(createError.BadRequest('Invalid Username/Password'))
        next(error)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createError.BadRequest();

        const userId = await verifyRefreshToken(refreshToken);

        const accessToken = await signAccessToken(userId);
        const newRefreshToken = await signRefreshToken(userId);
        res.json({ accessToken: accessToken, refreshToken: newRefreshToken });

    } catch (error) {
        next(error)
    }
}

const logoutPost = async (req, res, next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)
        const oldRefToken = await RefreshTokenModel.findOneAndDelete({ user: userId });
        if (!oldRefToken) {
            throw createError.BadRequest()
        }
        console.log(oldRefToken);
        res.sendStatus(204);

    } catch (error) {
        next(error)
    }
}


module.exports = {
    regsiterPost,
    loginPost,
    logoutPost,
    refreshToken
}