"use client";

import "./landingPage.css";
import Hero from "@/components/landingPageComps/hero";
import AllFeatures from "@/components/landingPageComps/allFeatures";

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <AllFeatures />
      {/* <Footer /> */}
    </div>
  );
};

export default LandingPage;
