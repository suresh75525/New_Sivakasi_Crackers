"use client"
import React, { useState, useEffect, useRef } from 'react';
import { getCategories, getProducts } from "../services/apiServices"; // Update to your actual services path
// Adjust path if needed
import HeaderNav from './HeaderNav';
import CategoryMenu from './CategoryMenu';
import Cart from './Cart';
import WishList from './WishList';
import Sidebar from './Sidebar';
import BackToTop from "@/components/common/BackToTop";
import { useCompare } from '@/components/header/CompareContext';
import { useRouter } from 'next/navigation';

// Add setSelectedCategoryId as a prop to scroll to category section
function HeaderFive({ setSelectedCategoryId }: { setSelectedCategoryId: (id: number) => void }) {
    const { compareItems } = useCompare();

    // Countdown setup
    useEffect(() => {
        const countDownElements = document.querySelectorAll<HTMLElement>('.countDown');
        const endDates: Date[] = [];

        countDownElements.forEach((el) => {
            const match = el.innerText.match(/([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/);
            if (!match) return;

            const end = new Date(+match[3], +match[1] - 1, +match[2], +match[4], +match[5], +match[6]);
            if (end > new Date()) {
                endDates.push(end);
                const next = calcTime(end.getTime() - new Date().getTime());
                el.innerHTML = renderDisplay(next);
            } else {
                el.innerHTML = `<p class="end">Sorry, your session has expired.</p>`;
            }
        });

        const interval = setInterval(() => {
            countDownElements.forEach((el, i) => {
                const end = endDates[i];
                if (!end) return;
                const now = new Date();
                const diff = end.getTime() - now.getTime();

                if (diff <= 0) {
                    el.innerHTML = `<p class="end">Sorry, your session has expired.</p>`;
                } else {
                    const next = calcTime(diff);
                    el.innerHTML = renderDisplay(next);
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const calcTime = (milliseconds: number) => {
        const secondsTotal = Math.floor(milliseconds / 1000);
        const days = Math.floor(secondsTotal / 86400);
        const hours = Math.floor((secondsTotal % 86400) / 3600);
        const minutes = Math.floor((secondsTotal % 3600) / 60);
        const seconds = secondsTotal % 60;
        return [days, hours, minutes, seconds].map((v) => v.toString().padStart(2, '0'));
    };

    const renderDisplay = (timeArr: string[]) => {
        return timeArr
            .map((item) => `<div class='container'><div class='a'><div>${item}</div></div></div>`)
            .join('');
    };

    const router = useRouter();
    type Category = { id: number; name: string };
    type Product = { id: number; name: string };

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [suggestions, setSuggestions] = useState<{ label: string, type: "category" | "product", id: number }[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);


    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Fetch categories and products from services
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
            // ...existing code...

            setSuggestions([...categorySuggestions, ...productSuggestions].slice(0, 8));
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchTerm, categories, products]);


    const handleSuggestionClick = (suggestion: { label: string, type: "category" | "product", id: number }) => {
        setSearchTerm(suggestion.label);
        setShowSuggestions(false);

        if (suggestion.type === "category") {
            setSelectedCategoryId(suggestion.id); // Scroll to category section
        } else if (suggestion.type === "product") {
            router.push(`/product/${suggestion.id}`); // Navigate to product detail
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
            setShowSuggestions(false);
        } else {
            router.push('/shop');
        }
    };

    return (
        <>
            <div className="rts-header-one-area-one">
                {/* logo + search */}
                <div className="search-header-area-main">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="logo-search-category-wrapper">
                                    <a href="/" className="logo-area">
                                        <img src="/assets/images/logo/logo_06.png" width={120} height={30} alt="logo-main" className="h-10 w-auto" />
                                    </a>
                                    <div className="category-search-wrapper">
                                        <div className="category-btn category-hover-header">
                                            <img className="parent" src="/assets/images/icons/bar-1.svg" alt="icons" />
                                            <span>Categories</span>
                                            <CategoryMenu />
                                        </div>
                                        <form onSubmit={handleSubmit} className="search-header" autoComplete="off">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                placeholder="Search for products, categories or brands"
                                                required
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
                                            />
                                            <button type="submit" className="rts-btn btn-primary radious-sm with-icon">
                                                <div className="btn-text">Search</div>
                                                <div className="arrow-icon">
                                                    <i className="fa-light fa-magnifying-glass" />
                                                </div>
                                            </button>

                                            {/* Autocomplete dropdown */}
                                            {showSuggestions && suggestions.length > 0 && (
                                                <ul className="autocomplete-suggestions" style={{
                                                    position: 'absolute',
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #ccc',
                                                    marginTop: '4px',
                                                    width: '100%',
                                                    maxHeight: '200px',
                                                    overflowY: 'auto',
                                                    zIndex: 1000,
                                                    listStyleType: 'none',
                                                    padding: 0,
                                                    borderRadius: '4px',
                                                }}>
                                                    {suggestions.map((suggestion, index) => (
                                                        <li
                                                            key={index}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault(); // prevents blur
                                                                handleSuggestionClick(suggestion); // manually call the handler
                                                            }}
                                                            style={{
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                                color: suggestion.type === "category" ? "#0070f3" : "#222",
                                                                fontWeight: suggestion.type === "category" ? "bold" : "normal"
                                                            }}
                                                        >
                                                            {suggestion.label}
                                                        </li>

                                                    ))}
                                                </ul>
                                            )}
                                        </form>
                                    </div>
                                    <div className="actions-area">
                                        <div className="search-btn" id="searchs">
                                            <svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="..." fill="#1F1F25" />
                                            </svg>
                                        </div>
                                        <div className="menu-btn" id="menu-btn">
                                            <svg width={20} height={16} viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect y={14} width={20} height={2} fill="#1F1F25" />
                                                <rect y={7} width={20} height={2} fill="#1F1F25" />
                                                <rect width={20} height={2} fill="#1F1F25" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="accont-wishlist-cart-area-header">
                                        <a href="/account" className="btn-border-only account">
                                            <i className="fa-light fa-user" />
                                            <span>Account</span>
                                        </a>
                                        <a href="/shop-compare" className="btn-border-only account compare-number">
                                            <i className="fa-regular fa-code-compare" />
                                            <span className="number">{compareItems.length}</span>
                                        </a>
                                        <WishList />
                                        <Cart />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* main nav */}
                <HeaderNav />
            </div>
            <Sidebar />
            <BackToTop />
        </>
    );
}

export default HeaderFive;
// ...existing code...