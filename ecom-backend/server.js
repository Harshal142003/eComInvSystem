  import express from "express";
  import mongoose from "mongoose";
  import cors from "cors";
  import dotenv from "dotenv";

  import productRoutes from './routes/products.js';
  import categoryRoutes from './routes/categories.js';
  import orderRoutes from './routes/orders.js';
  import userRoutes from './routes/users.js';
  dotenv.config(); // Load variables from .env
  const app = express();
  const PORT = process.env.PORT || 5000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Test route
  app.get("/", (req, res) => {
    res.send("API is running...");
  });

  app.use('/api/products',productRoutes);
  app.use('/api/category',categoryRoutes);
  app.use('/api/orders',orderRoutes);
  app.use('/api/users',userRoutes);
  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => console.error(err));

