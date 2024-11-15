import React, {useState, useEffect, useRef} from 'react';
import axios from '../services/axiosConfig';
import './styles/ApresentarVeiculos.css';
import {useNavigate} from 'react-router-dom';
import {Messages} from "primereact/messages";

function ApresentarVeiculos() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const messagesRef = useRef(null);

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
            const mensagem = "Veículo deletado com sucesso!"

            showError('success', 'Sucesso:', mensagem);
            setTimeout(() => {
                navigate('/perfil');
            }, 2000);

        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMsg = error.response.data;
                showError('error', 'Erro:', errorMsg);
            }
        }
    };

    const showError = (severity, summary, detail) => {
        messagesRef.current.clear();
        messagesRef.current?.show({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 5000
        });
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
        <div className="manage-container">
            <div className={"manage-box"}>
                <ul className="manage-list">
                    {Array.isArray(vehicles) && vehicles.length > 0 ? (
                        vehicles.map((vehicle, index) => (
                            <li key={index} className="manage-item">
                                <p><strong>Marca:</strong> {vehicle.brand}</p>
                                <p><strong>Modelo:</strong> {vehicle.model}</p>
                                <button className="manage-detailsBtn" onClick={() => handleDetailsClick(vehicle)}>📄
                                    Detalhes
                                </button>
                                <button className="manage-UpdateBtn"
                                        onClick={() => navigate(`/veiculo/gerenciar/apresentarLista/editar/${vehicle.plate}`)}>✏️
                                    Editar
                                </button>
                                <button className="manage-deleteBtn" onClick={() => handleDeleteClick(vehicle)}>🗑️
                                    Deletar
                                </button>
                            </li>
                        ))
                    ) : (
                        <div className="manage-container">
                            <div className="manage-list">
                                <p>Nenhum veículo encontrado.</p>
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
                            <button className={'manage-Btn'} onClick={closeDetailsModal}>Fechar</button>
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
                                        <button className={'manage-Btn'} onClick={handleConfirmDelete}>✔ Confirmar
                                        </button>
                                        <button className={'manage-Btn'}
                                                onClick={closeDeleteModal}>❌
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                )}
                <button
                    className={'btn-profile-manage'}
                    onClick={() => navigate('/perfil')}
                >
                    Voltar para Perfil
                </button>
            </div>
            <Messages className='custom-toast' ref={messagesRef} />

        </div>
    )
}

export default ApresentarVeiculos;
