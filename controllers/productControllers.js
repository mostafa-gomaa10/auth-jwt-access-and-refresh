const Product = require('../models/product');
const { productCreateValidation } = require('../validation');
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const availableMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

// fetch all products
const getAllProducts = (req, res, next) => {
    Product.find()
        .then((result) => {
            res.status(200).json({ result: result })
        })
        .catch((err) => {
            next(err)
        })
}
// fetch all products -- No image
const getAllProductsNoImage = (req, res, next) => {
    Product.find({}).select('-image')
        .then((result) => {
            res.status(200).json({ result: result })
        })
        .catch((err) => {
            next(err)
        })
}


// add product
const addProduct = async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    const validation = productCreateValidation(req.body);

    if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message })
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ 'error': 'No file uploaded' });
    }

    if (!availableMimes.includes(req.files.image.mimetype)) {
        return res.status(400).json({ 'error': 'unsupported format, upload an image' });
    }
    if (req.files.image > MAX_FILE_SIZE) {
        return res.status(400).json({ 'error': 'filze size is large max: 5MB' });
    }


    // The name of the input field (i.e. "image") is used to retrieve the uploaded file
    const imgFile = req.files.image;
    const { name, desc, qty, price, user } = req.body;
    let buff = imgFile.data;
    let base64data = buff.toString('base64');

    let imgSrc = "data:" + imgFile.mimetype + ";base64," + base64data


    const product = new Product({
        name,
        desc,
        user,
        qty: parseFloat(qty),
        price: parseFloat(price),
        image: imgSrc
    });

    await product.save()
        .then((result) => {
            res.status(201).json({
                result
            });
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ 'error': 'database error connection' });
        })
}

// update product
const updateProduct = async (req, res) => {

    const { id } = req.params.id;
    if (!id) return res.status(400).json({ 'error': 'Bad Request' });

    const validation = productCreateValidation(req.body);
    if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message })
    }


    const { name, qty, price, desc, user } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        await Product.findByIdAndUpdate(id, { name, qty, price, desc, user }, { new: true })
            .then((result) => {
                console.log(result);
                res.status(201).json({
                    result
                });
            }).catch((err) => {
                console.log(err);
                res.status(500).json({ 'error': 'database error connection' });
            })
    } else {

        if (!availableMimes.includes(req.files.image.mimetype)) {
            return res.status(400).json({ 'error': 'unsupported format, upload an image' });
        }

        // The name of the input field (i.e. "image") is used to retrieve the uploaded file
        const imgFile = req.files.image;

        let buff = imgFile.data;
        let base64data = buff.toString('base64');

        let imgSrc = "data:" + imgFile.mimetype + ";base64," + base64data

        await Product.findByIdAndUpdate(id, { name, qty, price, desc, user, image: imgSrc }, { new: true })
            .then((result) => {
                res.status(201).json({
                    result
                });
            }).catch((err) => {
                console.log(err);
                res.status(500).json({ 'error': 'database error connection' });
            })
    }

}


const getProduct = (req, res, next) => {
    const id = req.params.id
    Product.findById(id)
        .then((result) => {
            res.status(200).json({ result: result })
        })
        .catch((err) => {
            console.log(err);
            res.json({ error: err });
        })
}

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    Product.findByIdAndDelete(id)
        .then((result) => {
            // console.log(result);
            res.status(200).json({ result: result })
        })
        .catch((err) => {
            next(err)
        })
}

module.exports = {
    addProduct,
    getAllProducts,
    getAllProductsNoImage,
    getProduct,
    updateProduct,
    deleteProduct,
}