"use client";

import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import App from "@/components/App";

export default function Home() {
  useEffect(() => {
    let sessionId = sessionStorage.getItem("session_id");
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem("session_id", sessionId);
    }
  }, []);

  return (
    <div className="index-bg-gray">
      <App />
    </div>
  );
}
