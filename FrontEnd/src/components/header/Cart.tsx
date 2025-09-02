"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "./CartContext";

const CartDropdown: React.FC = () => {
  const { cartItems } = useCart();

  return (
    <Link href="/cart">
      <div
        className="btn-border-only cart category-hover-header"
        style={{ cursor: "pointer" }}
      >
        <i className="fa-sharp fa-regular fa-cart-shopping" />
        <span className="text">Cart</span>
        <span className="number">{cartItems.length}</span>
      </div>
    </Link>
  );
};

export default CartDropdown;
