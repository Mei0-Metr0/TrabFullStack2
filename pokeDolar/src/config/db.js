import mongoose from 'mongoose';
//import dotenv from 'dotenv';

//dotenv.config();

const connectDB = async () => {
    console.log({
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_CLUSTER: process.env.DB_CLUSTER,
        APPNAME: process.env.APPNAME,
        SECRET: process.env.SECRET,
    });

    try {
        const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.APPNAME}?retryWrites=true&w=majority`;
        console.log('Connecting to MongoDB at URI:', uri);
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;