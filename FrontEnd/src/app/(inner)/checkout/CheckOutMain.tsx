"use client";

import React, { useState } from "react";
import { useCart } from "@/components/header/CartContext";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/components/services/apiServices";
import { removeProductFromCart } from "@/components/services/apiServices";
import "react-toastify/dist/ReactToastify.css";

export default function CheckOutMain() {
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const { cartItems, clearCart } = useCart();
  const session_id =
    typeof window !== "undefined"
      ? localStorage.getItem("session_id") || ""
      : "";

  const router = useRouter();
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    mobile: "",
    address1: "",
    address2: "",
    city: "",
    pincode: "",
    landmark: "",
  });

  const resetBillingInfo = () => {
    setBillingInfo({
      name: "",
      mobile: "",
      address1: "",
      address2: "",
      city: "",
      pincode: "",
      landmark: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate pincode
    const isValid = await validatePincode(billingInfo.pincode);
    if (!isValid) {
      alert("Invalid pincode. Please enter a real Indian pincode.");
      return;
    }

    // 2. Construct payload
    const payload = {
      session_id,
      name: billingInfo.name,
      mobile_number: billingInfo.mobile,
      address_line1: billingInfo.address1,
      address_line2: billingInfo.address2,
      city: billingInfo.city,
      pincode: billingInfo.pincode,
      landmark: billingInfo.landmark,
    };

    try {
      const result = await placeOrder(payload);
      if (result.message === "Order placed successfully") {
        toast.success(result.message);
        sessionStorage.removeItem("session_id");
        localStorage.removeItem("cartItems");
        await removeProductFromCart("all");
        clearCart();
        router.push("/"); // Redirect to home page
        // hrer cartItems
      } else {
        toast.error("Order failed. Please try again.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setBillingInfo({ ...billingInfo, [id]: value });

    if (id === "pincode" && value.length === 6) {
      const valid = await validatePincode(value);
      setIsPincodeValid(valid);
    } else if (id === "pincode") {
      setIsPincodeValid(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountPercent = 0.73;
  const discountAmount = subtotal * discountPercent;
  const totalAfterDiscount = subtotal - discountAmount;

  const isFormReady =
    billingInfo.name &&
    billingInfo.mobile &&
    billingInfo.address1 &&
    billingInfo.city &&
    billingInfo.pincode &&
    isPincodeValid;

  const validatePincode = async (pincode: string) => {
    if (pincode.length !== 6) return false;
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await res.json();
      return data[0].Status === "Success";
    } catch {
      return false;
    }
  };

  return (
    <div
      style={{
        minHeight: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f6ff",
        paddingBottom: "50px",
        paddingTop: "100px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          padding: "25px 23px",
          maxWidth: "480px",
          width: "100%",
        }}
      >
        <h3
          style={{
            fontWeight: "bold",
            color: "#0070f3",
            textAlign: "center",
            letterSpacing: 1,
            marginBottom: "10px",
          }}
        >
          Billing Details
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <TextField
              id="name"
              label="Name"
              value={billingInfo.name}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
              size="medium"
              InputProps={{
                sx: { height: 36 },
              }}
              InputLabelProps={{
                sx: { fontSize: "1.15rem", fontWeight: "bold" },
              }}
            />
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <TextField
                id="mobile"
                label="Mobile Number"
                value={billingInfo.mobile}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
                type="tel"
                inputProps={{ maxLength: 10 }}
                size="medium"
                InputProps={{
                  sx: { height: 36 },
                }}
                InputLabelProps={{
                  sx: { fontSize: "1.15rem", fontWeight: "bold" },
                }}
              />
            </div>
            <div className="col-6 mb-3">
              <TextField
                id="address1"
                label="Address 1"
                value={billingInfo.address1}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
                InputProps={{
                  sx: { height: 36 },
                }}
                InputLabelProps={{
                  sx: { fontSize: "1.15rem", fontWeight: "bold" },
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <TextField
                id="address2"
                label="Address 2"
                value={billingInfo.address2}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputProps={{
                  sx: { height: 36 },
                }}
                InputLabelProps={{
                  sx: { fontSize: "1.15rem", fontWeight: "bold" },
                }}
              />
            </div>
            <div className="col-6 mb-3">
              <TextField
                id="city"
                label="City"
                value={billingInfo.city}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
                InputProps={{
                  sx: { height: 36 },
                }}
                InputLabelProps={{
                  sx: { fontSize: "1.15rem", fontWeight: "bold" },
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <TextField
                id="pincode"
                label="Pincode"
                value={billingInfo.pincode}
                onChange={handleInputChange}
                required
                fullWidth
                margin="normal"
                InputProps={{
                  sx: { height: 36 },
                }}
                InputLabelProps={{
                  sx: { fontSize: "1.15rem", fontWeight: "bold" },
                }}
              />
            </div>
            <div className="col-6 mb-3">
              <TextField
                id="landmark"
                label="Landmark"
                value={billingInfo.landmark}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputProps={{
                  sx: { height: 36 },
                }}
                InputLabelProps={{
                  sx: { fontSize: "1.15rem", fontWeight: "bold" },
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
                color: "#0070f3",
                fontSize: "18px",
              }}
            >
              Total (₹): {totalAfterDiscount.toFixed(2)}
            </span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                type="submit"
                className="rts-btn btn-primary"
                style={{
                  minWidth: 160,
                  fontWeight: "bold",
                  position: "relative",
                  cursor: !isFormReady ? "not-allowed" : "pointer",
                }}
                disabled={!isFormReady}
                onMouseOver={() => {
                  if (!isFormReady) {
                    const warning = document.getElementById("warning-icon");
                    if (warning) warning.style.visibility = "visible";
                  }
                }}
                onMouseOut={() => {
                  const warning = document.getElementById("warning-icon");
                  if (warning) warning.style.visibility = "hidden";
                }}
              >
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" />
      {orderSuccess && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
            padding: "32px 48px",
            zIndex: 9999,
            textAlign: "center",
            color: "#22c55e",
            fontWeight: "bold",
            fontSize: "1.3rem",
          }}
        >
          Your order has successfully placed.
        </div>
      )}
    </div>
  );
}
