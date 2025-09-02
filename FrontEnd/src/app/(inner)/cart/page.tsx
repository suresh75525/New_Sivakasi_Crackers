"use client";
import HeaderFive from "@/components/header/HeaderFive";
import ShortService from "@/components/service/ShortService";
import CartMain from "./CartMain";
import Link from "next/link";
// // import FooterOne from "@/components/footer/FooterOne";

export default function Home() {
  return (
    <div className="demo-one">
      <HeaderFive />
      <>
        <div className="rts-navigation-area-breadcrumb bg_light-1">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="navigator-breadcrumb-wrapper">
                  <Link href="/">Home</Link>
                  <i className="fa-regular fa-chevron-right" />
                  <span className="current" style={{ marginLeft: 6 }}>
                    My Cart
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-seperator bg_light-1">
          <div className="container">
            <hr className="section-seperator" />
          </div>
        </div>
      </>

      <CartMain />
      <ShortService />
      {/* <FooterOne /> */}
    </div>
  );
}
