import WhyUsInfo from "@/components/landingPageComps/whyUsInfo";
import "./whyUs.css";
import {
    BriefcaseBusiness,
    CalendarDays,
    FileSearch,
    LibraryBig,
    ShieldCheck,
    Shrub,
    Workflow,
} from "lucide-react";

const whyUs = [
  {
    why: "Save Time – Guaranteed",
    Icon: () => <CalendarDays />,
  },
  {
    why: "Smart Document Analysis",
    Icon: () => <FileSearch />,
  },
  {
    why: "Automated Workflows",
    Icon: () => <Workflow />,
  },
  {
    why: "Enterprise-Grade Security",
    Icon: () => <ShieldCheck />,
  },
  {
    why: "Tailored Solutions for Legal Experts",
    Icon: () => <BriefcaseBusiness />,
  },
  {
    why: "Comprehensive Support & Learning Hub",
    Icon: () => <LibraryBig />,
  },
  {
    why: "Built for Growth & Innovation",
    Icon: () => <Shrub />,
  },
];

const WhyUs = () => {
  return (
    <div className="whyUs_wrapper">
      <hr className="whyUs_top_underline" />
      <div className="whyUs_topContainer">
        <h4 className="whyUs_title">Why US?</h4>
        <p className="whyUs_tagline">
          Our solutions are tailored to meet the unique challenges of legal
          practices, from solo practitioners to large firms.
        </p>
      </div>
      <div className="whyUs_infoContainer">
        {whyUs?.map((why, i) => (
          <WhyUsInfo key={i} why={why} />
        ))}
      </div>
      <hr className="whyUs_top_underline two" />
    </div>
  );
};

export default WhyUs;
