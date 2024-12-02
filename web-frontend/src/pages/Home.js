import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';
import logoImage from '../assets/logo.jpg';
import axios from '../services/axiosConfig';


function Home() {
  const navigate = useNavigate();
  const [isDriver, setIsDriver] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/user/driver-info');
        const data = response.data;
        setIsDriver(data.isDriver)
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        if (error.response && error.response.status === 401) {
          //navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

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
          >Procurar Caronas
          </button>

          <button
              className="home-button"
              onClick={() => navigate('/cadastro-carona')}
              disabled={!isDriver}
              style={{
                backgroundColor: isDriver ? "#089F08" : "#ddd", // Estilo visual
                color: isDriver ? "white" : "#aaa",
                cursor: isDriver ? "pointer" : "not-allowed",
              }}
          >Oferecer Caronas
          </button>

          <button
              className="home-button"
              onClick={() => navigate('/rotas-onibus')}
          >
            Rotas de Ônibus
          </button>
          <button
              className="home-button"
              onClick={() => navigate('/onibus/horarios/alegrete')}
          >
            Horários de Ônibus
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
