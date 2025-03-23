import Image from "next/image";
import "./modelOverview.css";

const ModelOverview = ({ model }) => {
  return (
    <a href={`/platform/${model?.link}`} className="modelOverview">
      <div className="image_container">
        <Image
          src={`/images/${model?.image}`}
          width={700}
          height={700}
          alt="Picture of AI model"
          className="modelImage"
        />
      </div>
      <div className="info_container">
        <p className="model_title">{model?.title}</p>
        <p className="model_description">{model?.description}</p>
      </div>
    </a>
  );
};

export default ModelOverview;
