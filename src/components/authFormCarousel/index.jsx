"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import "./authFormCarousel.css";
import Image from "next/image";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Link from "next/link";

const AuthFormCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = [
    {
      img: "hand_desert.jpg",
      tagline: `Automate Legal Work.\nAccelerate Justice.`,
    },
    {
      img: "desert.jpg",
      tagline: "Your AI Legal Assistant\nSmart.Fast.Reliable.",
    },
    {
      img: "camel_desert.jpg",
      tagline: "Precision at Every Step.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides?.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carouselWrapper">
      <Carousel className="carousel">
        <CarouselContent
          className="carouselContent"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: "transform 0.8s ease-in",
          }}
        >
          {slides?.map((slide, index) => (
            <CarouselItem key={index} className="carouselItem">
              <div className="w-full h-full">
                <div className="aspect-square card">
                  <div className="cardContent">
                    <div className="card_overlay">
                      <div className="overlay-top">
                        <div className="logo">LOGO</div>
                        <Link href='/' className="backToSiteBtn">
                          <p>Back to website</p>
                          <KeyboardArrowRightIcon className="rightIcon" />
                        </Link>
                      </div>
                      <div className="overlay-bottom">
                        <p>{slide?.tagline}</p>
                      </div>
                    </div>
                    <Image
                      src={`/images/${slide?.img}`}
                      width={1200}
                      height={1200}
                      alt="login Image"
                      className="authImage"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default AuthFormCarousel;
