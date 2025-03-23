import './hero.css';
import WaitListForm from './waitListForm';

const Hero = () => {
  return (
    <div className='hero_wrapper'>
        <h3 className="hero_subBigTxt">Scaleworks</h3>
        <h3 className="hero_bigTxt">The First AI Legal Assistant</h3>
        <p className="hero_tagline">Recapture billable hours, improve client satisfaction, increase revenue.</p>
        <WaitListForm />
    </div>
  ) 
}

export default Hero 