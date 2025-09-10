"use client";
import HeaderFive from "@/components/header/HeaderFive";
import ShortService from "@/components/service/ShortService";
import Accordion from "./Accordion";
// import FooterOne from "@/components/footer/FooterOne";

export default function Home() {
  return (
    <div className="demo-one" style={{ marginTop: 40 }}>
      <HeaderFive />

      <>
        <Accordion />
      </>

      <ShortService />
      {/* <FooterOne /> */}
    </div>
  );
}
