import React from 'react';
import './styles/Home.css';
import logoImage from '../assets/logo.jpg'; 

function Home() {
  return (
    <div className="home-container">
      <div className="home-box">
        <img src={logoImage} alt="Logo" className="home-logo" />
        <p className="home-title">Bem-vindo à página inicial!</p>
        <p className="home-text">Você está logado com sucesso.</p>
      </div>
    </div>
  );
}

export default Home;
