const express = require('express');
const morgan = require('morgan');
require('dotenv').config({ path: './config/config.env' });
const createError = require('http-errors')
const fileUpload = require('express-fileupload');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./config/init_mongodb');


// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const { verifyAccessToken } = require('./config/jwt_helper');
const Product = require('./models/product');


// init app
const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    limits: { fileSize: 2 * 1024 * 1024 },
    abortOnLimit: true
}));

app.use('/api/auth', authRoutes)
app.use('/products', productRoutes)

app.get('/productstwo', (req, res) => {
    res.send("hello home");
})

app.post('/image-test', (req, res) => {
    console.log(req.files.image.size);
    if (req.files.image.size > 1) {
        return res.status(400).json({ 'error': 'filze size is large max: 5MB' });
    }
    console.log(req.files);
    res.send({ result: req.files.image.size, done: 'done' })
})



app.use(async (req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => { console.log('server running.... at ' + PORT); })
