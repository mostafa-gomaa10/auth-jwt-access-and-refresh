const { Router } = require('express');
const router = Router();
const { verifyAccessToken } = require('../config/jwt_helper')

const {
    addProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productControllers');


router.get('/all-products', getAllProducts);
router.post('/add-product', verifyAccessToken, addProduct);
router.post('/update-product/:id', verifyAccessToken, updateProduct);
router.get('/delete-product/:id', verifyAccessToken, deleteProduct);
router.get('/:id', getProduct);

module.exports = router;

