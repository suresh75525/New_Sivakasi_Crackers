import React from "react";

function FooterTwo() {
  return (
    <>
      <style>
        {`
          @media (min-width: 768px) {
            .footer-two-main-wrapper,
            .footer-two-main-wrapper span,
            .footer-two-main-wrapper a,
            .footer-title,
            .copyright-arae-two-wrapper p {
              font-size: 1.25rem !important;
            }
            .footer-logo-img {
              width: 70px !important;
              height: 55px !important;
            }
          }
        `}
      </style>
      <div style={{ padding: "8px 0" }}>
        <div className="rts-footer-area-two" style={{ padding: "8px 0" }}>
          <div className="container-2">
            <div className="row">
              <div className="col-lg-12">
                <div
                  className="footer-two-main-wrapper"
                  style={{
                    padding: "0",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      marginBottom: "8px",
                      width: "100%",
                    }}
                  >
                    <h3> Contact Us </h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "8px",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "1rem",
                      }}
                    >
                      <img
                        src="assets/images/icons/13.svg"
                        alt="mail"
                        style={{ width: "20px", height: "20px" }}
                        className="footer-logo-img"
                      />
                      <a
                        href="mailto:info@jayavardhencracker.com"
                        style={{
                          color: "#FF9900",
                          fontWeight: "bold",
                          wordBreak: "break-all",
                        }}
                      >
                        info@jayavardhencracker.com
                      </a>
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "1rem",
                      }}
                    >
                      <img
                        src="assets/images/icons/12.svg"
                        alt="mobile"
                        style={{ width: "20px", height: "20px" }}
                        className="footer-logo-img"
                      />
                      <a
                        href="tel:9842972802"
                        style={{ color: "#FF9900", fontWeight: "bold" }}
                      >
                        +919842972802
                      </a>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                      width: "100%",
                    }}
                  >
                    <img
                      src="assets/images/logo/siv_logo_svg.svg"
                      alt="logo-area"
                      style={{ width: "70px", height: "40px" }}
                      className="footer-logo-img"
                    />
                    <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                      Sivakasi Crackers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rts-copyright-area-two" style={{ padding: "8px 0" }}>
          <div className="container-2">
            <div className="row">
              <div className="col-lg-12">
                <div
                  className="copyright-arae-two-wrapper"
                  style={{ textAlign: "center" }}
                >
                  <p className="disc" style={{ margin: 0 }}>
                    Copyright 2025 <a href="#">©Jayavardhencracker.com</a>. All
                    rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FooterTwo;
