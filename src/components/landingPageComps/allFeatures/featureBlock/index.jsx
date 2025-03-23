import './featureBlock.css';

const FeatureBlock = ({ feature }) => {
    const { Icon, name, desc } = feature
  return (
    <div className='featureBlock_wrapper'>
        <Icon className="featureBlock_icon" />
        <p className="featureBlock_name">{name}</p>
        <p className="featureBlock_desc">{desc}</p>
    </div>
  )
}

export default FeatureBlock