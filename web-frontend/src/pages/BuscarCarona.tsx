import React, { useState, useRef } from 'react';
import axios from '../services/axiosConfig';
import { useNavigate } from 'react-router-dom';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Messages } from 'primereact/messages';
import { RideCardFactory } from "../components/RideCardFactory";
import { RideSearchRequestBuilder } from '../components/RideSearchRequestBuilder';
import { Search, MapPin } from 'lucide-react';
import './styles/BuscarCarona.css';

interface Position {
  lat: number;
  lng: number;
}

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

const BuscarCarona: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [originPosition, setOriginPosition] = useState<Position | null>(null);
  const [destinationPosition, setDestinationPosition] = useState<Position | null>(null);
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const navigate = useNavigate();
  const messagesRef = useRef<any>(null);

  const handleSearch = async () => {
    try {
      const rideInfo = await getRideInfos();
      
      if (!rideInfo.success) {
        return;
      }

      const { originAddress: newOriginAddress, destinationAddress: newDestinationAddress } = rideInfo;

      const dataToSend = new RideSearchRequestBuilder()
        .setOrigin(originPosition?.lat, originPosition?.lng)
        .setDestination(destinationPosition?.lat, destinationPosition?.lng)
        .setAddresses(newOriginAddress, newDestinationAddress)
        .build();

      const response = await axios.post('/rides/search', dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setRides(response.data);
      
      setOriginAddress(newOriginAddress);
      setDestinationAddress(newDestinationAddress);
    } catch (error: any) {
      if (Array.isArray(error.response?.data) && error.response.data.length === 0) {
        showMessage('warn', 'Aviso', 'Nenhuma carona encontrada');
      } else {
        showMessage('error', 'Erro:', 'Erro ao buscar caronas.');
      }
    }
  };

  const showMessage = (severity: string, summary: string, detail: string) => {
    messagesRef.current?.show({
      severity,
      summary,
      detail,
      life: 5000
    });
  };

  const {
    value: originValue,
    suggestions: { status: oStatus, data: oData },
    setValue: setOriginValue,
    clearSuggestions: clearOriginSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const {
    value: destinationValue,
    suggestions: { status: dStatus, data: dData },
    setValue: setDestinationValue,
    clearSuggestions: clearDestinationSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const handleOriginSelect = async (address: string) => {
    setOriginValue(address, false);
    clearOriginSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setOriginPosition({ lat, lng });
    } catch (error) {
      showMessage('error', 'Erro:', 'Erro ao obter a geolocalização');
    }
  };

  const handleDestinationSelect = async (address: string) => {
    setDestinationValue(address, false);
    clearDestinationSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setDestinationPosition({ lat, lng });
    } catch (error) {
      showMessage('error', 'Erro:', 'Erro ao obter a geolocalização');
    }
  };

  const getRideInfos = async () => {
    if (!originPosition || !destinationPosition) {
      showMessage('warn', 'Alerta:', 'Preencha todos os campos!');
      return { success: false };
    }

    const origin = `${originPosition.lat},${originPosition.lng}`;
    const destination = `${destinationPosition.lat},${destinationPosition.lng}`;
        
    try {
      const { data } = await axios.get('/api/distance', {
        params: {
          origin,
          destination
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!data || !data.rows || !data.rows[0] || !data.rows[0].elements || !data.rows[0].elements[0]) {
        showMessage('error', 'Erro:', 'Resposta inválida do servidor');
        return { success: false };
      }

      const element = data.rows[0].elements[0];
      if (element.status === "OK") {
        return {
          success: true,
          originAddress: data.origin_addresses[0],
          destinationAddress: data.destination_addresses[0]
        };
      } else {
        showMessage('error', 'Erro:', 'Não foi possível buscar os endereços');
        return { success: false };
      }
    } catch (error) {
      console.error("Erro ao buscar distância:", error);
      return { success: false };
    }
  };

  return (
    <div className="buscar-carona-container">
      <h1 className="buscar-carona-title">Buscar Carona</h1>
      
      <div className="search-inputs">
        <div className="input-container">
          <MapPin className="input-icon" />
          <input
            value={originValue}
            onChange={(e) => setOriginValue(e.target.value)}
            placeholder="Endereço de Origem"
            className="address-input"
          />
          {originValue && oStatus === "OK" && (
            <ul className="suggestions-list">
              {oData.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleOriginSelect(suggestion.description)}
                  className="suggestion-item"
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="input-container">
          <MapPin className="input-icon" />
          <input
            value={destinationValue}
            onChange={(e) => setDestinationValue(e.target.value)}
            placeholder="Endereço de Destino"
            className="address-input"
          />
          {destinationValue && dStatus === "OK" && (
            <ul className="suggestions-list">
              {dData.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleDestinationSelect(suggestion.description)}
                  className="suggestion-item"
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button onClick={handleSearch} className="search-button">
        <Search className="search-icon" />
        Buscar Carona
      </button>

      <div className="ride-list">
        {rides.map((ride: Ride) => (
          <RideCardFactory key={ride.rideId} ride={ride} navigate={navigate}/>
        ))}
      </div>

      <button className="back-to-home-button" onClick={() => navigate('/home')}>
        Voltar para a Home
      </button>

      <Messages ref={messagesRef} className="custom-toast" />
    </div>
  );
};

export default BuscarCarona;

