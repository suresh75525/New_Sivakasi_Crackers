"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "./CartContext";

const CartDropdown: React.FC<{ showLabel?: boolean }> = ({
  showLabel = true,
}) => {
  const { cartItems } = useCart();

  return (
    <Link href="/cart">
      <div
        className="btn-border-only cart category-hover-header"
        style={{
          cursor: "pointer",
          background: "#b7d7a8", // light green
          borderRadius: "8px",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          position: "relative",
          minWidth: showLabel ? "100px" : "48px",
        }}
      >
        {/* Badge */}
        <span
          style={{
            position: "absolute",
            top: "-10px",
            left: showLabel ? "18px" : "8px",
            background: "#5c9f2e",
            color: "#fff",
            borderRadius: "50%",
            padding: "2px 10px",
            fontWeight: "bold",
            fontSize: "15px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            border: "2px solid #fff",
            zIndex: 2,
          }}
        >
          {cartItems.length}
        </span>
        <i
          className="fa-sharp fa-regular fa-cart-shopping"
          style={{
            fontSize: "22px",
            color: "#7a8a7a",
            marginRight: showLabel ? "8px" : "0",
          }}
        />
        {showLabel && (
          <span
            style={{
              color: "black",
              fontWeight: "bold",
              fontSize: "17px",
            }}
          >
            Cart
          </span>
        )}
      </div>
    </Link>
  );
};

export default CartDropdown;
