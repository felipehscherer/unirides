import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/HomePage.css';
import logo from '../assets/logomarca1.svg';


const HomePage = () => {
    const navigate = useNavigate();
    return (
      <div className="container">
        <header className="header">
        <div className="logo">
        <img src={logo} alt="Unirides Logo" className="logo-image" />
        </div>
{/*           <div className="logo">Unirides</div> */}
          <nav className="nav">
            <a href="#instagram">Fundadores</a>
            <a href="#contato">Contato</a>
          </nav>
        </header>
  
        <main className="main-content">
        <img
          src={logo}
          alt="Logo ou Banner"
          className="main-image"
        /> 
{/*           <h1>De Universitários, Para Universitários: Sua Carona Começa Aqui!</h1> */}
          <p class="justificado">
          Unirides conecta universitários para transformar a mobilidade. 
          Economize, compartilhe e faça parte de uma comunidade que acredita que juntos podemos ir mais longe. 
          Sua carona, sua escolha, nosso caminho compartilhado.
          </p>
          <div className="actions">
            <button className="btn-primary" onClick={() => navigate('/login')}>Acessar Conta</button>
            <button className="btn-secondary" onClick={() => navigate('/cadastro')}>Criar Conta</button>
          </div>
        </main>
      </div>
    );
  };
  
  export default HomePage;
  