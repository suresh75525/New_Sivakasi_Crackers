"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/components/header/CartContext";
import styles from "./CartMain.module.css";

const CartMain = () => {
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
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

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon === "12345") {
      setDiscount(0.25);
      setCouponMessage("Coupon applied -25% successfully");
      localStorage.setItem("coupon", coupon);
      localStorage.setItem("discount", "0.25");
    } else {
      setDiscount(0);
      setCouponMessage("Coupon code is incorrect");
      localStorage.removeItem("coupon");
      localStorage.removeItem("discount");
    }
  };

  const clearCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("coupon");
      localStorage.removeItem("discount");
    }
    setCoupon("");
    setDiscount(0);
    setCouponMessage("");
    cartItems.forEach((item) => removeFromCart(item.id));
  };

  const finalTotal = subtotal - subtotal * discount;
  const discountPercent = 0.73;
  const discountAmount = subtotal * discountPercent;
  const totalAfterDiscount = subtotal - discountAmount;

  return (
    <div className="rts-cart-area rts-section-gap bg_light-1">
      <div className="container">
        <div className="row g-5">
          {/* Cart Items */}
          <div className="col-xl-9 col-12 order-2 order-xl-1">
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
                  <p style={{ color: "white", fontWeight: "bold" }}>Products</p>
                </div>
                <div className="price">
                  <p style={{ color: "white", fontWeight: "bold" }}>
                    Price (Rs.)
                  </p>
                </div>
                <div className="quantity">
                  <p style={{ color: "white", fontWeight: "bold" }}>Quantity</p>
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
                  >
                    <div className="product-main-cart">
                      <div
                        className="close section-activation"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="fa-regular fa-x" />
                      </div>
                      <div className="thumbnail">
                        <img src={item.image} alt="shop" />
                      </div>
                      <div className="information">
                        <h6 className="title" style={{ color: "black" }}>
                          {item.title}
                        </h6>
                      </div>
                    </div>
                    <div className="price">
                      <p style={{ color: "black" }}>{item.price.toFixed(2)}</p>
                    </div>
                    <div className="quantity">
                      <div className="quantity-edit">
                        <input
                          type="text"
                          className="input"
                          value={item.quantity}
                          readOnly
                        />
                        <div className="button-wrapper-action">
                          <button
                            className="button minus"
                            onClick={() =>
                              item.quantity > 1 &&
                              updateItemQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <i className="fa-regular fa-chevron-down" />
                          </button>
                          <button
                            className="button plus"
                            onClick={() =>
                              updateItemQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <i className="fa-regular fa-chevron-up" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="subtotal">
                      <p style={{ color: "black", textAlign: "right" }}>
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "24px",
                    width: "100%",
                  }}
                >
                  <div>
                    <button
                      onClick={clearCart}
                      className="rts-btn btn-primary mr--50"
                      disabled={cartItems.length === 0}
                      style={{ minWidth: "140px" }}
                    >
                      Clear All
                    </button>
                  </div>

                  <div style={{ marginLeft: "auto" }}>
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

          {/* Summary Area */}
          <div className="col-xl-3 col-12 order-1 order-xl-2">
            <div className="cart-total-area-start-right">
              <h5
                className="title"
                style={{ color: "green", fontWeight: "bold", fontSize: "20px" }}
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
                    disabled={subtotal <= 0 || loadingCheckout} // disable if cart empty or already loading
                    onClick={() => {
                      setLoadingCheckout(true);
                      setTimeout(() => {
                        window.location.href = "/checkout";
                      }, 1200); // simulate delay to show loader
                    }}
                  >
                    {loadingCheckout ? (
                      <>
                        <i className="fa fa-spinner fa-spin" style={{ marginRight: "8px" }} />
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
  );
};

export default CartMain;
