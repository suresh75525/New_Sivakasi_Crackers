"use client";

import HeaderFive from "@/components/header/HeaderFive";
import { useState, useEffect, Suspense } from "react";
import ShopMain from "./ShopMain";
import ShopMainList from "./ShopMainList";
// // import FooterOne from "@/components/footer/FooterOne";
// import FooterOne from "../../components/fo";
import { useSearchParams } from "next/navigation";
import {
  getCategories,
  getProducts,
} from "../../../components/services/apiServices";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryId = Number(searchParams.get("category"));

  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [respProducts, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data: any = await getCategories();
        const formattedData = data.map((item: any) => ({
          id: item.category_id,
          label: item.name,
          icon: `/assets/images/category/${item.image}`,
          count: item.items,
        }));
        setCategories(formattedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const filterProducts = data
          .filter((post: any) =>
            categoryId ? post.category_id === categoryId : true
          )
          .map((postdata: any) => ({
            product_id: postdata.product_id,
            name: postdata.name,
            image: postdata.image_url,
            productTitle: postdata.name,
            price: postdata.price_per_unit,
            originalPrice: postdata.original_price,
          }));
        setProducts(filterProducts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="shop-page">
      {/* Breadcrumb */}
      <div className="rts-navigation-area-breadcrumb bg_light-1">
        <div className="container">
          <a href="/">Home</a> &gt; <span>Shop</span>
        </div>
      </div>

      <div className="shop-grid-sidebar-area rts-section-gap">
        <div className="container">
          <div className="row g-0">
            {/* Sidebar */}
            <div className="col-xl-3 col-lg-12">
              <div className="sidebar-filter-main">
                <h5 className="title">Product Categories</h5>
                <div className="category-wrapper">
                  {categories.map((cat: any) => (
                    <div key={cat.id}>
                      <input
                        id={`cat${cat.id}`}
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryChange(cat.id)}
                      />
                      <label htmlFor={`cat${cat.id}`}>{cat.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-xl-9 col-lg-12">
              {activeTab === "tab1" ? (
                <div className="row g-4">
                  {respProducts.length > 0 ? (
                    respProducts.map((post) => (
                      <div key={post.product_id} className="col-lg-4 col-md-6">
                        <ShopMain
                          Slug={post.name}
                          ProductImage={post.image}
                          ProductTitle={post.productTitle}
                          Price={post.price}
                        />
                      </div>
                    ))
                  ) : (
                    <p>No Product Found</p>
                  )}
                </div>
              ) : (
                <div className="row">
                  {respProducts.length > 0 ? (
                    respProducts.map((post) => (
                      <div key={post.product_id} className="col-lg-6">
                        <ShopMainList
                          Slug={post.name}
                          ProductImage={post.image}
                          ProductTitle={post.productTitle}
                          Price={post.price}
                        />
                      </div>
                    ))
                  ) : (
                    <p>No Product Found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* <HeaderFive />
      <Suspense fallback={<div>Loading products...</div>}>
        <ShopContent />
      </Suspense> */}
      {/* <FooterOne /> */}
    </>
  );
}
