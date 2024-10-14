import React, {useState, useEffect} from 'react';
import axios from '../services/axiosConfig';
import './styles/ApresentarVeiculos.css';
import {useNavigate} from 'react-router-dom';

function ApresentarVeiculos() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchVehicles() {
            try {
                const response = await axios.get('/user/profile');
                const data = response.data;
                setEmail(data.email);

                if (data.email) {
                    const responseVehicle = await axios.get(`/vehicle/get/byUserEmail/${data.email}`);
                    const vehiclesData = responseVehicle.data;

                    setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
                }

            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
                if (error.response && error.response.status === 403) {
                    console.error('Acesso negado - erro 403.');
                } else if (error.response && error.response.status === 401) {
                    navigate('/home');
                } else {
                    setVehicles([]);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchVehicles();
    }, [email, navigate]);

    if (loading) {
        return <p>Carregando veículos...</p>;
    }

    return (
        <ul className="vehicle-list">

            {Array.isArray(vehicles) && vehicles.length > 0 ? (
                vehicles.map((vehicle, index) => (
                    <li key={index} className="vehicle-item">
                        <p><strong>Marca:</strong> {vehicle.brand}</p>
                        <p><strong>Modelo:</strong> {vehicle.model}</p>
                        <p><strong>Cor:</strong> {vehicle.color}</p>
                        <p><strong>Placa:</strong> {vehicle.plate}</p>
                        <button className="vehicle-detailsBtn">📄 Detalhes</button>
                        <button className="vehicle-UpdateBtn" onClick={() => navigate(`/veiculo/apresentarLista/editar/${vehicle.plate}`)}>✏️ Editar

                        </button>
                        <button className="vehicle-deleteBtn">🗑️ Deletar</button>
                    </li>
                ))
            ) : (
                <p>Nenhum veículo encontrado.</p>
            )}
        </ul>
    );
}

export default ApresentarVeiculos;
