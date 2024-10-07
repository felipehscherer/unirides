import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link
import './styles/Home.css';
import logoImage from '../assets/logo.jpg';

function Home() {
  return (
    <div className="home-container">
      <div className="home-box">
        <img src={logoImage} alt="Logo" className="home-logo" />
        <p className="home-title">Bem-vindo à página inicial!</p>
        <p className="home-text">Você está logado com sucesso.</p>

        {/* Botão para navegar para a página de cadastro de motorista */}
        <Link to="/cadastromotorista">
          <button className="cadastro-button">Cadastrar Motorista</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
