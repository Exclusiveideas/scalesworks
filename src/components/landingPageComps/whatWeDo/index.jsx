import HowItWork from "../howItWork";
import "./whatWeDo.css";

const howItWorks = [
  {
    title: "Ask Legal Questions",
    image: "ask.svg",
    desc: `Some answers take hours to research. Others just need the right question.
Instead of spending endless hours pouring over legal texts or outdated case law, our system pinpoints exactly what you need. It translates your query into targeted insights by sifting through extensive legal databases and nuances—giving you clarity where it matters most.`,
  },
  {
    title: "Upload Documents for Automation",
    image: "automation.svg",
    desc: `Your document is more than just ink on paper—it’s a blueprint of intent.
When you upload a file, the AI dives into its structure, identifying key clauses and organizational patterns. This isn’t about a simple reformat; it’s a transformation that restructures your document, enhancing readability and making it primed for further legal analysis.`,
  },
  {
    title: "Transcribe Legal Audio",
    image: "transcription.svg",
    desc: `Spoken words carry nuance that text alone can’t capture.
Our transcription service goes beyond basic conversion. It recognizes tone, emphasis, and context—ensuring that every detail from depositions, hearings, or legal discussions is preserved in a searchable and detailed text format.

`,
  },
  {
    title: "Conduct Legal Research",
    image: "conduct.svg",
    desc: `Not every piece of information carries equal weight, and context is key.
By analyzing your uploaded content, the AI distinguishes between critical legal precedents and less relevant details. It pulls the insights that truly matter from a sea of data—helping you build a robust legal strategy without getting lost in the noise.`,
  },
  {
    title: "Get Instant AI Assistance",
    image: "assistant.svg",
    desc: `Your documents hold answers—if you ask the right way.
Interact directly with your content to uncover hidden insights. Whether you’re questioning a clause or seeking a deeper dive into legal principles, the platform offers context-aware, nuanced responses that align with your specific needs.`,
  },
];

const HowItWorkSection = () => {
  return ( 
    <div id='how-it-works' className="whatWeDo_wrapper">
      <div className="innerWrapper">
        <div className="top">
          <h3 className="whatWeDo_title">How it works</h3>
          <p>
            Transform the way you handle legal work with AI-powered efficiency.
          </p>
        </div>
        <div className="howItworks_components_wrapper">
          {howItWorks?.map((how, i) => (
            <HowItWork key={i} how={how} alternate={i % 2 ? true : false} />
          ))}
          <hr className="vertical-centreLine" />
        </div>
      </div>
    </div>
  );
};

export default HowItWorkSection;
