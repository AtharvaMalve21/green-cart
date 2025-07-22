import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectMongoDB from "./config/mongodb.config.js";
import connectCloudinary from "./config/cloudinary.config.js";

//route handlers
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

//middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: process.env.CLIENT_URI,
    credentials: true,
  })
);
app.use(cookieParser());

//connect to mongo database
connectMongoDB();

//connect to cloudinary
connectCloudinary();

//route handlers
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Green Cart!." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is listening to port ${PORT}`);
});
