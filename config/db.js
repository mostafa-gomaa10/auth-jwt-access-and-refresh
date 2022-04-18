const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("DB Connected : " + conn.connection.host);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;