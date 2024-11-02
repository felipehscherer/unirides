import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axiosConfig';
import './styles/BuscarCarona.css';

function RideSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/rides/search', { destino: searchTerm });
      setRides(response.data);
    } catch (error) {
      console.error('Erro ao buscar caronas:', error);
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="ride-search-container">
      <form className="ride-search-box" onSubmit={handleSearch}>
        <label htmlFor="searchTerm" className="ride-search-label">Buscar destino</label>
        <input
          id="searchTerm"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite o destino (ex: Avenida)"
          required
        />
        <button type="submit">Buscar</button>
      </form>

      <div className="ride-list">
        {rides.map((ride) => (
          <div key={ride.id} className="ride-item">
            <p><strong>Motorista:</strong> {ride.driver.usuarioEmail}</p>
            <p><strong>Passageiros:</strong> {ride.passengers.length}</p>
            <p><strong>Lugares Disponíveis:</strong> {ride.lugaresDisponiveis}</p>
            <p><strong>Horário de Partida:</strong> {new Date(ride.horarioPartida).toLocaleString()}</p>
            <p><strong>Destino Final:</strong> {ride.destinoFinal}</p>
          </div>
        ))}
      </div>

      <button className="back-home-button" onClick={handleBackToHome}>
        Voltar para a Home
      </button>

    </div>
  );
}

export default RideSearch;
