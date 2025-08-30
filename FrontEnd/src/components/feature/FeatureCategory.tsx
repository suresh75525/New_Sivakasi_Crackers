"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getCategories } from "../services/apiServices";

type Category = {
  id: number;
  label: string;
  count: number;
};

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await getCategories();
        // Format: { category_id, name, product_count }
        const formattedData: Category[] = data.map((item: any) => ({
          id: item.category_id,
          label: item.name,
          count: item.product_count,
        }));
        setCategories(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="rts-category-area rts-section-gap">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="cover-card-main-over">
              <div className="row">
                <div className="col-lg-12">
                  <div className="title-area-between">
                    <h2
                      className="title mb--0"
                      style={{ fontWeight: "bold", color: "black" }}
                    >
                      Available Categories
                    </h2>
                    <div className="next-prev-swiper-wrapper">
                      <div className="swiper-button-prev">
                        <i className="fa-regular fa-chevron-left"></i>
                      </div>
                      <div className="swiper-button-next">
                        <i className="fa-regular fa-chevron-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="rts-caregory-area-one">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="category-area-main-wrapper-one">
                          <Swiper
                            modules={[Navigation]}
                            navigation={{
                              nextEl: ".swiper-button-next",
                              prevEl: ".swiper-button-prev",
                            }}
                            loop={true}
                            speed={1000}
                            spaceBetween={15}
                            slidesPerView={8}
                            breakpoints={{
                              0: { slidesPerView: 1, spaceBetween: 15 },
                              340: { slidesPerView: 2, spaceBetween: 15 },
                              480: { slidesPerView: 3, spaceBetween: 15 },
                              640: { slidesPerView: 4, spaceBetween: 15 },
                              840: { slidesPerView: 4, spaceBetween: 15 },
                              1140: { slidesPerView: 6, spaceBetween: 15 },
                              1740: { slidesPerView: 8, spaceBetween: 15 },
                            }}
                          >
                            {categories.map((category, index) => (
                              <SwiperSlide key={index}>
                                <a
                                  href={`/shop?category=${category.id}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "#222",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    background: "#fff",
                                    borderRadius: "12px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                    padding: "8px 12px", // reduced padding
                                    minHeight: "40px", // reduced height
                                    fontWeight: "500",
                                    fontSize: "1.1rem", // slightly increased base font
                                    gap: "10px",
                                    width: "100%",
                                    maxWidth: "220px", // reduce card width
                                  }}
                                >
                                  {/* Left: Cart icon and category name */}
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      minWidth: 0,
                                    }}
                                  >
                                    <i
                                      className="fa fa-shopping-cart"
                                      style={{
                                        fontSize: "1.3rem",
                                        color: "#0070f3",
                                      }}
                                    />
                                    <span
                                      style={{
                                        maxWidth: "120px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        fontWeight: "bold",
                                        fontSize: "1.25rem", // increase category font size
                                      }}
                                      title={category.label}
                                    >
                                      {category.label}
                                    </span>
                                  </span>
                                  {/* Right: Product count badge */}
                                  <span
                                    style={{
                                      background: "#0070f3",
                                      color: "#fff",
                                      borderRadius: "50%",
                                      minWidth: "28px",
                                      height: "28px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: "bold",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    {category.count}
                                  </span>
                                </a>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;
