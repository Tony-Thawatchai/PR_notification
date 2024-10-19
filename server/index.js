import express from 'express';
import path from 'path';
import cors from 'cors';
// import chatbotRoutes from './routes/chatbotRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const PORT = process.env.PORT || 5050;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// // Use chatbot routes
// app.use('/api', chatbotRoutes);


// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


