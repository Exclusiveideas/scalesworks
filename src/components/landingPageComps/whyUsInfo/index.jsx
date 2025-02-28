import "./whyUsInfo.css";

const WhyUsInfo = ({ why }) => {
  const { why: whyTxt, Icon } = why;
  return (
    <div id='why-us' className="whyUsInfo_wrapper">
      <div className="whyUsIcon_wrapper">
        <Icon className="whyUS_icon" />
      </div>
      <p>{whyTxt}</p>
    </div>
  );
};

export default WhyUsInfo;
