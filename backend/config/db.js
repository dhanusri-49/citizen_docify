const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      // These options ensure stable connection
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    // Exit process with failure so we know it failed
    process.exit(1);
  }
};

module.exports = connectDB;