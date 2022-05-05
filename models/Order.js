const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: mongoose.Types.ObjectId,
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    cart: {
        type: [{
            id: String,
            name: String,
            quantity: Number
        }],
        required: true
    },
    // totalCost: {
    //     type: String,
    //     required: true
    // },
    // paid: {
    //     type: Boolean,
    //     required: true
    // },

})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;