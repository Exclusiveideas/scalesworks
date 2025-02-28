import Image from "next/image";
import "./howItWork.css";

const HowItWork = ({ how, alternate }) => {
  return (
    <div className={`howItWork_wrapper ${alternate && "alternate"}`}>
      <div className="left_wrapper">
        <div className="subLeft_wrapper">
          <h4 className="howTitle">{how?.title}</h4>
          <p className="howDesc">{how?.desc}</p>
        </div>
      </div>
      <div className="right_wrapper">
        <div className="right_imageWrapper">
          <Image
            src={`/images/works/${how?.image}`}
            width={500}
            height={500}
            alt="how it works Image"
            className="worksImg"
          />
        </div>
      </div>
    </div>
  );
};

export default HowItWork;
