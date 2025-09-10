"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  updateCartQuantity as updateCartQuantityApi,
  removeProductFromCart,
} from "@/components/services/apiServices";

type CartItem = {
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
  active: boolean;
  offerPrice: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateItemQuantity: (
    id: number,
    quantity: number,
    method: "add" | "subtract"
  ) => Promise<void>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("cart_items");
      if (stored) setCartItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cart_items", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, active: true }];
    });
  };

  const removeFromCart = async (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    try {
      const msg = await removeProductFromCart(id);
      // Optionally, show a toast or log the message
      console.log(msg);
    } catch (err) {
      console.error(err);
    }
  };

  // Add this function
  const updateItemQuantity = async (
    id: number,
    quantity: number,
    method: "add" | "subtract"
  ) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    // Call backend API to update cart quantity
    try {
      const msg = await updateCartQuantityApi(id, Math.abs(quantity), method);
      // Optionally, you can show a toast or log the message
      console.log(msg);
    } catch (err) {
      // Handle error if needed
      console.error(err);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
