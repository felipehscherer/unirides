import React from 'react';

export const RideCardFactory = (ride) => {
  return (
    <div key={ride.id} className="ride-item">
      <p><strong>Endereço de Origem:</strong> {ride.originAddress}</p>
      <p><strong>Endereço de Destino:</strong> {ride.destinationAddress}</p>
      <p><strong>Preço:</strong> {ride.price ? parseFloat(ride.price).toFixed(2) : "N/A"}</p>
      <p><strong>Motorista:</strong> {ride.driverName}</p>
      <p><strong>Vagas Disponíveis:</strong> {ride.freeSeatsNumber}</p>
      <p><strong>Data:</strong> {ride.date}</p>
    </div>
  );
};