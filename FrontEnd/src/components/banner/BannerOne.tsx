"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import CategoryBb from "./CategoryBb";
import styles from "./BannerOne.module.css";

const banners = [
  {
    id: 1,
    title: "",
    subtitle: "",
    image: "/assets/images/banner/crackers1.png",
    link: "",
  },
  {
    id: 2,
    title: "",
    subtitle: "",
    image: "/assets/images/banner/crackers2.png",
    link: "",
  },
];

const BannerOne = () => {
  return (
    <div
      className="background-light-gray-color rts-section-gap bg_light-1 pt_sm--20"
      style={{ marginTop: 70 }}
    >
      {/* banner area start */}
      <div className="rts-banner-area-one mb--30">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="category-area-main-wrapper-one">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={1}
                  slidesPerView={1}
                  loop={true}
                  speed={2000}
                  autoplay={{ delay: 4000 }}
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                >
                  {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                      <div
                        className={`banner-bg-image ${styles["banner-bg-image"]} ptb--120 ptb_md--80 ptb_sm--60`}
                        style={{
                          backgroundImage: `url(${banner.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          height: "700px", // Reduced height
                          maxWidth: "1300px", // Reduced width
                          margin: "0 auto", // Center the banner
                          borderRadius: "0px",
                          width: "100%",
                        }}
                      >
                        <div className="banner-one-inner-content">
                          <span className="pre">{banner.subtitle}</span>
                          <h1 className="title">{banner.title}</h1>
                          {/* ... */}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <button className="swiper-button-next">
                  <i className="fa-regular fa-arrow-right"></i>
                </button>
                <button className="swiper-button-prev">
                  <i className="fa-regular fa-arrow-left"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* banner area end */}

      {/* <CategoryBb /> */}
    </div>
  );
};

export default BannerOne;
