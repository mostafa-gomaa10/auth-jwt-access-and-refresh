const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const mongoose = require('mongoose')
const createError = require('http-errors');
require('dotenv').config({ path: '../config/config.env' });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const getOrders = async (req, res, next) => {
    res.send('orders home')
}

const createOrder = async (req, res, next) => {
    const { userId, cart } = req.body

    const calculateCost = async () => {
        let cartList = []
        for (let product of cart) {
            try {
                const productFound = await Product.findOne({ _id: product.id });
                console.log({
                    id: productFound.id,
                    name: productFound.name,
                    price: productFound.price,
                    quantity: product.quantity
                });
                cartList.push({
                    id: productFound.id,
                    name: productFound.name,
                    price: productFound.price,
                    quantity: product.quantity
                })
            } catch (error) {
                return res.status(400).json({ 'error': 'bad request' })
            }
        }
        return cartList
    }
    const cartList = await calculateCost()

    User.findOne({
        _id: userId
    }, function (err, existing) {
        if (err) return res.status(400).json({ 'error': 'bad request' })
    })

    const newOrder = new Order({
        user: req.body.user,
        address: req.body.address,
        phone: req.body.phone,
        cart: cartList,
    });

    // res.json({ newOrder })
    const saved = await newOrder.save()

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: cartList.map(item => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name,
                        },
                        unit_amount_decimal: item.price,
                    },
                    quantity: item.quantity,
                }
            }),
            success_url: `http://localhost:5000/success.html`,
            cancel_url: `http://localhost:5000/cancel.html`,
        })
        res.json({ url: session.url })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }


}



module.exports = {
    createOrder,
    getOrders
}