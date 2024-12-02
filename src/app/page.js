import Image from "next/image";
import SliderCircle from "@/components/slider_circle";
import Auto from "@/components/silder_auto";
import PosterB1 from "@/components/poster_b1";
import S_product2 from "@/components/silder product 2 ";

export default function Home() {
  return (


    <div className="max-w-[1440px] w-full 2xl:mx-auto mt-10">
      <SliderCircle/>
        <div className="flex  flex-col-reverse 2xl:flex-row xl:flex-row mt-16 ">
            <PosterB1/>
            <Auto/>
        </div>
        <S_product2/>
    </div>
  );
}
