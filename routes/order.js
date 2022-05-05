const { Router } = require('express');
const { createOrder,
    getOrders
} = require('../controllers/orderController');

const router = Router();

router.get('/', getOrders)
router.post('/create', createOrder)

module.exports = router