import RideDetailsContent from '../components/RideDetailsContent';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from '../services/axiosConfig';
import { Messages } from 'primereact/messages';

function DetalhesMinhasCaronas() {
  const navigate = useNavigate();
  const [ride, setRideDetails] = useState(null);
  const messagesRef = useRef(null);
  const { rideId } = useParams();
  const [userId, setUserId] = useState('');
  const location = useLocation();

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
        const response = await axios.get(`/rides/search_id/${rideId}`);
        console.log('respostadoback: ', response.data)
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

  const handleCancelar = async () => {
    try {
        const response = await axios.post(`/rides/cancel/${rideId}`);
        console.log('respostadoback: ', response.data)
        showMessage('success', 'Sucesso:', 'Carona cancelada!');
      } catch (error) {
        console.error('Erro ao buscar detalhes da carona:', error);
        showMessage('error', 'Erro:', error.response?.data);
      }
  };

  const handleRedo = async () =>{
    //logica
    navigate(`/caronas`, { state: { ride} });
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
    <RideDetailsContent
      ride={ride}
      onPrimaryAction={handleCancelar}
      primaryActionLabel="Cancelar Carona"
      onSecundaryAction={handleRedo}
      secundaryActionLabel="Buscar Este Trajeto"
      onBack={() => navigate(-1)}
      messagesRef={messagesRef}
    />
  );
}

export default DetalhesMinhasCaronas;