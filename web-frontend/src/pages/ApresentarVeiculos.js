import React, {useState, useEffect} from 'react';
import axios from '../services/axiosConfig';
import './styles/ApresentarVeiculos.css';
import {useNavigate} from 'react-router-dom';

function ApresentarVeiculos() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

    const handleDetailsClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsDetailsModalOpen(true);
    };

    const handleDeleteClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsDeleteModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedVehicle(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedVehicle(null);
    };

    const handleDeleteVehicle = async (plate) => {
        try {
            await axios.delete(`/vehicle/delete/${plate}`);
            setVehicles(vehicles.filter(vehicle => vehicle.plate !== plate));
            alert('Veículo deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar veículo:', error);
            alert('Ocorreu um erro ao tentar deletar o veículo.');
        }
    };

    const handleConfirmDelete = () => {
        console.log(`Veículo ${selectedVehicle.plate} será deletado.`);
        handleDeleteVehicle(selectedVehicle.plate);
        closeDeleteModal();

    };

    if (loading) {
        return <p>Carregando veículos...</p>;
    }

    return (
        <div>
            <ul className="vehicle-list">
                {Array.isArray(vehicles) && vehicles.length > 0 ? (
                    vehicles.map((vehicle, index) => (
                        <li key={index} className="vehicle-item">
                            <p><strong>Marca:</strong> {vehicle.brand}</p>
                            <p><strong>Modelo:</strong> {vehicle.model}</p>
                            <button className="vehicle-detailsBtn" onClick={() => handleDetailsClick(vehicle)}>📄
                                Detalhes
                            </button>
                            <button className="vehicle-UpdateBtn"
                                    onClick={() => navigate(`/veiculo/apresentarLista/editar/${vehicle.plate}`)}>✏️
                                Editar
                            </button>
                            <button className="vehicle-deleteBtn" onClick={() => handleDeleteClick(vehicle)}>🗑️
                                Deletar
                            </button>
                        </li>
                    ))
                ) : (
                    <div className="register-container">
                        <div className="vehicle-list">
                        <p>Nenhum veículo encontrado.</p>
                            <button
                                className="vehicle-Btn"
                                onClick={() => navigate('/perfil')}>
                                ↩ Voltar
                            </button>
                        </div>
                    </div>
                )}
            </ul>

            {/* Modal de Detalhes */}
            {isDetailsModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Detalhes do Veículo</h2>
                        {selectedVehicle && (
                            <div>
                                <p><strong>Marca:</strong> {selectedVehicle.brand}</p>
                                <p><strong>Modelo:</strong> {selectedVehicle.model}</p>
                                <p><strong>Cor:</strong> {selectedVehicle.color}</p>
                                <p><strong>Capacidade:</strong> {selectedVehicle.capacity}</p>
                                <p><strong>Placa:</strong> {selectedVehicle.plate}</p>
                            </div>
                        )}
                        <button className={'vehicle-Btn'} onClick={closeDetailsModal}>Fechar</button>
                    </div>
                </div>
            )}

            {/* Modal de Exclusão */}
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Confirmar Exclusão</h2>
                        <p>Você tem certeza que deseja excluir o veículo {selectedVehicle?.plate}?</p>
                        <div>
                            {selectedVehicle && (

                                <div className="button-container">
                                    <button className={'vehicle-Btn'} onClick={handleConfirmDelete}>✔ Confirmar</button>
                                    <button className={'vehicle-Btn'}
                                            onClick={closeDeleteModal}>❌
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ApresentarVeiculos;
