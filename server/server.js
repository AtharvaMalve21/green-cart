const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

//route handlers
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const productRoutes = require("./routes/productRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

//middleware configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  })
);
app.use(cookieParser());

//connect to Mongo Database
connectDB();

//route handlers
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/product", productRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Green Cart!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
