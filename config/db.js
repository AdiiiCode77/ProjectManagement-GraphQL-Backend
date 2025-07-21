const mongoose = require('mongoose');
require('dotenv').config();

const ConnectDB = async () =>{

    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports = ConnectDB