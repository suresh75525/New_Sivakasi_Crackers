"use client";

import React, { useEffect, useState } from "react";
import HeaderFive from "@/components/header/HeaderFive";
import BannerOne from "@/components/banner/BannerOne";
import FeatureCategory from "@/components/feature/FeatureCategory";
import FooterThree from "@/components/footer/FooterTwo";
import ProductList from "@/components/product/ProductList";
import { getHomepageProducts } from "@/components/services/apiServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Product = {
  product_id: number;
  category_id: number;
  name: string;
  description?: string | null;
  price_per_unit: string;
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

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    getHomepageProducts()
      .then((data) => setCategories(data))
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load products. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="index-bg-gray">
      <HeaderFive
        externalSetSearchTerm={setSearchTerm}
        setSelectedCategoryId={setSelectedCategory}
      />
      <BannerOne />
      <FeatureCategory onCategorySelect={setSelectedCategory} />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loader"></span>
        </div>
      ) : categories.length > 0 ? (
        <ProductList
          categories={categories}
          selectedCategoryId={selectedCategory}
          searchTerm={searchTerm}
        />
      ) : (
        <div className="text-center p-6">No products found.</div>
      )}

      <FooterThree />
      <ToastContainer position="top-right" />
    </div>
  );
}

export default App;
