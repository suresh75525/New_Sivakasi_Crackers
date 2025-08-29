const express = require("express");
const router = express.Router();
const {
  addToCart,
  viewCart,
  removeProductFromCart,
  updateCartQuantity,
} = require("../controllers/cartController");

router.post("/addToCart", addToCart); // Add to cart
router.get("/viewCart", viewCart); // View cart
router.post("/guest/remove", removeProductFromCart); // Remove item
router.post("/guest/update", updateCartQuantity); // update
// router.post("/guest/map-to-user", mapGuestCartToUser);

module.exports = router;
