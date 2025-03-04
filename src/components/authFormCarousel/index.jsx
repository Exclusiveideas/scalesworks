"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import "./authFormCarousel.css";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const AuthFormCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = [
    {
      img: "auth_one.png",
      tagline: `Research Instantly.\nWrite Powerfully.`,
    },
    {
      img: "auth_two.jpg",
      tagline: "Your AI Writing Assistant\nFast. Insightful. Structured.",
    },
    {
      img: "auth_three.jpg",
      tagline: "From Facts to Story in Seconds.",
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
                        {/* <div className="logo">LOGO</div> */}
                        <Link href='/' className="backToSiteBtn">
                          <p>Back to website</p>
                          <ChevronRight className="rightIcon" />
                        </Link>
                      </div>
                      <div className={` overlay-bottom ${index === 0 && 'dark'}`}>
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
