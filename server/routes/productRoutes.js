const express = require("express");
const router = express.Router();
const { upload } = require("../utils/fileUpload");

const {
  addProduct,
  getProducts,
  viewProduct,
  filterProductByCategory,
  changeStock,
  deleteProduct,
} = require("../controllers/productController");

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

router.post(
  "/add",
  upload.array("photos", 100),
  isAuthenticated,
  isAuthorized("Admin"),
  addProduct
);
router.get("/", getProducts);
router.get("/filter", filterProductByCategory);
router.get("/:id", viewProduct);
router.put(
  "/change-stock",
  isAuthenticated,
  isAuthorized("Admin"),
  changeStock
);
router.delete("/:id", isAuthenticated, isAuthorized("Admin"), deleteProduct);

module.exports = router;
