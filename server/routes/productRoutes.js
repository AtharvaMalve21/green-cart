const express = require("express");
const router = express.Router();
const { upload } = require("../utils/fileUpload");

const {
  addProduct,
  getProducts,
  viewProduct,
  filterProductByCategory,
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
router.delete("/:id", deleteProduct);

module.exports = router;
