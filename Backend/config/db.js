import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        const mongoUri = (
            process.env.MONGO_URI || "mongodb://localhost:27017/ishu"
        ).trim();

        if (!mongoUri) {
            throw new Error("MongoDB URI is not defined. Set MONGO_URI or MONGODB_URI.");
        }

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log("MongoDB connected successfully")
    }
    catch(error){
        console.error(`MongoDB connection error: ${error.message}`);
        throw error;
    }
}

export default connectDB;