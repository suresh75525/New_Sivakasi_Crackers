"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "./Nav";
import CategoryMenu from "./CategoryMenu";
import Cart from "./Cart";
import WishList from "./WishList";
import BackToTop from "@/components/common/BackToTop";
import Sidebar from "./Sidebar";
import { useCompare } from "@/components/header/CompareContext";
import { useRouter } from "next/navigation";
import { getCategories, getProducts } from "../services/apiServices"; // <-- Add your actual services path

type Category = { id: number; name: string };
type Product = { id: number; name: string };
type Suggestion = { label: string; type: "category" | "product"; id: number };

function HeaderFive({ setSelectedCategoryId, externalSetSearchTerm }: { setSelectedCategoryId?: (id: number) => void, externalSetSearchTerm?: (term: string) => void }) {
  const { compareItems } = useCompare();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuClick = () => {
    const sidebar = document.querySelector(".side-bar.header-two");
    if (sidebar) sidebar.classList.toggle("show");
  };

  const handleSearchOpen = () => {
    const sidebar = document.querySelector(".search-input-area");
    if (sidebar) sidebar.classList.toggle("show");
  };

  // --- Search suggestion logic start ---
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getCategories().then(data => setCategories(data));
    getProducts().then(data => setProducts(data));
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const categorySuggestions = categories
        .filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(cat => ({ label: cat.name, type: "category", id: cat.id } as const));
      const productSuggestions = products
        .filter(prod => prod.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(prod => ({ label: prod.name, type: "product", id: prod.id } as const));
      setSuggestions([...categorySuggestions, ...productSuggestions].slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, categories, products]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchTerm(suggestion.label);
    externalSetSearchTerm?.(suggestion.label);
    setShowSuggestions(false);

    if (suggestion.type === "category" && setSelectedCategoryId) {
      // ✅ tell parent to filter ProductList by this category
      setSelectedCategoryId(suggestion.id);
    } else if (suggestion.type === "product") {
      // ✅ navigate to product detail
      router.push(`/product/${suggestion.id}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    } else {
      router.push("/shop");
    }
  };
  // --- Search suggestion logic end ---

  return (
    <div>
      <>
        {/* rts header area start */}
        <div
          className="rts-header-one-area-one"
          style={{ paddingTop: 8, paddingBottom: 8 }}
        >
          <div
            className="header-top-area"
            style={{ paddingTop: 4, paddingBottom: 4 }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row ticker-container overflow-hidden whitespace-nowrap bg-yellow-300 py-2">
                    <div className="ticker-text">
                      <span>
                        Welcome to{" "}
                        <strong className="text-red-600">
                          Sivakasi Crackers
                        </strong>
                        ! 🎆 Celebrate safe, Celebrate bright &nbsp;&nbsp;&nbsp;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="search-header-area-main-1"
            style={{ paddingTop: 8, paddingBottom: 8 }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="search-header-area-main bg_white without-category">
                    <div className="container">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="logo-search-category-wrapper style-five-call-us">
                            <a href="/" className="logo-area">
                              <img
                                src="assets/images/logo/siv_logo_svg.svg"
                                alt="logo-main"
                                className="logo"
                                style={{ maxHeight: 40 }}
                              />
                            </a>
                            <div className="category-search-wrapper style-five">
                              <div className="location-area">
                                <div className="icon">
                                  <i className="fa-regular fa-phone-volume" />
                                </div>
                                <div className="information">
                                  <span style={{ color: "#FF9900", fontWeight: "bold" }}>Phone Number</span>

                                  <p style={{ fontWeight:"bold", fontSize:"20px"}}>+91 98429 72802</p>

                                </div>
                              </div>
                              <form
                                onSubmit={handleSubmit}
                                className="search-header"
                                autoComplete="off"
                              >
                                <input
                                  ref={inputRef}
                                  type="text"
                                  placeholder="Search for products, categories or brands"
                                  required
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                  onFocus={() =>
                                    searchTerm.length > 0 &&
                                    setShowSuggestions(true)
                                  }
                                />
                                <button
                                  type="submit"
                                  className="rts-btn btn-primary radious-sm with-icon"
                                >
                                  <div className="btn-text">Search</div>
                                  <div className="arrow-icon">
                                    <i className="fa-light fa-magnifying-glass" />
                                  </div>
                                </button>

                                {/* Autocomplete dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                  <ul
                                    className="autocomplete-suggestions"
                                    style={{
                                      position: "absolute",
                                      backgroundColor: "#fff",
                                      border: "1px solid #ccc",
                                      marginTop: "4px",
                                      width: "100%",
                                      maxHeight: "200px",
                                      overflowY: "auto",
                                      zIndex: 1000,
                                      listStyleType: "none",
                                      padding: 0,
                                      borderRadius: "4px",
                                    }}
                                  >
                                    {suggestions.map((suggestion, index) => (
                                      <li
                                        key={index}
                                        onMouseDown={(e) => {
                                          e.preventDefault(); // keeps input focus
                                          handleSuggestionClick(suggestion); // ✅ now sets text box & closes dropdown
                                        }}
                                        style={{
                                          padding: "8px 12px",
                                          cursor: "pointer",
                                          color:
                                            suggestion.type === "category" ? "#0070f3" : "#222",
                                          fontWeight:
                                            suggestion.type === "category" ? "bold" : "normal",
                                        }}
                                      >
                                        {suggestion.label}
                                      </li>
                                    ))}
                                  </ul>
                                )}

                              </form>
                            </div>
                            <div className="accont-wishlist-cart-area-header">
                              {/* <a
                                href="/account"
                                className="btn-border-only account"
                              >
                                <i className="fa-light fa-user" />
                                Account
                              </a> */}
                              <Cart />
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
          <div
            className={`rts-header-nav-area-one  header-four header--sticky  ${isSticky ? "sticky" : ""
              }`}
            style={{ paddingTop: 8, paddingBottom: 8 }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="logo-search-category-wrapper after-md-device-header header-mid-five-call">
                    <a href="/" className="logo-area">
                      <img
                        src="assets/images/logo/siv_logo_svg.svg"
                        alt="logo-main"
                        className="logo"
                        style={{ maxHeight: 40 }}
                      />
                    </a>
                    <div className="category-search-wrapper">
                      <form action="#" className="search-header">
                        <input
                          type="text"
                          placeholder="Search for products, categories or brands"
                        />
                        <button className="rts-btn btn-primary radious-sm with-icon">
                          <span className="btn-text">Search</span>
                          <span className="arrow-icon">
                            <i className="fa-light fa-magnifying-glass" />
                          </span>
                          <span className="arrow-icon">
                            <i className="fa-light fa-magnifying-glass" />
                          </span>
                        </button>
                      </form>
                    </div>
                    <div
                      className="accont-wishlist-cart-area-header"
                      style={{ display: "flex" }}
                    >
                      <Cart />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* rts header area end */}
      </>
      <BackToTop />
      {/* <Sidebar /> */}
    </div>
  );
}

export default HeaderFive;