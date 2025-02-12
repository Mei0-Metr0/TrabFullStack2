import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // String de conexão ao MongoDB
        const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.APPNAME}?retryWrites=true&w=majority`;
        console.log('Connecting to MongoDB');

        // Conecta ao MongoDB
        await mongoose.connect(uri);
        
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Finaliza o processo com um código de erro (1 indica falha).
        process.exit(1);
    }
};

export default connectDB;