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

function HeaderFive() {
  const { compareItems } = useCompare();
  // header sticky
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMenuClick = () => {
    const sidebar = document.querySelector(".side-bar.header-two");
    if (sidebar) {
      sidebar.classList.toggle("show");
    }
  };

  const handleSearchOpen = () => {
    const sidebar = document.querySelector(".search-input-area");
    if (sidebar) {
      sidebar.classList.toggle("show");
    }
  };

  // filter search action js start
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allSuggestions = [
    "Profitable business makes your profit Best Solution",
    "Details Profitable business makes your profit",
    "One Profitable business makes your profit",
    "Me Profitable business makes your profit",
    "Details business makes your profit",
    "Firebase business makes your profit",
    "Netlyfy business makes your profit",
    "Profitable business makes your profit",
    "Valuable business makes your profit",
    "System business makes your profit",
    "Profitables business makes your profit",
    "Content business makes your profit",
    "Dalivaring business makes your profit",
    "Staning business makes your profit",
    "Best business makes your profit",
    "cooler business makes your profit",
    "Best-one Profitable business makes your profit",
    "Super Fresh Meat",
    "Original Fresh frut",
    "Organic Fresh frut",
    "Lite Fresh frut",
  ];

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = allSuggestions.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    router.push(`/shop?search=${encodeURIComponent(suggestion)}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
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

  // filter search action js end

  return (
    <div>
      <>
        {/* rts header area start */}
        <div className="rts-header-one-area-one">
          <div className="header-top-area">
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
          <div className="search-header-area-main-1">
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
                              />
                            </a>
                            <div className="category-search-wrapper style-five">
                              <div className="location-area">
                                <div className="icon">
                                  <i className="fa-regular fa-phone-volume" />
                                </div>
                                <div className="information">
                                  <span>Phone Number</span>
                                  <a href="#">
                                    <p>6381497218</p>
                                  </a>
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
                                        onClick={() =>
                                          handleSuggestionClick(suggestion)
                                        }
                                        style={{
                                          padding: "8px 12px",
                                          cursor: "pointer",
                                        }}
                                        onMouseDown={(e) => e.preventDefault()} // prevent input blur
                                      >
                                        {suggestion}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </form>
                            </div>
                            <div className="accont-wishlist-cart-area-header">
                              <a
                                href="/account"
                                className="btn-border-only account"
                              >
                                <i className="fa-light fa-user" />
                                Account
                              </a>
                              {/* <a
                                href="/shop-compare"
                                className="btn-border-only account compare-number"
                              >
                                <i className="fa-regular fa-code-compare"></i>
                                <span className="number">
                                  {compareItems.length}
                                </span>
                              </a> */}
                              {/* <WishList /> */}
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
            className={`rts-header-nav-area-one  header-four header--sticky  ${
              isSticky ? "sticky" : ""
            }`}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="logo-search-category-wrapper after-md-device-header header-mid-five-call">
                    <a href="/" className="logo-area">
                      <img
                        src="assets/images/logo/logo-01.svg"
                        alt="logo-main"
                        className="logo"
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* rts header area end */}
      </>
      <BackToTop />
      <Sidebar />
    </div>
  );
}

export default HeaderFive;
