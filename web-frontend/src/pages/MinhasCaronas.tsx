import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, DollarSign, User, Search, Filter, Repeat} from 'lucide-react';
import axios from '../services/axiosConfig';
import { useNavigate} from 'react-router-dom';
import { jwtDecode, JwtPayload } from "jwt-decode"; // tipagem correta para JWT para usar com ts

interface CaronaTransform {
  rideId: string;
  originCity: string;
  destinationCity: string;
  date: string;
  time: string;
  price: string;
  driverName: string;
  status: number;
  driver: boolean;
}

interface Carona{
  car: string;
  date: string;
  destination: string;
  destinationAddress: string;
  destinationCity: string;
  distance: string;
  driverName: string;
  duration: string;
  freeSeatsNumber: 1;
  numPassengers: 1;
  origin: string;
  originAddress: string;
  originCity: string;
  price: string;
  rideId: string;
  status: string;
  time: string;
  driver: boolean;
}

const MinhasCaronas: React.FC = () => {
  const [caronas, setCaronas] = useState<Carona[]>([]);
  const [filteredCaronas, setFilteredCaronas] = useState<CaronaTransform[]>([]);
  const [transformedCaronas, setTransformedCaronas] = useState<CaronaTransform[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [driverFilter, setDriverFilter] = useState('all');
  const [userId, setUserId] = useState('');
  const messagesRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getRides = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const decoded = jwtDecode<JwtPayload & { userId: string }>(token);
          const userId = decoded.userId;
  
          setUserId(userId);
  
          const response = await axios.get<Carona[]>(`/rides/history/${userId}`);
          console.log(response.data);

        // Atualiza o estado original
        setCaronas(response.data);

        // Transforma os dados e atualiza o estado transformado
        const transformed = transformCaronas(response.data);
        setTransformedCaronas(transformed);
        setFilteredCaronas(transformed);
        }
      } catch (error: any) {
        console.error('Erro ao buscar as caronas:', error.message);
        showMessage('error', 'Erro:', 'Erro ao buscar caronas.');
      }
    };
  
    getRides();
  }, []);

  const transformCaronas = (caronas: Carona[]): CaronaTransform[] => {
    const statusMap: { [key: string]: number } = {
      ABERTA: 0,
      EM_PROGRESSO: 1,
      CONCLUIDA: 2,
      CANCELADA: 3,
    };
  
    return caronas.map(carona => ({
      rideId: carona.rideId,
      originCity: carona.originCity,
      destinationCity: carona.destinationCity,
      date: carona.date,
      time: carona.time,
      price: carona.price,
      driverName: carona.driverName,
      status: statusMap[carona.status] ?? -1, // Retorna -1 caso o status seja inválido
      driver: carona.driver,
    }));
  };

  useEffect(() => {
    const filtered = transformedCaronas.filter(carona => 
      (carona.originCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
       carona.destinationCity.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || carona.status === parseInt(statusFilter)) &&
      (driverFilter === 'all' || (driverFilter === 'driver' && carona.driver) || (driverFilter === 'passenger' && !carona.driver))
    );
    setFilteredCaronas(filtered);
  }, [searchTerm, statusFilter, driverFilter, caronas]);

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return 'Ativa';
      case 1: return 'Em Progresso';
      case 2: return 'Concluída';
      case 3: return 'Cancelada';
      default: return 'Desconhecido';
    }
  };

  const getStatusStyle = (status: number) => {
    switch (status) {
      case 0: return { backgroundColor: '#4caf50', color: 'white' };
      case 1: return { backgroundColor: '#2196f3', color: 'white' };
      case 2: return { backgroundColor: '#0056b3', color: 'white' };
      case 3: return { backgroundColor: '#f44336', color: 'white' };
      default: return {};
    }
  };

  const handleOfferAgain = (caronaId: string) => {
    const selectedRide = caronas.find(carona => carona.rideId === caronaId);
    if (selectedRide) {
      navigate('/cadastro-carona', { 
        state: { //Preencher a página com esses dados
          ride: {
            origin: selectedRide.originAddress,
            destination: selectedRide.destinationAddress,
            date: selectedRide.date,
            time: selectedRide.time,
            numPassengers: selectedRide.numPassengers,
          },
        },
      });
    }
  };

  const handleCardClick = (caronaId: string) => {
    const selectedRide = caronas.find(carona => carona.rideId === caronaId);
    if (selectedRide) {
      navigate(`/minhas-caronas/${selectedRide.rideId}`, { state: { ride: selectedRide } });
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#333',
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: '25px',
      padding: '10px 20px',
      marginBottom: '20px',
    },
    searchInput: {
      border: 'none',
      background: 'transparent',
      marginLeft: '10px',
      fontSize: '16px',
      width: '100%',
      outline: 'none',
    },
    filterContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '20px',
      gap: '10px',
    },
    filterSelect: {
      padding: '8px 12px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      fontSize: '14px',
      outline: 'none',
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '30px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      paddingBottom: '70px', 
      transition: 'transform 0.2s ease-in-out',
      cursor: 'pointer',
      position: 'relative' as const,
    },
    cardHover: {
      transform: 'translateY(-5px)',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#333',
    },
    cardInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
      color: '#666',
    },
    icon: {
      marginRight: '10px',
      color: '#888',
    },
    statusTag: {
      position: 'absolute' as const,
      top: '15px',
      right: '15px',
      padding: '5px 10px',
      borderRadius: '15px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    driverTag: {
      position: 'absolute' as const,
      bottom: '45px', 
      right: '15px',
      padding: '3px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      backgroundColor: '#ff9800',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
    },
    offerAgainButton: {
      backgroundColor: 'transparent',
      color: '#4caf50',
      border: '1px solid #4caf50',
      borderRadius: '5px',
      padding: '5px 10px',
      fontSize: '12px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute' as const,
      bottom: '15px',
      right: '15px',
      transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
    },
    offerAgainButtonHover: {
      backgroundColor: '#4caf50',
      color: 'white',
    },
  };

  const showMessage = (severity: string, summary: string, detail: string) => {
    messagesRef.current?.show({
      severity,
      summary,
      detail,
      life: 5000
    });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Minhas Caronas</h1>
      </header>
      
      <div style={styles.searchBar}>
        <Search size={20} color="#888" />
        <input
          type="text"
          placeholder="Buscar por origem ou destino"
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div style={styles.filterContainer}>
        <Filter size={20} color="#888" style={{ marginRight: '10px' }} />
        <select
          style={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os status</option>
          <option value="0">Ativas</option>
          <option value="1">Em Progresso</option>
          <option value="2">Concluídas</option>
          <option value="3">Canceladas</option>
        </select>
        <select
          style={styles.filterSelect}
          value={driverFilter}
          onChange={(e) => setDriverFilter(e.target.value)}
        >
          <option value="all">Todas as caronas</option>
          <option value="driver">Caronas oferecidas</option>
          <option value="passenger">Caronas pegas</option>
        </select>
      </div>
      
      <div style={styles.cardGrid}>
        {filteredCaronas.map((carona) => (
          <div
            key={carona.rideId}
            style={{
              ...styles.card,
              ...(styles.cardHover as React.CSSProperties),
            }}
          >
            <div
              style={{
                ...styles.statusTag,
                ...getStatusStyle(carona.status),
              }}
              onClick={() => handleCardClick(carona.rideId)}
            >
              {getStatusLabel(carona.status)}
            </div>
            <h2 style={styles.cardTitle}>{carona.originCity} → {carona.destinationCity}</h2>
            <div style={styles.cardInfo}>
              <Calendar size={16} style={styles.icon} />
              <span>{new Date(carona.date).toLocaleDateString()}</span>
            </div>
            <div style={styles.cardInfo}>
              <Clock size={16} style={styles.icon} />
              <span>{carona.time}</span>
            </div>
            <div style={styles.cardInfo}>
              <DollarSign size={16} style={styles.icon} />
              <span>R$ {parseFloat(carona.price).toFixed()}</span>
            </div>
            <div style={styles.cardInfo}>
              <User size={16} style={styles.icon} />
              <span>{carona.driverName}</span>
            </div>
            
            {carona.driver && (
              <button
                onClick={() => handleOfferAgain(carona.rideId)}
                style={styles.offerAgainButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4caf50';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#4caf50';
                }}
              >
                <Repeat size={14} style={{ marginRight: '3px' }} />
                Oferecer Novamente
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MinhasCaronas;

