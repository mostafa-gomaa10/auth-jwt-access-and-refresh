const JWT = require('jsonwebtoken');
const RefTokenModel = require('../models/RefreshToken');
const createError = require('http-errors');
require('dotenv').config({ path: './config.env' });

const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {}
        const secret = process.env.SECRET_TOKEN
        const options = {
            expiresIn: '20s',
            audience: userId
        }
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message)
                reject(createError.InternalServerError())
                return
            }
            resolve(token)
        })
    })
}


const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    JWT.verify(token, process.env.SECRET_TOKEN, (err, payload) => {
        if (err) {
            const message =
                err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
            return next(createError.Unauthorized(message))
        }
        req.payload = payload
        next()
    })
}
const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { userId }
        const secret = process.env.SECRET_REFRESH_TOKEN
        const options = {
            expiresIn: '1y',
            issuer: 'myapp.com',
            audience: userId,
        }
        JWT.sign(payload, secret, options, async (err, token) => {
            if (err) {
                console.log(err.message)
                reject(createError.InternalServerError())
            }
            // resolve(token)
            // return
            const newToken = new RefTokenModel({
                user: userId,
                token: token
            })

            try {
                const alreadyExist = await RefTokenModel.findOneAndUpdate({ user: userId }, { token: token }, { upsert: true });

                resolve(token)
                return
            } catch (error) {
                console.log(error.message)
                reject(createError.InternalServerError())
                return

            }
        })
    })
}
const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(
            refreshToken,
            process.env.SECRET_REFRESH_TOKEN,
            async (err, payload) => {
                if (err) return reject(createError.Unauthorized())
                const userId = payload.aud
                try {
                    const findToken = await RefTokenModel.findOne({ user: userId })
                    if (!findToken) {
                        reject(createError.BadRequest())
                        return
                    }
                    console.log(findToken);
                    if (refreshToken === findToken.token) return resolve(userId)
                    reject(createError.Unauthorized())

                } catch (error) {
                    reject(createError.InternalServerError())
                    return
                }

            }
        )
    })
}


module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}