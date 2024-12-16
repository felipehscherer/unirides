import React from 'react';
import { Calendar, Clock, DollarSign, Users, Armchair } from 'lucide-react';
import { NavigateFunction } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Ride {
  rideId: string;
  driverPhotoUrl?: string;
  driverName: string;
  originCity?: string;
  destinationCity?: string;
  date?: string;
  time: string;
  duration: number;
  freeSeatsNumber: number;
  numPassengers: number;
  price?: string;
}

// Função para calcular o horário de chegada
export const calculateArrivalTime = (time: string, durationInSeconds: number): string => {
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

interface RideCardFactoryProps {
  ride: Ride;
  navigate: NavigateFunction;
}

export const RideCardFactory: React.FC<RideCardFactoryProps> = ({ ride, navigate }) => {
  if (!ride) {
    return null;
  }

  const handleViewDetails = () => {
    navigate(`/caronas/${ride.rideId}`, {
      state: { rideDetails: ride },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 w-full max-w-md mx-auto">
      {/* Header com imagem do motorista e informações principais */}
      <div className="flex items-center mb-4">
        <img
          src={ride.driverPhotoUrl || "default-profile.jpg"}
          alt="Foto do Motorista"
          className="w-16 h-16 rounded-full object-cover border border-gray-300 mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">{ride.driverName.split(' ')[0] || 'Motorista'}</h3>
          <span className="text-sm text-gray-500">Viagem confiável</span>
        </div>
      </div>
      
      <hr className="my-4" />

      {/* Corpo com detalhes da carona */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          {ride.originCity || 'Origem'} <ArrowRight size={20} className="inline mx-2" /> {ride.destinationCity || 'Destino'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2 text-gray-500" />
            <span>{ride.date ? new Date(ride.date).toLocaleDateString() : 'Data não informada'}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-gray-500" />
            <span>{ride.time || 'Horário não informado'}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-gray-500" />
            <span>Chegada: {calculateArrivalTime(ride.time, ride.duration)}</span>
          </div>
          <div className="flex items-center">
            <Armchair size={16} className="mr-2 text-gray-500" />
            <span>{ride.freeSeatsNumber - ride.numPassengers || 0} vaga(s)</span>
          </div>

          <div className="flex items-center">
            <Users size={16} className="mr-2 text-gray-500" />
            <span>{ride.numPassengers || 0} passageiro(s)</span>
          </div>
          
          <div className="flex items-center">
            <DollarSign size={16} className="mr-2 text-gray-500" />
            <span>R$ {ride.price ? parseFloat(ride.price).toFixed() : 'N/A'}</span>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* Rodapé com botão de detalhes */}
      <div className="text-center">
        <button
          onClick={handleViewDetails}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 w-full"
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

