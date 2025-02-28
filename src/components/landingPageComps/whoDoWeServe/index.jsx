import ServeCard from "../serveCard";
import "./whoDoWeServe.css";

const whoWeServe = [
  {
    name: "Law Firms & Legal Teams",
    img: "",
    how: `Law firms juggle high-stakes cases, tight deadlines, and mountains of paperwork. Reviewing contracts, conducting legal research, and transcribing client meetings can consume valuable hours. Our AI streamlines these tasks—automating document structuring, speeding up research, and ensuring accurate transcription—so your team can focus on strategy and client advocacy, not repetitive administrative work.`,
  },
  {
    name: "In-House Counsel",
    img: "",
    how: `Corporate legal departments deal with contracts, compliance, and regulatory risks daily. Our AI helps legal teams quickly analyze documents, identify key clauses, and extract relevant legal insights—reducing the time spent reviewing complex agreements. Whether responding to regulatory inquiries or managing contract lifecycles, our platform ensures nothing gets overlooked.`,
  },
  {
    name: "Compliance & Regulatory Experts",
    img: "",
    how: `Navigating compliance requirements is a never-ending challenge. Regulations evolve constantly, and missing critical updates can mean costly penalties. Our AI assists compliance teams by analyzing documents against current laws and identifying areas of concern—ensuring your organization stays ahead of regulatory changes while minimizing risks.`,
  },
  {
    name: "Legal Researchers & Academics",
    img: "",
    how: `Legal research can be tedious, requiring endless hours combing through case law, statutes, and academic journals. Our platform sifts through large volumes of legal text, highlighting key precedents and summarizing relevant legal arguments. Whether you're writing a research paper, analyzing case studies, or preparing an argument, our AI accelerates the process and provides structured insights.`,
  },
  {
    name: "Independent Lawyers & Legal Consultants",
    img: "",
    how: `Solo practitioners and consultants don’t have the luxury of large legal teams, but they still need fast, reliable research and document automation. Our AI levels the playing field—helping independent lawyers draft contracts, analyze legal documents, and find case law without the overhead of a full firm. Spend less time on paperwork and more time on high-value client work.`,
  },
];

const WhoDoWeServe = () => {
  return (
    <div id='who-do-we-serve' className="whoDoWeServe_wrapper">
      <div className="serve_topContainer">
        <h3 className="whoDoWeServe_title">Who Do We Serve?</h3>
        <p>
          Designed for legal professionals who need speed, precision, and
          AI-driven efficiency.
        </p>
      </div>
      <div className="serve_cardsWrapper">
        {whoWeServe?.map((who, i) => (
          <ServeCard who={who} key={i} />
        ))}
      </div>
      <div className="centre_blob_serve"></div>
    </div>
  );
};

export default WhoDoWeServe;
