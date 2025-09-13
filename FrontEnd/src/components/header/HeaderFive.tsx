"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "./Nav";
import CategoryMenu from "./CategoryMenu";
import Cart from "./Cart";
import WishList from "./WishList";
import BackToTop from "@/components/common/BackToTop";
import Sidebar from "./Sidebar";
import styles from "./header.module.css";
import { useCompare } from "@/components/header/CompareContext";
import { useRouter } from "next/navigation";
import { getCategories, getProducts } from "../services/apiServices";
// import PhoneLogo from "../common/PhoneLogo";

// Simple hook to detect mobile screen size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

type Category = { id: number; name: string };
type Product = { id: number; name: string };
type Suggestion = { label: string; type: "category" | "product"; id: number };

function HeaderFive({
  setSelectedCategoryId,
  externalSetSearchTerm,
}: {
  setSelectedCategoryId?: (id: number) => void;
  externalSetSearchTerm?: (term: string) => void;
}) {
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
  const isMobile = useIsMobile();
  // --- Search suggestion logic start ---
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
    getProducts().then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const categorySuggestions = categories
        .filter((cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(
          (cat) => ({ label: cat.name, type: "category", id: cat.id } as const)
        );
      const productSuggestions = products
        .filter((prod) =>
          prod.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(
          (prod) =>
            ({ label: prod.name, type: "product", id: prod.id } as const)
        );
      setSuggestions(
        [...categorySuggestions, ...productSuggestions].slice(0, 8)
      );
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
      setSelectedCategoryId(suggestion.id);
    } else if (suggestion.type === "product") {
      router.push(`/product/${suggestion.id}`);
    }
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
  // --- Search suggestion logic end ---

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <>
        {/* rts header area start */}
        <div
          className="rts-header-one-area-one"
          style={{ paddingTop: 8, paddingBottom: 8 }}
        >
          <div className={styles.headerTopArea}>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className={styles.tickerContainer}>
                    <div className={styles.tickerText}>
                      <span>
                        Welcome to{" "}
                        <strong style={{ color: "#dc2626" }}>
                          Sivakasi Crackers
                        </strong>
                        ! 🎆 Celebrate safe, Celebrate bright &nbsp;&nbsp;&nbsp;
                        <span style={{ color: "black", fontWeight: 700 }}>
                          Minimum order is at least Rs. 2,000.
                        </span>
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 18,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Logo */}
                    <a
                      href="/"
                      className="logo-area"
                      style={{ flex: "0 0 auto" }}
                    >
                      <img
                        src="assets/images/logo/siv_logo_svg.svg"
                        alt="logo-main"
                        className="logo"
                        style={{ maxHeight: 40 }}
                      />
                    </a>
                    {/* Mobile Number */}
                    {!isMobile && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flex: "0 0 auto",
                          minWidth: 140,
                          marginLeft: 10,
                          marginRight: 10,
                        }}
                      >
                        <i
                          className="fa-regular fa-phone-volume"
                          style={{
                            color: "#FF9900",
                            fontSize: 20,
                            marginRight: 8,
                          }}
                        />
                        <div>
                          <span
                            style={{
                              color: "#FF9900",
                              fontWeight: "bold",
                              fontSize: 15,
                            }}
                          >
                            Phone Number
                          </span>
                          <div style={{ fontWeight: "bold", fontSize: 18 }}>
                            +91 98429 72802
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Search (only show on desktop) */}
                    {!isMobile && (
                      <form
                        onSubmit={handleSubmit}
                        className="search-header"
                        autoComplete="off"
                        style={{
                          flex: "1 1 300px",
                          display: "flex",
                          alignItems: "center",
                          minWidth: 220,
                          maxWidth: 400,
                          marginLeft: 10,
                          marginRight: 10,
                        }}
                      >
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder="Search for products, categories or brands"
                          required
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onFocus={() =>
                            searchTerm.length > 0 && setShowSuggestions(true)
                          }
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            border: "1px solid #ccc",
                            borderRadius: "4px 0 0 4px",
                            fontSize: 15,
                          }}
                        />
                        <button
                          type="submit"
                          className="rts-btn btn-primary radious-sm with-icon"
                          style={{
                            background: "#5c9f2e",
                            color: "#fff",
                            fontWeight: "bold",
                            border: "none",
                            borderRadius: "0 4px 4px 0",
                            padding: "8px 18px",
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ marginRight: 6 }}>Search</span>
                          <i className="fa-light fa-magnifying-glass" />
                        </button>
                        {/* ...autocomplete suggestions if needed... */}
                      </form>
                    )}
                    {/* Account */}
                    <a
                      href="/login"
                      className={styles.account}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: 18,
                        padding: "6px 10px",
                        color: "#222",
                        textDecoration: "none",
                        fontWeight: "bold",
                        border: "1px solid #eee",
                        borderRadius: 6,
                        background: "#FF9900",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                    >
                      <i
                        className="fa-light fa-user"
                        style={{ fontSize: 20 }}
                      />
                      {!isMobile && (
                        <span style={{ marginLeft: 6 }}>Account</span>
                      )}
                    </a>
                    {/* Cart */}
                    <div style={{ flex: "0 0 auto" }}>
                      <Cart showLabel={!isMobile} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* rts header area end */}
      </>
      <div
        style={{
          width: "100%",
          textAlign: "center",
          background: "#fffbe6",
          color: "#222",
          fontWeight: 700,
          fontSize: isMobile ? 13 : 17, // Reduce font size on mobile
          padding: isMobile ? "7px 0" : "10px 0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          letterSpacing: 0.5,
        }}
      >
        🎆 Pooja Offer: Buy your favorite crackers and we’ll add free 12 shots
      </div>
      <BackToTop />
      {/* <PhoneLogo /> */}
      {/* <Sidebar /> */}
    </div>
  );
}

export default HeaderFive;
