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
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;
const ProductList: React.FC<ProductListProps> = ({
  categories,
  selectedCategoryId,
  searchTerm,
}) => {
  const [pageByCategory, setPageByCategory] = useState<{
    [key: number]: number;
  }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const handleImageClick = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

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
        offerPrice: parseFloat(product.original_price), // original price from products table
      });
      // toast.success("Product added to cart!", {
      //   position: "top-right",
      //   autoClose: 2000,
      //   hideProgressBar: true,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   theme: "colored",
      // });
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
                          src={
                            product.image_url
                              ? `${IMAGE_URL}/${product.image_url}`
                              : ""
                          }
                          alt={product.name}
                          className={styles.productImage}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleImageClick(product)}
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
                                color: "red",
                                fontSize: "1.1rem",
                                fontWeight: "bold", // Bold
                                textAlign: "center", // Center text
                                minWidth: "70px",
                              }}
                            >
                              ₹{product.price_per_unit}
                            </span>
                            <span
                              style={{
                                color: "green",
                                fontWeight: "bold", // Bold
                                fontSize: "1.1rem",
                                textAlign: "center", // Center text
                                minWidth: "70px",
                              }}
                            >
                              ₹{product.original_price}
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
      {modalOpen && selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              minWidth: "320px",
              maxWidth: "90vw",
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                selectedProduct.image_url
                  ? `${IMAGE_URL}/${selectedProduct.image_url}`
                  : ""
              }
              alt={selectedProduct.name}
              style={{
                width: "180px",
                height: "180px",
                objectFit: "contain",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            />
            <h3
              style={{
                margin: "0 0 8px",
                fontWeight: "bold",
                textAlign: "center",
                color: "#FF9900",
              }}
            >
              {selectedProduct.name}
            </h3>
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "12px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#888",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  background: "#ffeaea",
                  padding: "4px 12px",
                  borderRadius: "6px",
                }}
              >
                ₹{selectedProduct.price_per_unit}
              </span>
              <span
                style={{
                  color: "green",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  background: "white",
                  padding: "4px 12px",
                  borderRadius: "6px",
                }}
              >
                ₹{selectedProduct.original_price}
              </span>
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              {getCartCount(selectedProduct.product_id) > 0 ? (
                <span
                  style={{
                    display: "inline-block",
                    color: "#0070f3",
                    fontWeight: "bold",
                    background: "#e6f0fa",
                    borderRadius: "4px",
                    padding: "10px 24px",
                    fontSize: "16px",
                  }}
                >
                  Added
                </span>
              ) : (
                <button
                  style={{
                    background: "#22c55e",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 24px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    handleCloseModal();
                  }}
                  disabled={loadingProductId === selectedProduct.product_id}
                >
                  {loadingProductId === selectedProduct.product_id
                    ? "Adding..."
                    : "Add to Cart"}
                </button>
              )}
              <button
                style={{
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 24px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
