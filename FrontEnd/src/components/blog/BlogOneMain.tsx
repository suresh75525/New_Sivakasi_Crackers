"use client";
import React from "react";
import Link from "next/link";

interface BlogGridMainProps {
  Slug: string;
  blogImage: string;
  blogTitle?: string;
}

const BlogGridMain: React.FC<BlogGridMainProps> = ({
  Slug,
  blogImage,
  blogTitle,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full">
      <a href={`${Slug}`} className="thumbnail block h-48 overflow-hidden">
        <img
          src={`assets/images/logo/siv_logo_svg.svg`}
          alt="blog-area"
          className="w-full h-full object-cover"
        />
      </a>

      <div className="blog-body p-3 flex flex-col flex-1">
        <a href={`${Slug}`} className="flex-1">
          <h4 className="title" style={{color:'black',textAlign:'center'}}>
            {blogTitle}
          </h4>
        </a>
      </div>
    </div>
  );
};

export default BlogGridMain;
