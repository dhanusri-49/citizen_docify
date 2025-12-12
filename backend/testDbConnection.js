require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', process.env.DATABASE_URL);
    
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error(`❌ Connection Error: ${err.message}`);
    console.error('Error details:', err);
  }
};

testConnection();