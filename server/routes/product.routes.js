import express from "express";
import {
  addProduct,
  getAllProducts,
  viewProduct,
  filterProductByCategory,
  searchProduct,
  getProductsByIds,
  changeStock,
} from "../controllers/product.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/add", isAdmin, upload.array("images", 10), addProduct);

router.post("/by-ids", getProductsByIds);

router.get("/", getAllProducts);

router.get("/filter", filterProductByCategory);

router.get("/search", searchProduct);

router.get("/:id", viewProduct);

router.get("/change-stock/:id", isAdmin, changeStock);

export default router;
