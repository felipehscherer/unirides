import React from 'react';
import './RideCard.css';

export const RideCardFactory = ({ ride, navigate }) => {
  const handleViewDetails = () => {
    navigate(`/caronas/${ride.rideId}`, {
      state: { rideDetails: ride },
    });
  };

  const calculateArrivalTime = (time, durationInSeconds) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setSeconds(date.getSeconds() + durationInSeconds);
    const arrivalHours = date.getHours().toString().padStart(2, "0");
    const arrivalMinutes = date.getMinutes().toString().padStart(2, "0");
    return `${arrivalHours}:${arrivalMinutes}`;
  };

  return (
    <div key={ride.id} className="ride-card">
      <div className="ride-card-header">
        <img src={ride.driverPhotoUrl || "default-profile.jpg"} alt="Foto do Motorista" className="driver-photo" />
        <div className="driver-info">
          <h3>{ride.driverName}</h3>
        </div>
      </div>
      <div className="ride-card-body">
        <p>
          <strong>Origem:</strong> {ride.originCity ? ride.originCity : "Cidade de origem"}
        </p>
        <p>
          <strong>Destino:</strong> {ride.destinationCity ? ride.destinationCity : "Cidade de destino"}
        </p>
        <p>
          <strong>Data:</strong> {ride.date ? ride.date : "Data"}
        </p>
        <p>
          <strong>Horário de Saída:</strong> {ride.time}
        </p>
        <p>
          <strong>Horário de Chegada:</strong> {calculateArrivalTime(ride.time, ride.duration)}
        </p>
        <p>
          <strong>Vagas:</strong> {ride.freeSeatsNumber}
        </p>
        <p>
          <strong>Preço:</strong> R$ {ride.price ? parseFloat(ride.price).toFixed(2) : "N/A"}
        </p>
      </div>
      <div className="ride-card-footer">
        <button className="details-button" onClick={handleViewDetails}>
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};