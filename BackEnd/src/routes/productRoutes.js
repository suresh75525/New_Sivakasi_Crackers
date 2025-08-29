const express = require("express");
const router = express.Router();
const {
  getCategories,
  getProducts,
  getProductById,
  getProductsByCategory,
  getHomepageProducts,
  searchProducts,
  createProduct, // ✅ New
  getAllProductsByCategory,
  getProductByCategoryAndId,
  getAllProducts,
} = require("../controllers/productController");

const upload = require("../utils/fileUpload"); // ✅ multer-s3 config

// Public APIs
router.get("/categories", getCategories);
router.get("/getAllProducts", getAllProducts);
router.get("/homepage", getHomepageProducts);
router.get("/search", searchProducts);
router.get("/category/:category_id/all", getAllProductsByCategory); // full list
router.get("/category/:category_id", getProductsByCategory); // paginated

router.get(
  "/category/:category_id/product/:product_id",
  getProductByCategoryAndId
);

router.get("/", getProducts);
router.get("/:id", getProductById); // keep this LAST

// Admin API → Add product with image
router.post("/add", upload.single("image"), createProduct);

module.exports = router;
