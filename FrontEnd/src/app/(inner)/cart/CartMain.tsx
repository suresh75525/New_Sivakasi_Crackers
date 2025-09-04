"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/components/header/CartContext";
import styles from "./CartMain.module.css";
import Link from "next/link";

const CartMain = () => {
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();

  const [discount, setDiscount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = item.price;
      const quantity = item.quantity || 1;
      return acc + (isNaN(price) ? 0 : price * quantity);
    }, 0);
    setSubtotal(total);
  }, [cartItems]);

  const clearCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("coupon");
      localStorage.removeItem("discount");
    }
    setDiscount(0);
    cartItems.forEach((item) => removeFromCart(item.id));
  };

  const finalTotal = subtotal - subtotal * discount;
  const discountPercent = 0.73;
  const discountAmount = subtotal * discountPercent;
  const totalAfterDiscount = subtotal - discountAmount;

  return (
    <>
      <style>
        {`
    @media (max-width: 600px) {
      .row.g-5 {
        display: flex !important;
        flex-direction: column !important;
        gap: 24px !important;
      }
      .col-xl-9 {
        order: 1 !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
      }
      .col-xl-3 {
        order: 2 !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
      }
      .col-12 {
        width: 100% !important;
        max-width: 100% !important;
      }
      .${styles.rtsCartListArea} {
        overflow-x: auto !important;
        width: 100% !important;
        padding-bottom: 16px !important;
      }
      .single-cart-area-list.head,
      .single-cart-area-list.main.item-parent {
        min-width: 500px !important;
      }
      .cart-total-area-start-right {
        margin-top: 0 !important;
        padding: 16px !important;
        background: #fff !important;
        border-radius: 8px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }
      .cart-total-area-start-right .title {
        font-size: 1.1rem !important;
      }
      .cart-total-area-start-right .price {
        font-size: 1rem !important;
      }
      .button-area .rts-btn,
      .bottom-cupon-code-cart-area .rts-btn {
        font-size: 1.1rem !important;
        min-width: 100% !important;
        padding: 12px 0 !important;
        margin-bottom: 10px !important;
      }
      .bottom-cupon-code-cart-area {
        flex-direction: column !important;
        gap: 12px !important;
        align-items: stretch !important;
      }
    }
    @media (min-width: 601px) {
      .bottom-cupon-code-cart-area {
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: center !important;
        gap: 0 !important;
      }
      .bottom-cupon-code-cart-area .left-btns {
        display: flex;
        align-items: center;
      }
      .bottom-cupon-code-cart-area .rts-btn {
        min-width: 140px !important;
        font-size: 1rem !important;
        margin-bottom: 0 !important;
      }
    }
  `}
      </style>
      <div className="rts-cart-area rts-section-gap bg_light-1">
        <div className="container">
          {/* Breadcrumb */}
          <div className="row g-5">
            {/* Cart Table - always first */}
            <div className="col-xl-9 col-12 order-2 order-xl-1">
              <div style={{ overflowX: "auto", width: "100%" }}>
                <div className={styles.rtsCartListArea}>
                  <div
                    className="single-cart-area-list head"
                    style={{
                      background: "#FF9900",
                      borderRadius: "8px",
                      padding: "8px 0",
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                    }}
                  >
                    <div className="product-main">
                      <p style={{ color: "white", fontWeight: "bold" }}>
                        Products
                      </p>
                    </div>
                    <div className="price">
                      <p style={{ color: "white", fontWeight: "bold" }}>
                        Price (Rs.)
                      </p>
                    </div>
                    <div className="quantity">
                      <p style={{ color: "white", fontWeight: "bold" }}>
                        Quantity
                      </p>
                    </div>
                    <div className="subtotal">
                      <p style={{ color: "white", fontWeight: "bold" }}>
                        SubTotal (Rs.)
                      </p>
                    </div>
                  </div>

                  {cartItems.length >= 0 ? (
                    cartItems.map((item) => (
                      <div
                        className="single-cart-area-list main item-parent"
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: 500, // ensures horizontal scroll on mobile
                          borderBottom: "1px solid #eee",
                          background: "#fff",
                        }}
                      >
                        {/* Products column */}
                        <div
                          className="product-main-cart"
                          style={{
                            flex: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <div
                            className="close section-activation"
                            onClick={() => removeFromCart(item.id)}
                            style={{ marginRight: 8, cursor: "pointer" }}
                          >
                            <i className="fa-regular fa-x" />
                          </div>
                          <div className="thumbnail" style={{ marginRight: 8 }}>
                            <img
                              src={item.image}
                              alt="shop"
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                          </div>
                          <div className="information">
                            <h6
                              className="title"
                              style={{ color: "black", margin: 0 }}
                            >
                              {item.title}
                            </h6>
                          </div>
                        </div>
                        {/* Price column */}
                        <div
                          className="price"
                          style={{ flex: 1, textAlign: "center" }}
                        >
                          <p style={{ color: "black", margin: 0 }}>
                            {item.price.toFixed(2)}
                          </p>
                        </div>
                        {/* Quantity column */}
                        <div
                          className="quantity"
                          style={{ flex: 1, textAlign: "center" }}
                        >
                          <div
                            className="quantity-edit"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 4,
                            }}
                          >
                            <input
                              type="text"
                              className="input"
                              value={item.quantity}
                              readOnly
                              style={{
                                width: 40,
                                textAlign: "center",
                                marginRight: 4,
                              }}
                            />
                            <div
                              className="button-wrapper-action"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                              }}
                            >
                              <button
                                className="button minus"
                                onClick={() =>
                                  item.quantity > 1 &&
                                  updateItemQuantity(item.id, item.quantity - 1)
                                }
                                style={{ padding: "2px 6px" }}
                              >
                                <i className="fa-regular fa-chevron-down" />
                              </button>
                              <button
                                className="button plus"
                                onClick={() =>
                                  updateItemQuantity(item.id, item.quantity + 1)
                                }
                                style={{ padding: "2px 6px" }}
                              >
                                <i className="fa-regular fa-chevron-up" />
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* Subtotal column */}
                        <div
                          className="subtotal"
                          style={{ flex: 1, textAlign: "center" }}
                        >
                          <p style={{ color: "black", margin: 0 }}>
                            {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <img
                        src="/emptyCart.png"
                        alt="Empty Cart"
                        style={{
                          width: "350px",
                          maxWidth: "100%",
                          margin: "0 auto",
                        }}
                      />
                    </div>
                  )}

                  {/* Coupon + Clear */}
                  <div className="bottom-cupon-code-cart-area">
                    {/* <form onSubmit={applyCoupon}>
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        value={coupon}
                        onChange={e => {
                          setCoupon(e.target.value);
                          setCouponMessage('');
                        }}
                      />
                      <button type="submit" className="rts-btn btn-primary">Apply Coupon</button>
                      {couponMessage && (
                        <p style={{ color: coupon === '12345' ? 'green' : 'red', marginTop: '8px' }}>{couponMessage}</p>
                      )}
                    </form> */}
                    <div
                      className="bottom-cupon-code-cart-area"
                      style={{
                        width: "100%",
                        marginTop: "24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0",
                      }}
                    >
                      <button
                        onClick={clearCart}
                        className="rts-btn btn-primary mr--50"
                        disabled={cartItems.length === 0}
                        style={{ minWidth: "140px" }}
                      >
                        Clear All
                      </button>
                      <button
                        className="rts-btn btn-primary"
                        onClick={() => (window.location.href = "/")}
                        style={{ minWidth: "180px" }}
                      >
                        Continue to Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Cart Totals - always second */}
            <div className="col-xl-3 col-12 order-1 order-xl-2">
              <div className="cart-total-area-start-right">
                <h5
                  className="title"
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  Cart Totals
                </h5>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    padding: "15px 30px",
                  }}
                >
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    Sub Total
                  </span>
                  <h6 className="price" style={{ color: "green", margin: 0 }}>
                    Rs. {subtotal.toFixed(2)}
                  </h6>
                </div>
                <div className="bottom">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                      padding: "15px 30px",
                    }}
                  >
                    <span style={{ color: "black", fontWeight: "bold" }}>
                      Discount (73%)
                    </span>
                    <h6 className="price" style={{ color: "green", margin: 0 }}>
                      Rs. {discountAmount.toFixed(2)}
                    </h6>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                      padding: "15px 30px",
                    }}
                  >
                    <span style={{ color: "black", fontWeight: "bold" }}>
                      Total
                    </span>
                    <h6 className="price" style={{ color: "green", margin: 0 }}>
                      Rs. {totalAfterDiscount.toFixed(2)}
                    </h6>
                  </div>

                  <div className="button-area">
                    <button
                      className="rts-btn btn-primary"
                      style={{ minWidth: "200px" }}
                      disabled={subtotal <= 0 || loadingCheckout}
                      onClick={() => {
                        setLoadingCheckout(true);
                        setTimeout(() => {
                          window.location.href = "/checkout";
                        }, 1200);
                      }}
                    >
                      {loadingCheckout ? (
                        <>
                          <i
                            className="fa fa-spinner fa-spin"
                            style={{ marginRight: "8px" }}
                          />
                          Processing...
                        </>
                      ) : (
                        "Proceed to Checkout"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartMain;
