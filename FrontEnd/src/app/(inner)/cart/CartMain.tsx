"use client";
import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import { useCart } from "@/components/header/CartContext";
import styles from "./CartMain.module.css";
import Link from "next/link";
import Button from "@mui/material/Button";
import { removeProductFromCart } from "@/components/services/apiServices";

const CartMain = () => {
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();

  const [discount, setDiscount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const MIN_ORDER_AMOUNT = 2000;
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = item.price;
      const quantity = item.quantity || 1;
      return acc + (isNaN(price) ? 0 : price * quantity);
    }, 0);
    setSubtotal(total);
  }, [cartItems]);

  const clearCart = async () => {
    setDiscount(0);
    try {
      const msg = await removeProductFromCart("all");
      // Optionally, show a toast or log the message
      console.log(msg);
    } catch (err) {
      console.error(err);
    }
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
      <div
        className="rts-cart-area rts-section-gap bg_light-1"
        style={{ paddingTop: "60px" }}
      >
        <div className="container">
          {/* Breadcrumb */}
          <div className="row g-5">
            {/* Cart Table - always first */}
            <div className="col-xl-9 col-12 order-2 order-xl-1">
              <TableContainer
                component={Paper}
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  maxHeight: 420, // Adjust height for 4 rows (about 80px per row)
                  overflowY: "auto",
                }}
              >
                <Table sx={{ minWidth: 500 }} aria-label="cart table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                          fontWeight: 700,
                          color: "#fff",
                          background: "#FF9900",
                          fontSize: 15,
                        }}
                      >
                        Products
                      </TableCell>
                      <TableCell
                        sx={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                          fontWeight: 700,
                          color: "#fff",
                          background: "#FF9900",
                          fontSize: 12,
                        }}
                        align="center"
                      >
                        Price (Rs.)
                      </TableCell>
                      <TableCell
                        sx={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                          fontWeight: 700,
                          color: "#fff",
                          background: "#FF9900",
                          fontSize: 12,
                        }}
                        align="center"
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        sx={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                          fontWeight: 700,
                          color: "#fff",
                          background: "#FF9900",
                          fontSize: 12,
                        }}
                        align="center"
                      >
                        SubTotal (Rs.)
                      </TableCell>
                      <TableCell
                        sx={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                          fontWeight: 700,
                          color: "#fff",
                          background: "#FF9900",
                          fontSize: 12,
                        }}
                        align="center"
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <TableRow key={item.id}>
                          {/* Products column */}
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <img
                                src={item.image}
                                alt="shop"
                                style={{
                                  width: 50,
                                  height: 50,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                  marginRight: 8,
                                }}
                              />
                              <span
                                style={{
                                  color: "#222",
                                  fontWeight: 1000,
                                  fontSize: 15,
                                }}
                              >
                                {item.title}
                              </span>
                            </Box>
                          </TableCell>
                          {/* Price column */}
                          <TableCell
                            align="center"
                            sx={{ color: "#222", fontSize: 15 }}
                          >
                            {item.price.toFixed(2)}
                          </TableCell>
                          {/* Quantity column */}
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                border: "1px solid #e0e0e0",
                                borderRadius: "6px",
                                overflow: "hidden",
                                background: "#fff",
                              }}
                            >
                              <input
                                type="text"
                                value={item.quantity}
                                readOnly
                                style={{
                                  width: 56,
                                  height: 36,
                                  textAlign: "center",
                                  border: "none",
                                  outline: "none",
                                  fontWeight: 600,
                                  fontSize: 16,
                                  background: "transparent",
                                }}
                              />
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  borderLeft: "1px solid #e0e0e0",
                                  height: 36,
                                  weight: 20,
                                }}
                              >
                                <IconButton
                                  size="large"
                                  sx={{
                                    p: "2px",
                                    borderRadius: 0,
                                    "&:hover": {
                                      backgroundColor: "#22c55e",
                                      color: "#fff",
                                    },
                                  }}
                                  onClick={() =>
                                    updateItemQuantity(
                                      item.id,
                                      item.quantity + 1,
                                      "add"
                                    )
                                  }
                                >
                                  <i className="fa-regular fa-chevron-up" />
                                </IconButton>
                                <IconButton
                                  size="large"
                                  sx={{
                                    p: "2px",
                                    borderRadius: 0,
                                    "&:hover": {
                                      backgroundColor: "red",
                                      color: "#fff",
                                    },
                                  }}
                                  onClick={() =>
                                    item.quantity > 1 &&
                                    updateItemQuantity(
                                      item.id,
                                      item.quantity - 1,
                                      "subtract"
                                    )
                                  }
                                >
                                  <i className="fa-regular fa-chevron-down" />
                                </IconButton>
                              </Box>
                            </Box>
                          </TableCell>
                          {/* Subtotal column */}
                          <TableCell
                            align="center"
                            sx={{ color: "#222", fontSize: 15 }}
                          >
                            {(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                          {/* Remove button column (for mobile accessibility) */}
                          <TableCell align="center">
                            <IconButton
                              onClick={() => removeFromCart(item.id)}
                              size="medium"
                              color="error"
                            >
                              <i className="fa-regular fa-trash" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <img
                            src="/emptyCart.png"
                            alt="Empty Cart"
                            style={{
                              width: "220px",
                              maxWidth: "100%",
                              margin: "0 auto",
                              display: "block",
                            }}
                          />
                          <div style={{ color: "#888", marginTop: 12 }}>
                            Your cart is empty.
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  mt: 3,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 0,
                }}
              >
                <Button
                  onClick={clearCart}
                  variant="contained"
                  color="error"
                  disabled={cartItems.length === 0}
                  sx={{
                    width: 140, // ensures enough width for background
                    px: 2,
                    py: 1,
                    fontSize: { xs: 13, sm: 15 },
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Clear All
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => (window.location.href = "/")}
                  sx={{
                    width: 170,
                    px: 2,
                    py: 1,
                    fontSize: { xs: 13, sm: 15 },
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Continue to Shopping
                </Button>
              </Box>
            </div>

            {/* Cart Totals - always second */}
            <div
              className="col-xl-3 col-12 order-1 order-xl-2"
              style={{
                position: "relative",
                zIndex: 1,
              }}
            >
              {totalAfterDiscount > 0 &&
                totalAfterDiscount < MIN_ORDER_AMOUNT && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={600} fontSize={14}>
                      Minimum Order is at least Rs. {MIN_ORDER_AMOUNT}
                    </Typography>
                  </Alert>
                )}
              <div
                className="cart-total-area-start-right"
                style={{
                  position: "sticky",
                  top: 24, // keeps it visible when scrolling
                  background: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  padding: "16px",
                  marginTop: 0,
                  minWidth: 260,
                  maxWidth: 350,
                }}
              >
                <h5
                  className="title"
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    fontSize: "30px",
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
                      disabled={
                        subtotal < MIN_ORDER_AMOUNT ||
                        subtotal <= 0 ||
                        loadingCheckout
                      }
                      onClick={() => {
                        if (subtotal < MIN_ORDER_AMOUNT) {
                          alert(
                            `Minimum order amount is Rs. ${MIN_ORDER_AMOUNT}. Please add more products to proceed.`
                          );
                          return;
                        }
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
