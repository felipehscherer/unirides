import '../pages/styles/DetalhesCarona.css';
import MapWithRoute from "../components/MapWithRoute";
import { calculateArrivalTime } from '../components/RideCardFactory';
import { Messages } from 'primereact/messages';

const RideDetailsContent = ({
  ride,
  onPrimaryAction,
  primaryActionLabel,
  onSecundaryAction,
  secundaryActionLabel,
  onBack,
  messagesRef
}) => {
  if (!ride) return <div>Carregando...</div>;

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className='main-container-carona'>
      <div className='background-box-carona'>
        <div className="ride-timeline">
          <div className="ride-point">
            <div>
              <div className="ride-location">{ride.originCity}</div>
              <div className="ride-description">{ride.originAddress.split(',').slice(0, 2)}</div>
            </div>
          </div>

          <div className="ride-time">{ride.time}</div>
          <div className="ride-connector">
            <div className="horizontal-line"></div>
          </div>
          <div className="ride-time">{calculateArrivalTime(ride.time, ride.duration)}</div>

          <div className="ride-point">
            <div>
              <div className="ride-location">{ride.destinationCity}</div>
              <div className="ride-description">{ride.destinationAddress.split(',').slice(0, 2)}</div>
            </div>
          </div>
        </div>

        <hr />

        <div className="ride-summary">
          <div className='icone-e-texto-box'>
            <div className="price">R$</div>
            <div className='desc-itens'>{parseFloat(ride.price).toFixed()}</div>
          </div>

          <div className='icone-e-texto-box'>
            <img src="/ampulheta.png" alt="Duração da Viagem" style={{ width: "30px", height: "30px", marginBottom: "5px" }} />
            <div className='desc-itens'>{formatDuration(ride.duration)}</div>
          </div>

          <div className='icone-e-texto-box'>
            <img src="/carro.png" alt="Carro" style={{ width: "35px", height: "37px", marginRight: "5px" }} />
            <div className='desc-carro'>
              <div className='desc-itens'>{capitalizeFirstLetter(ride.car.split(' ')[0])} {capitalizeFirstLetter(ride.car.split(' ')[1])}</div>
              <div style={{ fontSize: "small" }}>{capitalizeFirstLetter(ride.car.split(' ')[2])}</div>
            </div>
          </div>

          <div className='icone-e-texto-box'>
            <img src="/grupo-de-usuarios.png" alt="Número de Passageiros" style={{ width: "35px", height: "35px", marginBottom: "5px" }} />
            <div className='desc-itens'>{ride.numPassengers - 1 || 0} passageiro(s)</div>
          </div>

          <div className='icone-e-texto-box'>
            <img src="/assento.png" alt="Número de Vagas" style={{ width: "35px", height: "35px", marginBottom: "5px" }} />
            <div className='desc-itens'>{ride.freeSeatsNumber >= ride.numPassengers
            ? ride.freeSeatsNumber - ride.numPassengers + 1 
            : ride.numPassengers - ride.numPassengers + 1} vaga(s)</div>
          </div>
        </div>

        <div>
          <MapWithRoute
            origin={{ lat: parseFloat(ride.origin.split(',')[0]), lng: parseFloat(ride.origin.split(',')[1]) }}
            destination={{ lat: parseFloat(ride.destination.split(',')[0]), lng: parseFloat(ride.destination.split(',')[1]) }}
          />
        </div>
      </div>

      <button type="button" className='solicitar-button' onClick={onPrimaryAction}>
        {primaryActionLabel}
      </button>

      <button type='button' className='trajeto-button' onClick={onSecundaryAction}>
        {secundaryActionLabel}
      </button>

      <button className="back-home-button" onClick={onBack}>
        Voltar
      </button>

      <Messages className='custom-toast' ref={messagesRef} />
    </div>
  );
};

export default RideDetailsContent;
