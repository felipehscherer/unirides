import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axiosConfig';
import './styles/BuscarCarona.css';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Messages } from 'primereact/messages';
import "react-datepicker/dist/react-datepicker.css";

function RideSearch() {
  const [rides, setRides] = useState([]);
  const [originPosition, setOriginPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const navigate = useNavigate();
  const messagesRef = useRef(null);

  const handleSearch = async (e) => {
    await getRideInfos();
    const dataToSend = {
      origin: `${originPosition.lat},${originPosition.lng}`,
      destination: `${destinationPosition.lat},${destinationPosition.lng}`,  
      originAddress: originAddress,
      destinationAddress: destinationAddress,
    }

    try {
      const response = await axios.post('/rides/search', dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setRides(response.data);
    } catch (error) {
      console.error('Erro ao buscar caronas:', error);
      showError('error', 'Erro:', 'Erro ao buscar caronas.');
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const showError = (severity, summary, detail) => {
    messagesRef.current.clear();
    messagesRef.current.show({
    severity: severity,
    summary: summary,  // Mensagem de resumo
    detail: detail,    // Detalhe do erro
    life: 5000         // Tempo de exibição
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

  const handleOriginSelect = async (address) => {
    setOriginValue(address, false);
    clearOriginSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setOriginPosition({ lat, lng });
    } catch (error) {
      console.error("Erro ao obter a geolocalização:", error);
      showError('error', 'Erro:', 'Erro ao obter a geolocalização');
    }
  };

  const handleDestinationSelect = async (address) => {
    setDestinationValue(address, false);
    clearDestinationSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setDestinationPosition({ lat, lng });
    } catch (error) {
      console.error("Erro ao obter a geolocalização:", error);
      showError('error', 'Erro:', 'Erro ao obter a geolocalização');
    }
  };

  const getRideInfos = async () => {
    if (!originPosition || !destinationPosition) {
        showError('warn', 'Alerta:', 'Preencha todos os campos!');
        return false;
    }

    const origin = `${originPosition.lat},${originPosition.lng}`;
    const destination = `${destinationPosition.lat},${destinationPosition.lng}`;
        
    try {
        console.log('Enviando requisição para calcular distância');
        console.log('Origin:', origin);
        console.log('Destination:', destination);

        const { data } = await axios.get('/api/distance', {
            params: {
                origin,
                destination
            },
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log('Resposta recebida:', data);

        if (!data || !data.rows || !data.rows[0] || !data.rows[0].elements || !data.rows[0].elements[0]) {
            showError('error', 'Erro:', 'Resposta inválida do servidor');
            return false;
        }

        const element = data.rows[0].elements[0];
        if (element.status === "OK") {
            setOriginAddress(data.origin_addresses[0])
            setDestinationAddress(data.destination_addresses[0])
            return true;
        } else {
            showError('error', 'Erro:', 'Não foi possível calcular a distância');
            return false;
        }
    } catch (error) {
        console.error("Erro ao calcular a distância:", error);
        console.error("Detalhes do erro:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        const errorMessage = error.response?.data?.message || 
                           'Não foi possível calcular a distância';
        
        showError('error', 'Erro:', errorMessage);
        return false;
    }
};

  return (
    <div className="ride-registration">

      <div className='address-icon-box'>
        {/* Campo de origem */}
      <input style={{marginBottom: '0.5rem'}}
          value={originValue || ""}
          onChange={(e) => {
            setOriginValue(e.target.value);
            if (e.target.value === "") {
              clearOriginSuggestions();
            }
          }}
          placeholder="Endereço de Origem"
        />
        
        {/* Renderize a lista de sugestões apenas quando houver dados */}
        {originValue && oStatus === "OK" && oData.length > 0 && (
        <div className="suggestions-list">
            {oData.map((suggestion, index) => (
            <div
                key={suggestion.place_id || index}
                onClick={() => handleOriginSelect(suggestion.description)}
                className="suggestion-item"
            >
                {suggestion.description}
            </div>
            ))}
        </div>
        )}
      </div>
  
        <div className='address-icon-box'>
          {/* Campo de destino */}
        <input style={{marginBottom: '0.5rem'}}
          value={destinationValue || ""}
          onChange={(e) => {
            setDestinationValue(e.target.value);
            if (e.target.value === "") {
              clearDestinationSuggestions();
            }
          }}
          placeholder="Endereço de Destino"
        />
        
            {/* Renderize a lista de sugestões apenas quando selecionado */}
            {destinationValue && dStatus === "OK" && dData.length > 0 && (
        <div className="suggestions-list">
            {dData.map((suggestion, index) => (
            <div
                key={suggestion.place_id || index}
                onClick={() => handleDestinationSelect(suggestion.description)}
                className="suggestion-item"
            >
                {suggestion.description}
            </div>
            ))}
        </div>
        )}
        </div>

        <button type="submit" className='buscar-carona-box-button' onClick={() => handleSearch()}>
          Buscar Carona</button>
      
      <div className="ride-list">
      {rides.map(ride => (
        <div key={ride.id} className="ride-item">
            <h3>Caronas para {ride.origintionAddress}</h3>
            <p><strong>Origem:</strong> {ride.origin}</p>
            <p><strong>Endereço de Origem:</strong> {ride.originAddress}</p>
            <p><strong>Endereço de Destino:</strong> {ride.destinationAddress}</p>
            <p><strong>Preço:</strong> {ride.price}</p>
            <p><strong>Motorista:</strong> {ride.driverName}</p>
            <p><strong>Vagas Disponíveis:</strong> {ride.FreeSeatsNumber}</p>
            <p><strong>Data:</strong> {ride.date}</p>
        </div>//horario, duração, distancia, 
      ))}
      </div>

      <button className="back-home-button" onClick={handleBackToHome}>
        Voltar para a Home
      </button>
      <Messages className='custom-toast' ref={messagesRef} />
    </div>
  );
}

export default RideSearch;
