import { useState, useRef, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from '../services/axiosConfig';
import { Messages } from 'primereact/messages';
import { useParams } from 'react-router-dom';
import './styles/DetalhesCarona.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import RideDetailsContent from '../components/RideDetailsContent';

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

    const handleRedo = async (e) => {
      //lógica refazer trajeto
      navigate('/caronas')
    }

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
      <div>
        <RideDetailsContent
          ride={ride}
          onPrimaryAction={handleSolicitar}
          primaryActionLabel="Ingressar na Carona"
          onSecundaryAction={handleRedo}
          secundaryActionLabel={"Buscar Este Trajeto"}
          onBack={() => navigate(-1)}
          messagesRef={messagesRef}
        />

        <Messages className='custom-toast' ref={messagesRef} />
      </div>
      
    );
  }

export default DetalhesCarona;
