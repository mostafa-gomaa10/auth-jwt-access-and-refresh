const express = require('express');
const morgan = require('morgan');
require('dotenv').config({ path: './config/config.env' });
const createError = require('http-errors')
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./config/init_mongodb');
const client = require('./config/init_redis');



// Import Routes
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');


// init app
const app = express();


// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes)
app.use('/posts', postsRoutes)

app.get('/', (req, res) => {
    res.send("djwdwehl");
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
