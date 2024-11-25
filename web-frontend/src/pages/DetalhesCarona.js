import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from '../services/axiosConfig';
import { Messages } from 'primereact/messages';
import { useParams } from 'react-router-dom';
import './styles/DetalhesCarona.css';
import { calculateArrivalTime } from '../components/RideCardFactory';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import MapWithRoute from "../components/MapWithRoute";


function DetalhesCarona() {
    const location = useLocation();
    const { rideId } = useParams();
    const [ride, setRideDetails] = useState(null);
    const [userId, setUserId] = useState('');
    const messagesRef = useRef(null);
    const navigate = useNavigate();
    
    useEffect(() => {
      const loadRideDetails = async () => {
        // Primeira tentativa: dados do state da navegação
        if (location.state?.rideDetails) {
          setRideDetails(location.state.rideDetails);
          // Salvar no localStorage como fallback
          localStorage.setItem(`ride_${rideId}`, JSON.stringify(location.state.rideDetails));
          return;
        }
        
        // Segunda tentativa: localStorage
        const storedRide = localStorage.getItem(`ride_${rideId}`);
        if (storedRide) {
          setRideDetails(JSON.parse(storedRide));
          return;
        }
        
        // Última opção: buscar do backend
        try {
          const response = await axios.get(`/rides/${rideId}`);
          setRideDetails(response.data);
          localStorage.setItem(`ride_${rideId}`, JSON.stringify(response.data));
        } catch (error) {
          console.error('Erro ao buscar detalhes da carona:', error);
        }
      };
      
      loadRideDetails();
    }, [rideId, location.state]);
  
    // Limpar dados do localStorage quando não forem mais necessários
    useEffect(() => {
      return () => {
        localStorage.removeItem(`ride_${rideId}`);
      };
    }, [rideId]);
  
    if (!ride) {
      return <div>Carregando...</div>;
    }

    const handleSolicitar = async (e) => {
      try{
        const token = localStorage.getItem('token');
        
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          setUserId(userId);

          const rideJoinDto = {
            passengerId: userId
          }
    
          const response = await axios.post(`/rides/${ride.rideId}/join`, rideJoinDto);
            
          if (response.status === 200 || response.status === 201) {
            showMessage('success', 'Sucesso:', 'Você ingressou na carona!');
            setTimeout(() => navigate('/home'), 2000);
          } else {
            console.log(response);
            throw new Error('Erro ao realizar cadastro');
          }
        }
      }catch(error){
        console.log('erro: ',error);
        showMessage('error', 'Erro:', error.response?.data || 'Algo deu erradop');
      }
    }

    const formatDuration = (durationInSeconds) => {
      const hours = Math.floor(durationInSeconds / 3600); // Calcula as horas
      const minutes = Math.floor((durationInSeconds % 3600) / 60); // Calcula os minutos restantes
      return `${hours}h ${minutes}m`;
    };

    const capitalizeFirstLetter = (str) => {
      if (!str) return ""; // Verifica se a string é válida
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const showMessage = (severity, summary, detail) => {
      messagesRef.current.clear();
      messagesRef.current.show({
      severity: severity,
      summary: summary,  // Mensagem de resumo
      detail: detail,    // Detalhe do erro
      life: 5000         // Tempo de exibição
      });
  };
  
    return (
      <div className='main-container-carona'>
        <div className='background-box-carona'>

          <div className="">
            <div className="ride-timeline">
              {/* Origem */}
              <div className="ride-point">
                
                <div>
                  <div className="ride-location">{ride.originCity}</div>
                  <div className="ride-description">{ride.originAddress.split(',').slice(0,2)}</div>
                </div>
              </div>

              <div className="ride-time">{ride.time}</div>
              {/* Linha vertical */}
              <div className="ride-connector">
                <div className="horizontal-line"></div>
              </div>
              <div className="ride-time">{calculateArrivalTime(ride.time, ride.duration)}</div>

              {/* Destino */}
              <div className="ride-point">
                
                <div>
                  <div className="ride-location">{ride.destinationCity}</div>
                  <div className="ride-description">{ride.destinationAddress.split(',').slice(0,2)}</div>
                </div>
              </div>
            </div>

            <hr/>

            {/* resumo*/}
            <div className="ride-summary">
              <div className='icone-e-texto-box'>
                <div className="price">R$</div>
                <div className='desc-itens'>{parseFloat(ride.price).toFixed(2)}</div>
              </div>
              
              <div className='icone-e-texto-box'>
                <img 
                  src="/ampulheta.png" 
                  alt="Duração da Viagem" 
                  style={{ width: "30px", height: "30px", marginBottom: "5px" }} 
                />
                <div className='desc-itens'>{formatDuration(ride.duration)}</div>
            </div>

              <div className='icone-e-texto-box'>
                <img 
                  src="/carro.png" 
                  alt="Carro" 
                  style={{ width: "35px", height: "37px", marginRight: "5px" }} 
                />
                <div className='desc-carro'>
                    <div className='desc-itens'>{capitalizeFirstLetter(ride.car.split(' ')[0])} {capitalizeFirstLetter(ride.car.split(' ')[1])}</div>
                    <div style={{ fontSize: "small"}}>{capitalizeFirstLetter(ride.car.split(' ')[2])}</div>
                </div>
            </div>

            <div className='icone-e-texto-box'>
                <img 
                  src="/grupo-de-usuarios.png" 
                  alt="Número de Passageiros" 
                  style={{ width: "35px", height: "35px", marginBottom: "5px" }} 
                />
                <div className='desc-itens'>{ride.numPassengers > 0 ? ride.numPassengers : 0}</div>
            </div>


            </div>
          </div>

          <div>
            <h2>Trajeto</h2>
              <MapWithRoute
                origin={{
                  lat: parseFloat(ride.origin.split(',')[0]),
                  lng: parseFloat(ride.origin.split(',')[1])
                }}
                destination={{
                  lat: parseFloat(ride.destination.split(',')[0]),
                  lng: parseFloat(ride.destination.split(',')[1])
                }}
              />
            </div>
        </div>
        <button type="submit" className='solicitar-button' onClick={() => handleSolicitar()}> Ingressar na Carona </button>

        <button className="home-button" onClick={() => navigate()}> Voltar </button>

        <Messages className='custom-toast' ref={messagesRef} />
      </div>
    );
  }

export default DetalhesCarona;
