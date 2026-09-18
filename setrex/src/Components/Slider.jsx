import React from "react";
import { Swiper } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const Slider = ({
  children,
  speed = 5000,
  spaceBetween = 80,
}) => {
  return (
    <Swiper
      modules={[Autoplay]}
      direction="horizontal"
      dir="rtl"
      slidesPerView="5"
      spaceBetween={spaceBetween}
      loop={true}
      speed={speed}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
      }}
        allowTouchMove={false}
        className="partner-slider"
    >
      {children}
    </Swiper>
  );
};

export default Slider;
