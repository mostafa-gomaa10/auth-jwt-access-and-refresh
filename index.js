const express = require('express');
const morgan = require('morgan');
require('dotenv').config({ path: './config/config.env' });
const createError = require('http-errors')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
require('./config/init_mongodb');


// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');


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
app.use(express.static('public'));
app.use('/api/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    console.log('inside home');
    res.sendFile("index.html");
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
