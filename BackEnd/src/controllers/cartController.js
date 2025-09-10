const GuestCart = require("../models/GuestCart");
const Product = require("../models/Product");
const User = require("../models/User");

// Add item to guest cart
exports.addToCart = async (req, res) => {
  try {
    const { session_id, product_id, quantity } = req.body;

    if (!session_id || !product_id || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // 1️⃣ Fetch product details
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2️⃣ Calculate GST amount & total price
    const price = parseFloat(product.price_per_unit);
    const gstPercentage = parseFloat(product.gst_percentage) || 0;

    const gstAmount = (price * quantity * gstPercentage) / 100;
    const totalPrice = price * quantity + gstAmount;

    // 3️⃣ Check if product already exists in guest cart for this session
    const existingCartItem = await GuestCart.findOne({
      where: { session_id, product_id },
    });

    if (existingCartItem) {
      // Update quantity, GST, and total
      const newQuantity = existingCartItem.quantity + quantity;
      const newGstAmount = (price * newQuantity * gstPercentage) / 100;
      const newTotalPrice = price * newQuantity + newGstAmount;

      existingCartItem.quantity = newQuantity;
      existingCartItem.gst_amount = newGstAmount.toFixed(2);
      existingCartItem.total_price = newTotalPrice.toFixed(2);

      await existingCartItem.save();
      return res.json({ message: "Cart updated successfully" });
    }

    // 4️⃣ Create new cart item
    await GuestCart.create({
      session_id,
      product_id,
      quantity,
      total_price: totalPrice.toFixed(2),
      gst_amount: gstAmount.toFixed(2),
    });

    return res.json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("❌ Error in addToCart:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// // Get guest cart items
// exports.getCart = async (req, res) => {
//   try {
//     const { session_id } = req.query;
//     if (!session_id) return res.status(400).json({ message: 'session_id required' });

//     const cart = await GuestCart.findAll({
//       where: { session_id },
//       include: [{ model: Product }]
//     });

//     return res.json(cart);
//   } catch (error) {
//     console.error('❌ Error in getCart:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// Remove item from guest cart
// controllers/cartController.js

// controllers/cartController.js

exports.removeProductFromCart = async (req, res) => {
  try {
    const { session_id, product_id } = req.body;

    if (!session_id || !product_id) {
      return res
        .status(400)
        .json({ message: "session_id and product_id are required" });
    }

    if (product_id === "all") {
      // Remove all products from the cart for this session
      await GuestCart.destroy({ where: { session_id } });
      return res.json({ message: "All products removed from cart" });
    }

    // Remove a single product from the cart
    const cartItem = await GuestCart.findOne({
      where: { session_id, product_id },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cartItem.destroy();
    return res.json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("❌ Error in removeProductFromCart:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// controllers/cartController.js

exports.updateCartQuantity = async (req, res) => {
  try {
    const { session_id, product_id, quantity, method } = req.body;

    if (
      !session_id ||
      !product_id ||
      !quantity ||
      !["add", "subtract"].includes(method)
    ) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // 1️⃣ Fetch cart item
    const cartItem = await GuestCart.findOne({
      where: { session_id, product_id },
    });
    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // 2️⃣ Fetch product details
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price = parseFloat(product.price_per_unit);
    const gstPct = parseFloat(product.gst_percentage) || 0;

    // 3️⃣ Adjust quantity
    let newQuantity = cartItem.quantity;
    if (method === "add") {
      newQuantity += 1;
    } else if (method === "subtract") {
      newQuantity -= 1;
    }

    if (newQuantity <= 0) {
      await cartItem.destroy();
      return res.json({ message: "Product removed from cart" });
    }

    // 4️⃣ Recalculate totals
    const gstAmount = (price * newQuantity * gstPct) / 100;
    const totalPrice = price * newQuantity + gstAmount;

    cartItem.quantity = newQuantity;
    cartItem.gst_amount = gstAmount.toFixed(2);
    cartItem.total_price = totalPrice.toFixed(2);

    await cartItem.save();

    return res.json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("❌ Error in updateCartQuantity:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// exports.mapGuestCartToUser = async (req, res) => {
//   try {
//     const { session_id, mobile, name } = req.body;

//     if (!session_id || !mobile) {
//       return res
//         .status(400)
//         .json({ message: "session_id and mobile are required" });
//     }

//     // 1️⃣ Find or create user
//     let user = await User.findOne({ where: { mobile_number: mobile } });
//     if (!user) {
//       user = await User.create({
//         name: name || "Guest",
//         mobile_number: mobile,
//       });
//     }

//     // 2️⃣ Update guest cart items to link with user_id
//     await GuestCart.update(
//       { user_id: user.user_id },
//       { where: { session_id } }
//     );

//     return res.json({ message: "Cart mapped to user", user });
//   } catch (error) {
//     console.error("❌ Error in mapGuestCartToUser:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// Getcarts
// ✅ Get guest cart with totals
exports.viewCart = async (req, res) => {
  try {
    const { session_id } = req.body; // ✅ Now expecting in request body

    if (!session_id) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    // Fetch cart items with product details
    const cartItems = await GuestCart.findAll({
      where: { session_id },
      include: [
        {
          model: Product,
          attributes: ["name", "price_per_unit", "image_url", "gst_percentage"],
        },
      ],
    });

    if (cartItems.length === 0) {
      return res.json({
        items: [],
        total_gst: 0,
        total_amount: 0,
        offer_price: 0,
      });
    }

    // Calculate totals
    let totalGst = 0;
    let totalAmount = 0;

    const formattedItems = cartItems.map((item) => {
      const gstAmount = parseFloat(item.gst_amount || 0);
      const totalPrice = parseFloat(item.total_price || 0);

      totalGst += gstAmount;
      totalAmount += totalPrice;

      return {
        guest_cart_id: item.guest_cart_id,
        product_id: item.product_id,
        name: item.Product.name,
        image_url: item.Product.image_url,
        price_per_unit: parseFloat(item.Product.price_per_unit),
        gst_percentage: parseFloat(item.Product.gst_percentage),
        quantity: item.quantity,
        gst_amount: gstAmount,
        total_price: totalPrice,
      };
    });

    // 🏷️ Apply 73% discount offer on total
    const offerPrice = (totalAmount * (1 - 0.73)).toFixed(2);

    return res.json({
      items: formattedItems,
      total_gst: totalGst.toFixed(2),
      total_amount: totalAmount.toFixed(2),
      offer_price: offerPrice,
    });
  } catch (error) {
    console.error("❌ Error in viewCart:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
