"use client";

import { useEffect, useState } from "react";
import { FaMobileAlt, FaMapMarkerAlt, FaHeart, FaShoppingCart, FaSignInAlt } from "react-icons/fa";

export default function Header() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header style={{ fontFamily: "'Quicksand', sans-serif" }}>
      {/* Marquee Welcome Section */}
      <div
        style={{
          backgroundColor: "rgb(1 90 170 / var(--tw-bg-opacity, 1))",
          color: "white",
          height: "30px",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {isClient && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              whiteSpace: "nowrap",
              animation: "marqueeWithPause 20s linear infinite",
              transform: "translateX(-100%)",
            }}
          >
            <img
              src="/user/bea.png"
              alt="Logo"
              style={{
                height: "20px",
                marginRight: "20px",
                filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))",
              }}
            />
            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                margin: "0 20px 0 0",
                fontStyle: "italic",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              }}
            >
              Welcome to our Store
            </p>
          </div>
        )}
      </div>

      {/* Info Row Section */}
      <div
        style={{
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 30px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* Logo */}
        <img src="/user/bea.png" alt="Logo" style={{ height: "40px" }} />

        {/* Categories */}
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "20px",
            margin: 0,
            padding: 0,
          }}
        >
          {["Mobiles", "Air Conditioners", "Washing Machines", "Deals", "Open Box"].map(
            (item) => (
              <li key={item}>
                <a
                  href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{
                    textDecoration: "none",
                    color: "#003366",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {item}
                </a>
              </li>
            )
          )}
        </ul>

        {/* Icons & Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Mobile Icon & Number */}
          {/* <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FaMobileAlt color="#003366" />
            <span style={{ color: "#003366", fontWeight: "600" }}>9942699800</span>
          </div> */}

          {/* Location Icon */}
          <FaMapMarkerAlt color="#003366" />

          {/* Wishlist */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FaHeart color="#D62828" />
            <span style={{ fontWeight: "600", color: "#003366" }}>Wishlist</span>
          </div>

          {/* Cart */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FaShoppingCart color="#003366" />
            <span style={{ fontWeight: "600", color: "#003366" }}>Cart</span>
          </div>

          {/* Sign In */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FaSignInAlt color="#003366" />
            <span style={{ fontWeight: "600", color: "#003366" }}>Sign In</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav
        style={{
          backgroundColor: "#f8f8f8",
          padding: "12px 0",
          borderBottom: "1px solid #D4AF37",
        }}
      >
        <ul
          style={{
            listStyleType: "none",
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            margin: 0,
            padding: 0,
          }}
        >
          {["Mobiles", "Air Conditioners", "Washing Machines", "Deals", "Open Box"].map(
            (item) => (
              <li key={item} style={{ position: "relative" }}>
                <a
                  href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{
                    textDecoration: "none",
                    color: "#003366",
                    fontSize: "16px",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    padding: "6px 10px",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#D4AF37")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#003366")}
                >
                  {item}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "0",
                      width: "0",
                      height: "2px",
                      backgroundColor: "#D4AF37",
                      transition: "width 0.3s ease",
                    }}
                  ></span>
                </a>
              </li>
            )
          )}
        </ul>
      </nav>

      {/* Global Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Cormorant+Garamond:wght@600&display=swap");

        @keyframes marqueeWithPause {
          0% {
            transform: translateX(-100%);
          }
          25% {
            transform: translateX(0%);
          }
          50% {
            transform: translateX(0%);
          }
          75% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        a:hover span {
          width: 100% !important;
        }
      `}</style>
    </header>
  );
}
