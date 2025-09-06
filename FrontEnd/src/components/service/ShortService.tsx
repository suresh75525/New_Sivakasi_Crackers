import React from "react";

function ComponentName() {
  return (
    <div
      style={{
        // position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        // zIndex: 100,
      }}
    >
      <div
        className="rts-shorts-service-area rts-section-gap bg_primary"
        style={{ padding: "8px 0" }} // Reduced height
      >
        <div className="container">
          <div
            className="row g-5"
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <span
              style={{
                fontWeight: "bold",
                textAlign: "center",
                width: "100%",
                color: "white",
                fontSize: "15px",
              }}
            >
              Copyright 2025 ©Jayavardhencracker.com. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComponentName;
