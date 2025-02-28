"use client";

import Navbar from "@/components/landingPageComps/navbar";
import "./landingPage.css";
import Hero from "@/components/landingPageComps/hero";
import HowItWorkSection from "@/components/landingPageComps/whatWeDo";
import WhoDoWeServe from "@/components/landingPageComps/whoDoWeServe";
import WhyUs from "../../components/landingPageComps/whyUs";
import Footer from "@/components/landingPageComps/footer";
import { useRef } from "react";

const LandingPage = () => {
  const howItWorksRef = useRef(null);
  const whoWeServeRef = useRef(null);
  const whyUsRef = useRef(null);

  const scrollToSection = (sectionRef) => {
    if (!sectionRef?.current) return;

    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landingPage">
      <div className="heroSection_wrapper">
        <Navbar
          scrollToSection={scrollToSection}
          howItWorksRef={howItWorksRef}
          whoWeServeRef={whoWeServeRef}
          whyUsRef={whyUsRef}
        />
        <Hero />
        <div className="top_blob"></div>
        <div className="animation_blobContainer">
          <div className="blob one"></div>
          <div className="blob two"></div>
        </div>
      </div>
      <div ref={howItWorksRef} className="worksRef">
        <HowItWorkSection />
      </div>
      <div ref={whoWeServeRef} className="whoWeServeRef">
        <WhoDoWeServe />
      </div>
      <div ref={whyUsRef} className="whyUsRef">
        <WhyUs />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
