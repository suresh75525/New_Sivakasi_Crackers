"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeaderFive from "@/components/header/HeaderFive";
import ShortService from "@/components/service/ShortService";
import { login } from "@/components/services/apiServices";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // <-- loading state
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(email, password);
      // Save token for future requests
      sessionStorage.setItem("token", res.token);
      router.push("/account");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="demo-one" style={{ marginTop: 40 }}>
      <HeaderFive />
      <>
        {/* ...breadcrumb and separator... */}
        <div className="rts-register-area rts-section-gap bg_light-1">
          <div className="container">
            <div className="row" style={{ justifyContent: "center" }}>
              <div
                className="col-lg-8"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div
                  className="registration-wrapper-1"
                  style={{
                    maxWidth: 400,
                    width: "100%",
                    margin: "48px auto",
                    padding: "32px 28px",
                    background: "#fff",
                    borderRadius: "18px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      color: "#e53935",
                      fontWeight: "bold",
                      marginBottom: 16,
                      fontSize: 15,
                    }}
                  >
                    This login is for admin users only.
                  </div>
                  <h3
                    className="title"
                    style={{
                      color: "#FF9900",
                      textAlign: "center",
                      marginBottom: 24,
                      fontWeight: 700,
                      fontSize: "2rem",
                      letterSpacing: 1,
                    }}
                  >
                    Login
                  </h3>
                  <form className="registration-form" onSubmit={handleLogin}>
                    <div className="input-wrapper" style={{ marginBottom: 22 }}>
                      <label
                        htmlFor="email"
                        style={{
                          fontWeight: 600,
                          marginBottom: 6,
                          display: "block",
                        }}
                      >
                        Email<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          padding: "10px",
                          fontSize: "16px",
                          borderRadius: "6px",
                          border: "1px solid #e0e0e0",
                          width: "100%",
                          marginTop: "6px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div className="input-wrapper" style={{ marginBottom: 28 }}>
                      <label
                        htmlFor="password"
                        style={{
                          fontWeight: 600,
                          marginBottom: 6,
                          display: "block",
                        }}
                      >
                        Password<span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                          padding: "10px",
                          fontSize: "16px",
                          borderRadius: "6px",
                          border: "1px solid #e0e0e0",
                          width: "100%",
                          marginTop: "6px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    {error && (
                      <div
                        style={{
                          color: "red",
                          marginBottom: 12,
                          textAlign: "center",
                        }}
                      >
                        {error}
                      </div>
                    )}
                    <button
                      className="rts-btn btn-primary"
                      style={{
                        width: "100%",
                        padding: "12px 0",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        borderRadius: "6px",
                        marginTop: "8px",
                        letterSpacing: 0.5,
                      }}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login Account"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </>
      <ShortService />
    </div>
  );
}
