import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // String de conexão ao MongoDB
        const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.APPNAME}?retryWrites=true&w=majority`;
        console.log('Connecting to MongoDB');

        // Conecta ao MongoDB
        await mongoose.connect(uri, {
            maxPoolSize: 10, // tamanho máximo do pool de conexões, 10 conexões simultâneas podem ser usadas.
            minPoolSize: 2, // número mínimo de conexões que devem ser mantidas ativas, garantindo que sempre haja pelo menos 2 conexões prontas.
            serverSelectionTimeoutMS: 5000, // Tempo máximo (5 segundos) que o Mongoose esperará para encontrar um servidor MongoDB disponível antes de lançar um erro.
            socketTimeoutMS: 45000, // Tempo máximo (45 segundos) que o driver esperará por uma resposta do banco de dados antes de considerar a conexão falha.
        });
        
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Finaliza o processo com um código de erro (1 indica falha).
        process.exit(1);
    }
};

export default connectDB;