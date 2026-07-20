const mongoose = require("mongoose")

let connectionPromise = null
const connectDB= async()=>{
    if(mongoose.connection.readyState==1) return

    if(!connectionPromise) return connectionPromise

    connectionPromise =mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("database connected successfully");
        
    })
    .catch((err)=>{
        console.log("Error connecting to db", err);
        throw error;
    })

    return connectionPromise;
}

module.exports = connectDB;

