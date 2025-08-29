"use client";
import HeaderFive from "@/components/header/HeaderFive";
import { useState, useEffect, Suspense } from "react";
import ShopMain from "./ShopMain";
import ShopMainList from "./ShopMainList";
import Product from "@/data/Product.json";
import FooterOne from "@/components/footer/FooterOne";
import { useSearchParams } from "next/navigation";
import { getCategories,getProducts } from "../../../components/services/apiServices";



function ShopContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const categoryId = Number(searchParams.get("category"));
  const [activeTab, setActiveTab] = useState<string>("tab1");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(150);
  const [respProducts, setProducts] = useState([]);
  console.log(categoryId);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    // define async fn inside useEffect
    const fetchData = async () => {
      try {
        const data: any = await getCategories();
        const formattedData = data.map((item) => ({
          id: item.category_id,
          label: item.name,
          icon: `/assets/images/category/${item.image}`,
          count: item.items, // you can map icons by category if you have them
        }));
        setCategories(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // call it
  },[]);
  useEffect(() => {
    // define async fn inside useEffect
    const fetchProdData = async () => {
      try {
        const data = await getProducts();
        const filterProducts = data
        .filter((post) => post.category_id === categoryId)
        .map((postdata) => {
          return {
            name: postdata.name,
            image: postdata.image_url,
            productTitle: postdata.name,
            price: postdata.price_per_unit
          };
        });
        setProducts(filterProducts)
      } catch (error) {
        console.error(error);
      }
    };
    fetchProdData(); // call it
  },[]);
  
  const handleCategoryChange = (category: string) => {
    console.log(category,"id");
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  console.log(respProducts,"-----------------------------products");
 
  return (
    <div className="shop-page">
      {/* Breadcrumb */}
      <div className="rts-navigation-area-breadcrumb bg_light-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigator-breadcrumb-wrapper">
                <a href="/">Home</a>
                <i className="fa-regular fa-chevron-right" />
                <a className="current" href="#">
                  Shop
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-seperator bg_light-1">
        <div className="container">
          <hr className="section-seperator" />
        </div>
      </div>

      <div className="shop-grid-sidebar-area rts-section-gap">
        <div className="container">
          <div className="row g-0">
            {/* Sidebar */}
            <div className="col-xl-3 col-lg-12 pr--70 pr_lg--10 pr_sm--10 pr_md--5 rts-sticky-column-item">
              <div className="sidebar-filter-main theiaStickySidebar">
                {/* Categories */}
                <div className="single-filter-box">
                  <h5 className="title">Product Categories</h5>
                  <div className="filterbox-body">
                    <div className="category-wrapper ">
                      {categories.map((cat, i) => (
                        <div className="single-category" key={cat.id}>
                          <input
                            id={`cat${cat.id}`}
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id)} // store id instead of full object
                            onChange={() => handleCategoryChange(cat.id)}
                          />
                          <label htmlFor={`cat${cat.id}`}>{cat.label}</label>
                          {/* <span className="ml-2 text-gray-500">({cat.count})</span> */}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-xl-9 col-lg-12">
              <div className="filter-select-area">
                <div className="top-filter">
                  <span>Showing  results</span>
                  <div className="right-end">
                    <span>Sort: Short By Latest</span>
                    <div className="button-tab-area">
                      <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                          <button
                            // onClick={() => setActiveTab("tab1")}
                            className={`nav-link single-button ${
                              activeTab === "tab1" ? "active" : ""
                            }`}
                          >
                            <svg
                              width={16}
                              height={16}
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <rect
                                x="0.5"
                                y="0.5"
                                width={6}
                                height={6}
                                rx="1.5"
                                stroke="#2C3B28"
                              />
                              <rect
                                x="0.5"
                                y="9.5"
                                width={6}
                                height={6}
                                rx="1.5"
                                stroke="#2C3B28"
                              />
                              <rect
                                x="9.5"
                                y="0.5"
                                width={6}
                                height={6}
                                rx="1.5"
                                stroke="#2C3B28"
                              />
                              <rect
                                x="9.5"
                                y="9.5"
                                width={6}
                                height={6}
                                rx="1.5"
                                stroke="#2C3B28"
                              />
                            </svg>
                          </button>
                        </li>
                        <li className="nav-item" role="presentation">
                          <button
                            // onClick={() => setActiveTab("tab2")}
                            className={`nav-link single-button ${
                              activeTab === "tab2" ? "active" : ""
                            }`}
                          >
                            <svg
                              width={16}
                              height={16}
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <rect
                                x="0.5"
                                y="0.5"
                                width={6}
                                height={6}
                                rx="1.5"
                                stroke="#2C3C28"
                              />
                              <rect
                                x="0.5"
                                y="9.5"
                                width={6}
                                height={6}
                                rx="1.5"
                                stroke="#2C3C28"
                              />
                              <rect
                                x={9}
                                y={3}
                                width={7}
                                height={1}
                                fill="#2C3C28"
                              />
                              <rect
                                x={9}
                                y={12}
                                width={7}
                                height={1}
                                fill="#2C3C28"
                              />
                            </svg>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid or List view */}
              <div className="tab-content" id="myTabContent">
                <div className="product-area-wrapper-shopgrid-list mt--20 tab-pane fade show active">
                  {activeTab === "tab1" && (
                    <div className="row g-4">
                   
                      {respProducts.length > 0 ? (
                        respProducts
                        .map(
                          (post) => (
                            
                            <div
                              key={post.product_id}
                              className="col-lg-20 col-lg-4 col-md-6 col-sm-6 col-12"
                            >
                              <div className="single-shopping-card-one">
                                <ShopMain
                                  Slug={post.name}
                                  ProductImage={post.image}
                                  ProductTitle={post.productTitle}
                                  Price={post.price}
                                />
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className="col-12 text-center py-5">
                          <h2>No Product Found</h2>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="product-area-wrapper-shopgrid-list with-list mt--20">
                  {activeTab === "tab2" && (
                    <div className="row">
                      {respProducts.length > 0 ? (
                        respProducts
                        .map(
                          (post) => (
                            <div key={post.product_id} className="col-lg-6">
                              <div className="single-shopping-card-one discount-offer">
                                <ShopMainList
                                  Slug={post.name}
                                  ProductImage={post.image}
                                  ProductTitle={post.productTitle}
                                  Price={post.price}
                                />
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className="col-12 text-center py-5">
                          <h2>No Product Found</h2>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
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
      <HeaderFive />
      <Suspense
        fallback={
          <div className="text-center py-20">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading products...</p>
          </div>
        }
      >
        <ShopContent />
      </Suspense>
      <FooterOne />
    </>
  );
}
