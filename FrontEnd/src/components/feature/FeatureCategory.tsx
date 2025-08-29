"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import BlogOneMain from "../blog/BlogOneMain";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getCategories } from "../services/apiServices";

const categories = [
  {
    img: "/assets/images/category/sparks.png",
    title: "Sparklers",
    items: "25 Items",
  },
  {
    img: "/assets/images/category/fancy_color_sparks.jpeg",
    title: "Organic Vegetable",
    items: "299 Items",
  },
  {
    img: "/assets/images/category/03.png",
    title: "Organic Vegetable",
    items: "299 Items",
  },
  {
    img: "/assets/images/category/04.png",
    title: "Organic Vegetable",
    items: "299 Items",
  },
  {
    img: "/assets/images/category/05.png",
    title: "Organic Foods",
    items: "299 Items",
  },
  {
    img: "/assets/images/category/06.png",
    title: "Primiun Vegetable",
    items: "299 Items",
  },
  {
    img: "/assets/images/category/07.png",
    title: "Organic Vegetable",
    items: "299 Items",
  },
  {
    img: "/assets/images/category/08.png",
    title: "Organic Vegetable",
    items: "299 Items",
  },
  {
    img: "/assets/images/category/09.png",
    title: "Organic Vegetable",
    items: "299 Items",
  },
  {
    img: "/assets/images/category/10.png",
    title: "Organic Vegetable",
    items: "299 Items",
  },
];
const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    // define async fn inside useEffect
    const fetchData = async () => {
      try {
        const data: any = await getCategories();
        const formattedData = data.map((item) => ({
          id: item.category_id,
          label: item.name,
          icon: `${item.image}`,
          count: item.items, // you can map icons by category if you have them
        }));
        setCategories(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(); // call it
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
                    <h2 className="title mb--0" style={{fontWeight:'bold',color:'black'}}>Available Categories</h2>
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
                                {/* <div className="single-category-one height-180">
                                                                    <a href={`/shop?category=${category.id}`}>
                                                                        <Image src={category.icon} alt="category" width={100} height={100} />
                                                                        <p>{category.label}</p>
                                                                        <span>{category.count}</span>
                                                                    </a>
                                                                </div> */}
                                <div className="single-blog-area-start">
                                  <BlogOneMain
                                    Slug={`/shop?category=${category.id}`}
                                    blogImage={category.icon}
                                    blogTitle={category.label}
                                  />
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
