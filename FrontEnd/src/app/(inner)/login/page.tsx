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
    <div className="demo-one">
      <HeaderFive />
      <>
        {/* ...breadcrumb and separator... */}
        <div className="rts-register-area rts-section-gap bg_light-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div
                  className="registration-wrapper-1"
                  style={{ maxWidth: 400, margin: "0 auto" }}
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
                    }}
                  >
                    Login
                  </h3>
                  <form className="registration-form" onSubmit={handleLogin}>
                    <div className="input-wrapper" style={{ marginBottom: 18 }}>
                      <label htmlFor="email">Email*</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-wrapper" style={{ marginBottom: 24 }}>
                      <label htmlFor="password">Password*</label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                      style={{ width: "100%" }}
                      type="submit"
                      disabled={loading} // <-- disable while loading
                    >
                      {loading ? "Logging in..." : "Login Account"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      <ShortService />
    </div>
  );
}
