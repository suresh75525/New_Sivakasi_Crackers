"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories } from "../services/apiServices";

type MenuItem = {
  icon: string;
  label: string;
  submenu: string[] | null;
};

function CategoryMenu() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState([]);

  const toggleMenu = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
      // define async fn inside useEffect
      const fetchData = async () => {
        try {
          const data: any = await getCategories();
          const formattedData = data.map((item:any) => ({
            label: item.name,
            icon: "crackers.png", // you can map icons by category if you have them
            submenu: [], // keep empty for now unless backend gives subcategories
          }));
          setCategories(formattedData);
        } catch (error) {
          console.error(error);
        } 
      };
  
      fetchData(); // call it
    }, []);

  return (
    // <div className="dropdown-menu overflow-visible">
      <ul className="category-sub-menu max-h-64 overflow-y-auto ">
      {categories && categories.length > 0 ? (
        categories.map((item, index) => (
          <li key={index}>
            <a href="#" className="menu-item flex items-center gap-2">
              <span>{item}</span>
            </a>
          </li>
        ))
      ) : (
        <li>No categories found</li>
      )}
    </ul>
    // </div>
    
  );
}

export default CategoryMenu;
