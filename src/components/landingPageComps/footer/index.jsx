import Image from "next/image";
import "./footer.css";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Instagram, Twitter } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="upper_footer">
        <div className="leftFooter">
          <div className="logo_div_footer">
            <Image
              src={`/icons/logo.png`}
              width={100}
              height={100}
              alt="logo icon"
              className="logoImgFooter"
            />
            <Link href="/">
              <p>SCALEWORKS</p>
            </Link>
          </div>
          <p className="tagline">
            Enterprise AI solutions designed specifically for modern law firms.
          </p>
          <div className="socials_wrapper">
            <Link className="socialIcon" href="https://x.com/ScaleWorks_AI">
              <Twitter />
            </Link>
            <Link
              className="socialIcon"
              href="https://www.instagram.com/scaleworks.ai/"
            >
              <Instagram />
            </Link>
          </div>
        </div>
        <div className="rightFooter">
          <div className="contactRow">
            <div className="cRow">
              <MapPin />
              <p>800 North King St. Wilmington, DE 19801</p>
            </div>
            <div className="cRow">
              <Mail />
              <a href="mailto:ed@scaleworks.ai">
                <p>ed@scaleworks.ai</p>
              </a>
            </div>
            <div className="cRow">
              <Phone />
              <a href="tel:+2038376327">
                <p>(203) 837-6327</p>
              </a>
            </div>
          </div>
          <div className="companySections">
            <Link className="companySection" href="https://x.com/ScaleWorks_AI">
              <p>Blog</p>
            </Link>
            <Link className="companySection" href="/">
              <p>Integrity</p>
            </Link>
            <Link className="companySection" href="/">
              <p>Contact</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="lower_footer">
        <p>© 2025 ScaleWorks. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
