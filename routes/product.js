const { Router } = require('express');
const router = Router();
const { verifyAccessToken } = require('../config/jwt_helper')

const {
    addProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getAllProductsNoImage
} = require('../controllers/productControllers');


router.get('/all', getAllProducts);
router.get('/all-no-image', getAllProductsNoImage);
// router.post('/add', verifyAccessToken, addProduct);
router.post('/add', addProduct);
router.post('/update/:id', verifyAccessToken, updateProduct);
router.get('/delete/:id', verifyAccessToken, deleteProduct);
router.get('/:id', getProduct);

module.exports = router;

