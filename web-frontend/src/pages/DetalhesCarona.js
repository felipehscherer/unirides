import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from '../services/axiosConfig';
import { Messages } from 'primereact/messages';
import { RideSearchRequestBuilder } from '../components/RideSearchRequestBuilder.js';
import { useParams } from 'react-router-dom';

function DetalhesCarona() {
    const location = useLocation();
    const { rideId } = useParams();
    const [rideDetails, setRideDetails] = useState(null);
    
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
  
    if (!rideDetails) {
      return <div>Carregando...</div>;
    }
  
    return (
      <div>
        <h1>Detalhes da Carona</h1>
        <div>Origem: {rideDetails.originAddress}</div>
        <div>Destino: {rideDetails.destinationAddress}</div>
        {/* ... outros detalhes ... */}
      </div>
    );
  }

export default DetalhesCarona;
