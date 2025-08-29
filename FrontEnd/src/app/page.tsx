
import HeaderFive from "@/components/header/HeaderFive";
// import BannerFour from "@/components/banner/BannerFour";
import BannerOne from "@/components/banner/BannerOne";
import BlogFour from "@/components/blog/BlogFour";
import FooterThree from "@/components/footer/FooterTwo";
import FeatureCategory from '@/components/feature/FeatureCategory';
import BestSellingWrap from '@/components/product/BestSellingWrap';
import FeatureDiscount from "@/components/product/FeatureDiscount";
import LessDiscount from "@/components/product/LessDiscount";
import LessDiscountTwo from "@/components/product/LessDiscountTwo";
import RecentlyAdded from "@/components/product/RecentlyAdded";
import ShortService from "@/components/service/ShortService";


export default function Home() {
  return (
    <div className="index-bg-gray">
      <HeaderFive />
      <BannerOne />
      <FeatureCategory />
      {/* <BestSellingWrap /> */}
      {/* <FeatureDiscount /> */}
      {/* <LessDiscount /> */}
      {/* <LessDiscountTwo /> */}
      {/* <RecentlyAdded />
      <BlogFour /> */}
      {/* <ShortService /> */}
      <FooterThree />
    </div>
  );
}
