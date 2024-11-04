import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';
import logoImage from '../assets/logo.jpg';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-box">
        <img src={logoImage} alt="Logo" className="home-logo" />
        <p className="home-title">Bem-vindo à página inicial!</p>
        <p className="home-text">Você está logado com sucesso.</p>
        <div className="button-group">
          <button
              className="home-button"
              onClick={() => navigate('/perfil')}
          >
            Meu Perfil
          </button>
          
          <button
              className="home-button"
              onClick={() => navigate('/caronas')}
          >Procurar Caronas</button>

          <button
              className="home-button"
              onClick={() => navigate('/cadastro-carona')}
          >Oferecer Caronas</button>

          <button
              className="home-button"
              onClick={() => navigate('/horarios-onibus')}
          >
            Horários de Ônibus
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
