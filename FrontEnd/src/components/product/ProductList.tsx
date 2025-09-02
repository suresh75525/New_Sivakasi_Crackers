"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./ProductList.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart as addToCartApi } from "@/components/services/apiServices";
import { useCart } from "@/components/header/CartContext";

type Product = {
  product_id: number;
  category_id: number;
  name: string;
  description?: string | null;
  price_per_unit: string;
  original_price: string;
  image_url?: string;
  is_available: number;
  gst_percentage: string;
  category_name: string;
};

type Category = {
  category_id: number;
  category_name: string;
  total_products: number;
  products: Product[];
};

interface ProductListProps {
  categories: Category[];
  selectedCategoryId?: number | null;
  searchTerm: string;
}

const PRODUCTS_PER_PAGE = 5;

const ProductList: React.FC<ProductListProps> = ({
  categories,
  selectedCategoryId,
  searchTerm,
}) => {
  const [pageByCategory, setPageByCategory] = useState<{
    [key: number]: number;
  }>({});
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);
  const categoryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  useEffect(() => {
    if (selectedCategoryId && categoryRefs.current[selectedCategoryId]) {
      categoryRefs.current[selectedCategoryId]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedCategoryId]);
  const { addToCart, cartItems } = useCart();

  const handlePageChange = (categoryId: number, newPage: number) => {
    setPageByCategory((prev) => ({
      ...prev,
      [categoryId]: newPage,
    }));
  };

  let filteredCategories: Category[] = categories;

  if (selectedCategoryId) {
    filteredCategories = categories.filter(
      (cat) => cat.category_id === selectedCategoryId
    );
  } else if (searchTerm.trim()) {
    const lower = searchTerm.toLowerCase();
    filteredCategories = categories
      .map((cat) => ({
        ...cat,
        products: cat.products.filter((p) =>
          p.name.toLowerCase().includes(lower)
        ),
        total_products: cat.products.filter((p) =>
          p.name.toLowerCase().includes(lower)
        ).length,
      }))
      .filter((cat) => cat.products.length > 0);
  }

  // Get cart count for a product
  const getCartCount = (productId: number) => {
    const item = cartItems.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = async (product: Product) => {
    setLoadingProductId(product.product_id);
    try {
      await addToCartApi(product.product_id, 1);
      addToCart({
        id: product.product_id,
        title: product.name,
        image: product.image_url || "",
        price: parseFloat(product.price_per_unit),
        quantity: 1,
        active: true,
      });
      toast.success("Product added to cart!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (error) {
      toast.error("Failed to add to cart.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <div>
      <ToastContainer />
      {filteredCategories.length === 0 ? (
        <p style={{ padding: "20px", textAlign: "center" }}>
          No products found.
        </p>
      ) : (
        filteredCategories.map((category) => {
          const page = pageByCategory[category.category_id] || 1;
          const startIdx = (page - 1) * PRODUCTS_PER_PAGE;
          const endIdx = startIdx + PRODUCTS_PER_PAGE;
          const paginatedProducts = category.products.slice(startIdx, endIdx);
          console.log("paginatedProducts", paginatedProducts);
          const totalPages = Math.ceil(
            category.total_products / PRODUCTS_PER_PAGE
          );

          return (
            <div
              key={category.category_id}
              className={styles.categoryContainer}
              ref={(el) => {
                categoryRefs.current[category.category_id] = el;
              }}
            >
              <div className={styles.categoryHeader}>
                <span className={styles.categoryTitle}>
                  {category.category_name}
                </span>
                <span className={styles.pageInfo}>
                  Page <span className={styles.pageHighlight}>{page}</span> of{" "}
                  <span className={styles.pageHighlight}>{totalPages}</span>
                </span>
              </div>

              <div className={styles.paginationWrap}>
                <button
                  className={styles.arrowBtn}
                  disabled={page === 1}
                  onClick={() =>
                    handlePageChange(category.category_id, page - 1)
                  }
                  aria-label="Previous Page"
                >
                  &lt;
                </button>

                <div className={styles.productCarousel}>
                  {paginatedProducts.map((product) => {
                    const inCart = getCartCount(product.product_id) > 0;
                    return (
                      <div
                        key={product.product_id}
                        className={styles.productCard}
                      >
                        {inCart && (
                          <span className={styles.cartTickBadge}>
                            <i
                              className="fa fa-check-circle"
                              style={{ color: "#22c55e", fontSize: "1.7rem" }}
                            />
                          </span>
                        )}

                        <img
                          src={product.image_url}
                          alt={product.name}
                          className={styles.productImage}
                        />

                        <div className={styles.productDetails}>
                          <div
                            className={styles.productName}
                            title={product.name}
                            style={{ fontWeight: "bold" }}
                          >
                            {product.name.length > 30
                              ? product.name.slice(0, 27) + "..."
                              : product.name}
                          </div>

                          {/* Price row: old price (strike) and offer price on same line */}
                          <div
                            className={styles.productPrice}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center", // Center horizontally
                              gap: "0px",
                              fontWeight: "bold", // Make both spans bold
                              width: "100%",
                            }}
                          >
                            <span
                              style={{
                                textDecoration: "line-through",
                                color: "#888",
                                fontSize: "1.1rem",
                                fontWeight: "bold", // Bold
                                textAlign: "center", // Center text
                                minWidth: "70px",
                              }}
                            >
                              ₹{product.original_price}
                            </span>
                            <span
                              style={{
                                color: "#e53935",
                                fontWeight: "bold", // Bold
                                fontSize: "1.1rem",
                                textAlign: "center", // Center text
                                minWidth: "70px",
                              }}
                            >
                              ₹{product.price_per_unit}
                            </span>
                          </div>
                          {product.is_available ? (
                            <span
                              className={`${styles.badge} ${styles.bestSeller}`}
                            >
                              In Stock
                            </span>
                          ) : (
                            <span
                              className={`${styles.badge} ${styles.outStock}`}
                            >
                              Out of Stock
                            </span>
                          )}

                          {!inCart ? (
                            <button
                              className={styles.addCartBtn}
                              onClick={() => handleAddToCart(product)}
                              disabled={loadingProductId === product.product_id}
                            >
                              {loadingProductId === product.product_id
                                ? "Adding..."
                                : "Add to Cart"}
                            </button>
                          ) : (
                            <div>
                              <span
                                style={{
                                  display: "inline-block",
                                  color: "#0070f3",
                                  fontWeight: "bold",
                                  background: "#e6f0fa",
                                  borderRadius: "4px",
                                  padding: "6px 16px",
                                  marginTop: "10px",
                                  marginBottom: "6px",
                                  fontSize: "15px",
                                }}
                              >
                                Added
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  className={styles.arrowBtn}
                  disabled={page === totalPages}
                  onClick={() =>
                    handlePageChange(category.category_id, page + 1)
                  }
                  aria-label="Next Page"
                >
                  &gt;
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ProductList;
