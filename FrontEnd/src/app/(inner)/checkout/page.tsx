import HeaderFive from "@/components/header/HeaderFive";
import ShortService from "@/components/service/ShortService";
import CheckOutMain from "./CheckOutMain";

export default function Home() {
  return (
    <div className="demo-one">
      <HeaderFive />
      <CheckOutMain />
      <ShortService />
    </div>
  );
}
