const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);