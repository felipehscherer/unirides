import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, DollarSign, User, Search, Filter, Repeat, Car } from 'lucide-react';

interface Carona {
  rideId: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  price: string;
  driverName: string;
  rideStatus: number;
  isDriver: boolean;
}

const MinhasCaronas: React.FC = () => {
  const [caronas, setCaronas] = useState<Carona[]>([]);
  const [filteredCaronas, setFilteredCaronas] = useState<Carona[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [driverFilter, setDriverFilter] = useState('all');

  useEffect(() => {
    // Simular busca de dados do backend
    const mockCaronas: Carona[] = [
      {
        rideId: '1',
        origin: 'São Paulo',
        destination: 'Rio de Janeiro',
        date: '2023-06-01',
        time: '08:00',
        price: '100.00',
        driverName: 'João Silva',
        rideStatus: 0,
        isDriver: true
      },
      {
        rideId: '2',
        origin: 'Belo Horizonte',
        destination: 'Brasília',
        date: '2023-05-28',
        time: '10:00',
        price: '150.00',
        driverName: 'Maria Santos',
        rideStatus: 1,
        isDriver: false
      },
      {
        rideId: '3',
        origin: 'Curitiba',
        destination: 'Florianópolis',
        date: '2023-06-05',
        time: '14:00',
        price: '80.00',
        driverName: 'Pedro Oliveira',
        rideStatus: 2,
        isDriver: true
      }
    ];
    setCaronas(mockCaronas);
    setFilteredCaronas(mockCaronas);
  }, []);

  useEffect(() => {
    const filtered = caronas.filter(carona => 
      (carona.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
       carona.destination.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || carona.rideStatus === parseInt(statusFilter)) &&
      (driverFilter === 'all' || (driverFilter === 'driver' && carona.isDriver) || (driverFilter === 'passenger' && !carona.isDriver))
    );
    setFilteredCaronas(filtered);
  }, [searchTerm, statusFilter, driverFilter, caronas]);

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return 'Ativa';
      case 1: return 'Concluída';
      case 2: return 'Cancelada';
      default: return 'Desconhecido';
    }
  };

  const getStatusStyle = (status: number) => {
    switch (status) {
      case 0: return { backgroundColor: '#4caf50', color: 'white' };
      case 1: return { backgroundColor: '#2196f3', color: 'white' };
      case 2: return { backgroundColor: '#f44336', color: 'white' };
      default: return {};
    }
  };

  const handleOfferAgain = (carona: Carona) => {
    // Implementar lógica para oferecer a carona novamente
    console.log(`Oferecendo novamente a carona: ${carona.origin} -> ${carona.destination}`);
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
          <option value="1">Concluídas</option>
          <option value="2">Canceladas</option>
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
                ...getStatusStyle(carona.rideStatus),
              }}
            >
              {getStatusLabel(carona.rideStatus)}
            </div>
            <h2 style={styles.cardTitle}>{carona.origin} → {carona.destination}</h2>
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
              <span>R$ {carona.price}</span>
            </div>
            <div style={styles.cardInfo}>
              <User size={16} style={styles.icon} />
              <span>{carona.driverName}</span>
            </div>
            
            {carona.isDriver && (
              <button
                onClick={() => handleOfferAgain(carona)}
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

