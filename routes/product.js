const { Router } = require('express');
const router = Router();

const {
    addProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productControllers');


router.get('/all-products', getAllProducts);
router.post('/add-product', addProduct);
router.post('/update-product', updateProduct);
router.get('/delete-product/:id', deleteProduct);
router.get('/:id', getProduct);

module.exports = router;

