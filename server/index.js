import express from "express";
import path from "path";
import cors from "cors";
import emailRoutes from "./routes/emailRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import ServerlessHttp from "serverless-http";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// for testing in local, comment out when deploying
// const PORT = process.env.PORT || 5050;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection
// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB Connection is ready");
  })
  .catch((error) => {
    console.log(error);
  });

// Use email routes
app.use("/email", emailRoutes);

// Error handling middleware
app.use(errorHandler);

// for testing in local, comment out when deploying
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// Export app for serverless
export const handler = ServerlessHttp(app);
