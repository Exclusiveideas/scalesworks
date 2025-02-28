import './serveCard.css';

const ServeCard = ({ who }) => {
  return (
    <div className='serveCard_wrapper'>
        <h3 className="card_title">{who?.name}</h3>
        <p className="card_how">{who?.how}</p>
    </div>
  )
}

export default ServeCard