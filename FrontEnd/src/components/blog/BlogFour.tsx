"use client";
import React from 'react';
import BlogOneMain from './BlogOneMain';
import Posts from '@/data/Posts.json';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';



interface PostType {
    category?: string;
    slug: string;
    image: string;
    title?: string;
    author?: string;
    publishedDate?: string;
}

function BlogOne() {
    // Slice posts 11 to 15 (index 10 to 14)
    const selectedPosts = Posts.slice(11, 15);

    return (
        
<div>
  {/* rts top trending product area */}
  <div className="blog-area-start rts-section-gap">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="title-area-between">
            <h2 className="title-left mb--0">Latest Blog Post Insights</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="cover-card-main-over">
            <Swiper
              spaceBetween={20} // spacing between slides
              slidesPerView={4} // number of slides visible
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
              pagination={{ clickable: true }}
              breakpoints={{
                320: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
            >
              {selectedPosts.map((post: PostType, index: number) => (
                <SwiperSlide key={index}>
                  <div className="single-blog-area-start" style={{height:'200px'}}>
                    <BlogOneMain
                      Slug={post.slug}
                      blogImage={post.image}
                      blogTitle={post.title}
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
  {/* rts top trending product area end */}
</div>

    );
}

export default BlogOne;
