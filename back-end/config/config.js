const dotenv = require('dotenv')
const mongoose = require('mongoose');

dotenv.config();

const dbConnect = async () => {
    const URI = process.env.MONGO_URI
    try{
        await mongoose.connect(URI);
        console.log("DB connected");
    }catch{
        console.log("DB connection failed");
        process.exit(1);
    }
}

module.exports = dbConnect;