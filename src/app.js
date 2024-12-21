import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/database.js';
dotenv.config('../.env');
const PORT = process.env.PORT || 3000;


// Connect to MongoDB
connectDB();
const app = express();
app.use(express.json());


app.use('/ping', (req, res) => {
  res.send("Pong");
})


app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
})