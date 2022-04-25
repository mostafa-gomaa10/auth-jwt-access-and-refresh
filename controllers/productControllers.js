const Product = require('../models/product');


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


// add product
const addProduct = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ 'error': 'No file uploaded' });
    }

    if (!availableMimes.includes(req.files.image.mimetype)) {
        return res.status(400).json({ 'error': 'unsupported format, upload an image' });
    }

    // The name of the input field (i.e. "image") is used to retrieve the uploaded file
    const imgFile = req.files.image;

    let buff = imgFile.data;
    let base64data = buff.toString('base64');

    let imgSrc = "data:" + imgFile.mimetype + ";base64," + base64data


    const product = new Product({
        ...req.body,
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
    console.log(req.body);
    console.log(req.files);

    const { id } = req.params.id;
    const { name, qty, price, desc } = req.body;
    if (!req.files || Object.keys(req.files).length === 0) {
        await Product.findByIdAndUpdate(id, { name, qty, price, desc }, { new: true })
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

        await Product.findByIdAndUpdate(id, { name, qty, price, desc, image: imgSrc }, { new: true })
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
            // console.log(result);
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
    getProduct,
    updateProduct,
    deleteProduct
}