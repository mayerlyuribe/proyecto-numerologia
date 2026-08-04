import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`mongoDB conectado: ${conn.connection.host}`);
    }catch (error){
        console.log(`error al conectar: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;