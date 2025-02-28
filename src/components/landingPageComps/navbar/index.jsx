"use client"


import Link from "next/link";
import "./navbar.css";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu, X } from "lucide-react";
import { useState } from "react";


const Navbar = ({
  scrollToSection,
  howItWorksRef,
  whoWeServeRef,
  whyUsRef,
}) => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  return (
    <div className="navbar_wrapper">
      <div className="logo_div">
        <Image
          src={`/icons/logo.png`}
          width={65}
          height={65}
          alt="logo icon"
          className="logoImg"
        />
        <Link href="/">
          <p>SCALEWORKS</p>
        </Link>
      </div>
      <div className="navigation_wrapper">
        <div className="navigation_item">
          <div onClick={() => scrollToSection(howItWorksRef)}>
            <p>How it works</p>
          </div>
          <hr className="nav_underline" />
        </div>
        <div className="navigation_item">
          <div onClick={() => scrollToSection(whoWeServeRef)}>
            <p>Who we serve</p>
          </div>
          <hr className="nav_underline" />
        </div>
        <div className="navigation_item">
          <div onClick={() => scrollToSection(whyUsRef)}>
            <p>Why us?</p>
          </div>
          <hr className="nav_underline" />
        </div>
        <div className="navbar_cta_wrapper">
          <Link href="/auth">
            <div className="navbar_cta">
              <p>Get started</p>
              <hr className="nav_underline" />
            </div>
          </Link>
        </div>
      </div>
      <div className="menuIconWrapper">
        <Popover>
          <PopoverTrigger asChild>
            {!navbarOpen ? (
              <Menu className="menuIcon" />
            ) : (
              <X className="menuIcon" />
            )}
          </PopoverTrigger>
          <PopoverContent className="w-full popOverContent">
            <div style={{ cursor: 'pointer'}} onClick={() => scrollToSection(howItWorksRef)} href="#faqs">How it works</div>
            <div style={{ cursor: 'pointer'}} onClick={() => scrollToSection(whoWeServeRef)} href="#contact">Who we serve</div>
            <div style={{ cursor: 'pointer'}} onClick={() => scrollToSection(whyUsRef)} href="#invest">Why us?</div>
          </PopoverContent>
        </Popover>
      </div>
      <hr className="navbar_underline" />
    </div>
  );
};

export default Navbar;
