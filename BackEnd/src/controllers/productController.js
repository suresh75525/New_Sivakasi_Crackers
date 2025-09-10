const Product = require("../models/Product");
const Category = require("../models/Category");
const { Op } = require("sequelize");
const sequelize = require("../config/db");

// Get all categories (enabled only)
exports.getCategories = async (req, res) => {
  try {
    // Get all enabled categories
    const categories = await Category.findAll({
      where: { is_enabled: true },
      order: [["name", "ASC"]],
      attributes: ["category_id", "name", "is_enabled"],
      raw: true,
    });

    // Get product counts for each category
    const productCounts = await Product.findAll({
      attributes: [
        "category_id",
        [sequelize.fn("COUNT", sequelize.col("product_id")), "product_count"],
      ],
      where: { is_available: true },
      group: ["category_id"],
      raw: true,
    });

    // Map counts to categories
    const countsMap = {};
    productCounts.forEach((row) => {
      countsMap[row.category_id] = parseInt(row.product_count, 10);
    });

    const result = categories.map((cat) => ({
      ...cat,
      product_count: countsMap[cat.category_id] || 0,
    }));

    return res.json(result);
  } catch (error) {
    console.error("❌ Error in getCategories:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all products (optional filters)
exports.getProducts = async (req, res) => {
  try {
    const { category_id, search } = req.query;
    let whereClause = { is_available: true };

    if (category_id) whereClause.category_id = category_id;
    if (search) whereClause.name = { [Op.like]: `%${search}%` };

    const products = await Product.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          attributes: ["category_id", "name"],
        },
      ],
      order: [["product_id", "ASC"]],
      raw: true,
      nest: true,
    });

    // ✅ Group products by category name
    const groupedProducts = products.reduce((acc, product) => {
      const categoryName = product.Category.name;

      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }

      // remove nested Category object and keep category_name
      const { Category, ...prodData } = product;
      acc[categoryName].push({
        ...prodData,
        category_name: categoryName,
      });

      return acc;
    }, {});

    return res.json(groupedProducts);
  } catch (error) {
    console.error("❌ Error in getProducts:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// controllers/productController.js
// In getAllProducts
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: [
        "product_id",
        "category_id",
        "name",
        "description",
        "price_per_unit",
        "original_price", // <-- Add this line
        "image_url",
        "is_available",
        "gst_percentage",
      ],
      order: [["product_id", "ASC"]],
      raw: true,
      nest: true,
    });

    return res.json(products);
  } catch (error) {
    console.error("❌ Error in getAllProducts:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ["name"] }],
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (error) {
    console.error("❌ Error in getProductById:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// searching or sorting
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.category_id); // match router param
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    // ✅ Optional search filter
    const search = req.query.search ? `%${req.query.search.trim()}%` : null;

    // ✅ Sorting
    let sortBy = "p.product_id";
    let sortOrder = "ASC"; // show from oldest to newest

    if (req.query.sort_by === "price") sortBy = "p.price_per_unit";
    if (req.query.sort_by === "name") sortBy = "p.name";
    if (req.query.sort_by === "newest") sortBy = "p.product_id";

    if (
      req.query.sort_order &&
      ["asc", "desc"].includes(req.query.sort_order.toLowerCase())
    ) {
      sortOrder = req.query.sort_order.toUpperCase();
    }

    // ✅ Count query
    const totalQuery = `
      SELECT COUNT(*) AS total
      FROM products p
      WHERE p.category_id = :categoryId AND p.is_available = 1
      ${search ? "AND p.name LIKE :search" : ""}
    `;
    const [countResult] = await sequelize.query(totalQuery, {
      replacements: { categoryId, search },
      type: sequelize.QueryTypes.SELECT,
    });
    const total = countResult.total;

    // ✅ Data query
    // Example for getProductsByCategory
    const productsQuery = `
  SELECT 
    p.product_id,
    p.category_id,
    p.name,
    p.description,
    p.price_per_unit,
    p.original_price, -- <-- Add this line
    p.image_url,
    p.is_available,
    p.gst_percentage,
    c.name AS category_name
  FROM products p
  JOIN categories c ON p.category_id = c.category_id
  WHERE p.category_id = :categoryId AND p.is_available = 1
  ${search ? "AND p.name LIKE :search" : ""}
  ORDER BY ${sortBy} ${sortOrder}
  LIMIT :limit OFFSET :offset
`;
    const products = await sequelize.query(productsQuery, {
      replacements: { categoryId, search, limit, offset },
      type: sequelize.QueryTypes.SELECT,
    });

    res.json({
      category_id: categoryId,
      category_name: products.length > 0 ? products[0].category_name : null,
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error("❌ Error in getProductsByCategory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getHomepageProducts = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.product_id,
        p.category_id,
        p.name,
        p.description,
        p.price_per_unit,
        p.image_url,
        p.is_available,
        p.gst_percentage,
        p.original_price,
        c.name AS category_name
      FROM products p
      JOIN categories c ON p.category_id = c.category_id
      WHERE p.is_available = 1
      ORDER BY p.category_id, p.product_id;
    `;

    const products = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    // Group by category and add total_products, include all products
    const grouped = {};
    products.forEach((prod) => {
      if (!grouped[prod.category_id]) {
        grouped[prod.category_id] = {
          category_id: prod.category_id,
          category_name: prod.category_name,
          total_products: 0,
          products: [],
        };
      }
      grouped[prod.category_id].products.push(prod);
      grouped[prod.category_id].total_products += 1;
    });

    // Do NOT limit products array
    res.json(Object.values(grouped));
  } catch (error) {
    console.error("❌ Error in getHomepageProducts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const {
      query = "",
      category_id = null,
      sort_by = "name",
      sort_order = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    // Allowed sortable columns
    const allowedSort = ["name", "price_per_unit", "created_at"];
    const sortColumn = allowedSort.includes(sort_by) ? sort_by : "name";

    // Build WHERE condition
    let whereCondition = {};
    if (query) {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
      ];
    }
    if (category_id) {
      whereCondition.category_id = category_id;
    }

    // Fetch results
    const { rows: products, count: total } = await Product.findAndCountAll({
      where: whereCondition,
      include: [{ model: Category, attributes: ["category_id", "name"] }],
      limit: parseInt(limit),
      offset,
      order: [[sortColumn, sort_order.toUpperCase()]],
    });

    return res.json({
      page: parseInt(page),
      total_pages: Math.ceil(total / limit),
      total_results: total,
      products,
    });
  } catch (error) {
    console.error("❌ Error in searchProducts:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllProductsByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.category_id);

    const products = await Product.findAll({
      where: { category_id: categoryId, is_available: 1 },
      include: [{ model: Category, attributes: ["name"] }],
      order: [["product_id", "ASC"]],
    });

    res.json({
      category_id: categoryId,
      category_name: products.length > 0 ? products[0].Category.name : null,
      products,
    });
  } catch (error) {
    console.error("❌ Error in getAllProductsByCategory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      category_id,
      name,
      description,
      price_per_unit,
      gst_percentage,
      discount_percentage,
    } = req.body;

    if (!req.file || !req.file.location) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const product = await Product.create({
      category_id,
      name,
      description,
      price_per_unit,
      gst_percentage,
      discount_percentage,
      image_url: req.file.location, // ✅ Save S3 URL
      is_available: 1,
    });

    res.json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("❌ createProduct error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get single product by BOTH category_id and product_id
exports.getProductByCategoryAndId = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.category_id);
    const productId = parseInt(req.params.product_id);

    if (Number.isNaN(categoryId) || Number.isNaN(productId)) {
      return res
        .status(400)
        .json({ message: "Invalid category_id or product_id" });
    }

    const product = await Product.findOne({
      where: {
        product_id: productId,
        category_id: categoryId,
        is_available: true,
      },
      include: [{ model: Category, attributes: ["name"] }],
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found for given category" });
    }

    // Flatten category_name if you prefer
    const response = {
      product_id: product.product_id,
      category_id: product.category_id,
      category_name: product.Category?.name || null,
      name: product.name,
      description: product.description,
      price_per_unit: product.price_per_unit,
      gst_percentage: product.gst_percentage,
      discount_percentage: product.discount_percentage,
      image_url: product.image_url,
      is_available: product.is_available,
    };

    return res.json(response);
  } catch (error) {
    console.error("❌ Error in getProductByCategoryAndId:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
