"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getCategories } from "../services/apiServices";
import styles from "./FeaturedCategories.module.css";
import ClearIcon from '@mui/icons-material/Clear';

type Category = {
  id: number;
  label: string;
  count: number;
};

type FeaturedCategoriesProps = {
  onCategorySelect: (categoryId: number | null) => void; // ✅ allow null
};

const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  onCategorySelect,
}) => {
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
                  <div
                    className="title-area-between"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "nowrap",        // ✅ prevent wrapping
                    }}
                  >
                    {/* Left: Title */}
                    <h2
                      className="title mb--0"
                      style={{
                        fontWeight: "bold",
                        color: "black",
                        fontSize: "20px",
                        whiteSpace: "nowrap",    // ✅ keep text on one line
                      }}
                    >
                      Available Categories
                    </h2>

                    {/* Right: Clear + Arrows */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        flexShrink: 0,           // ✅ don’t let buttons squeeze title
                      }}
                    >
                      <button
                        onClick={() => onCategorySelect(null)} // ✅ reset filter
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          color: "#d32f2f",
                          whiteSpace: "nowrap",   // ✅ button text in one line
                        }}
                        title="Clear category filter"
                      >
                        <ClearIcon fontSize="medium" /> Clear All
                      </button>

                      <div className="next-prev-swiper-wrapper flex items-center gap-2">
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
                                <div
                                  className={styles.categoryCard}
                                  onClick={() => onCategorySelect(category.id)}
                                >
                                  {/* Left side: icon + label */}
                                  <span className={styles.categoryLeft}>
                                    <i
                                      className={`fa fa-shopping-cart ${styles.categoryIcon}`}
                                    />
                                    <span
                                      className={styles.categoryLabel}
                                      title={category.label}
                                    >
                                      {category.label}
                                    </span>
                                  </span>
                                  {/* Right side: count */}
                                  <span className={styles.categoryBadge}>
                                    {category.count}
                                  </span>
                                </div>
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
