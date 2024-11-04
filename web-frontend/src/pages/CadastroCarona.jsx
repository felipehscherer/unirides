import React, { useState, useRef } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { GoogleMap, Marker } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/CadastroCarona.css"
import axios from '../services/axiosConfig';
import { Messages } from 'primereact/messages';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';


const CadastroCarona = () => {
    const [isConfirmarEnabled, setIsConfirmarEnabled] = useState(false);
    const [originPosition, setOriginPosition] = useState(null);
    const [destinationPosition, setDestinationPosition] = useState(null);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState("");
    const [passengers, setPassengers] = useState(null);
    const [suggestedPrice, setSuggestedPrice] = useState("");
    const [distanceInKm, setDistanceInKm] = useState(null)
    const [duration, setDuration] = useState(null)
    const [errorMessage, setErrorMessage] = useState('');
    const messagesRef = useRef(null);

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
      }
    };

    const handleMapClickOrigin = (event) => {
        setOriginPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        });
    };

    const handleMapClickDestination = (event) => {
        setDestinationPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        });
    };

    const calculateDistanceAndSuggestPrice = async () => {
        if (!originPosition || !destinationPosition) {
            showError('warn', 'Alerta:', 'Preencha todos os campos!');
            return false;
        }
    
        const origin = `${originPosition.lat},${originPosition.lng}`;
        const destination = `${destinationPosition.lat},${destinationPosition.lng}`;
            
        try {
            // Adicionar logs para debug
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
                    // Se necessário, adicione o token de autorização
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            console.log('Resposta recebida:', data);
    
            if (!data || !data.rows || !data.rows[0] || !data.rows[0].elements || !data.rows[0].elements[0]) {
                showError('error', 'Erro:', 'Resposta inválida do servidor');
                return false;
            }
    
            const element = data.rows[0].elements[0];
    
            if (element.status === "OK") {
                setDuration(element.duration.text);
                setDistanceInKm(element.distance.text);
                setSuggestedPrice(calculatePrice(element.distance.value/1000));
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
      
    // Função para calcular o preço baseado na distância
    const calculatePrice = (distanceInKm) => {
      const basePrice = 0.75; // Base mínima
      const pricePerKm = 0.3; // Taxa por km
      return (basePrice + pricePerKm * distanceInKm);
    };

    const handleOkClick = async () => {
        if (!originPosition || !destinationPosition || !date || !time || !passengers) {
            showError('warn', 'Alerta:', 'Preencha todos os campos!');
            return;
        }else if(passengers > 4){
            showError('warn', 'Alerta:', 'Muitos passageiros, máximo 4!');
            return;
        }
        if(await calculateDistanceAndSuggestPrice()){
            setIsConfirmarEnabled(true);
        }
    };

    const handleAgendarCarona = async () =>{
        if (!originPosition || !destinationPosition || !date || !time || !passengers) {
            showError('warn', 'Alerta:', 'Preencha todos os campos!');
            return;
        }else if(passengers > 4){
            showError('warn', 'Alerta:', 'Muitos passageiros, máximo 4!');
            return;
        }
        
        const dataToSend = {
            origin: originPosition,
            destination: destinationPosition,
            date: date,
            time: time,
            passengersNumber: passengers,
            price: suggestedPrice,
            distance: distanceInKm,
            duration: duration
        }

        try {
            await axios.post('/home/cadastro-carona', dataToSend);
            showError('success', 'Sucesso:', 'Cadastro realizado!');
            //navigate('/login');
          } catch (error) {
            if (error.response && error.response.status === 403) {
              const errorMsg = error.response.data; 
              setErrorMessage(errorMsg);
              showError('error', 'Erro:', errorMessage);  // Exibe o erro do backend
            }else{
              showError('error', 'Erro:', "Algo deu errado..");
            }
          }
    };
  
    return (
      <div className="ride-registration">
        <h2>Cadastro de Carona</h2>
        
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
  
        {/* Mapa para origem */}
        {originPosition && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "200px" }}
            zoom={14}
            center={originPosition}
            onClick={handleMapClickOrigin}
          >
            <Marker position={originPosition} />
          </GoogleMap>
        )}
  
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
        
            {/* Renderize a lista de sugestões apenas quando houver dados */}
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
  
        {/* Mapa para destino */}
        {destinationPosition && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "200px" }}
            zoom={14}
            center={destinationPosition}
            onClick={handleMapClickDestination}
          >
            <Marker position={destinationPosition} />
          </GoogleMap>
        )}
  
        <div className="data-hora-box">
          <div className="input-data">
            <DatePicker placeholderText="Data da viagem" selected={date} onChange={(date) => setDate(date)} />
          </div>
          <input
            style={{ width: "90px" }}
            placeholder="Horário"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <input
            style={{ width: "150px", marginLeft: "10px" }}
            type="number"
            max={4}
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            placeholder="Nº de Passageiros"
          />
        
            <button class="circle-button" onClick={handleOkClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check">
                    <path d="M20 6L9 17l-5-5" />
                </svg>
            </button>
        </div>

        {/* Exibir distância e preço, quando disponíveis */}
        {isConfirmarEnabled && (
                <div>
                    <h4>Distância: {distanceInKm}</h4>
                    <h4>Duração: {duration}</h4>
                    <h4>Preço: R$ {suggestedPrice.toFixed(2)}</h4>
                </div>
        )}
        
        <button 
            className="confirmar-carona-button"
            type="submit"
            onClick={handleAgendarCarona}
            disabled={!isConfirmarEnabled} // O botão estará desativado se isButtonEnabled for falso
            style={{
                backgroundColor: isConfirmarEnabled ? "#4CAF50" : "#ddd", // Estilo visual
                color: isConfirmarEnabled ? "white" : "#aaa",
                cursor: isConfirmarEnabled ? "pointer" : "not-allowed",
            }}>
            Agendar Carona
      </button>

      <Messages className='custom-toast' ref={messagesRef} />

      </div>
    );
  };

export default CadastroCarona;