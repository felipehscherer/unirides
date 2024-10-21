import {useNavigate} from 'react-router-dom';
import './styles/EditarVeiculo.css';
import React, {useEffect, useState} from "react";
import axios from "../services/axiosConfig";

function GerenciarMotorista() {

    const [email, setEmail] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDriver() {
            try {
                const response = await axios.get('/user/profile');
                const data = response.data;
                setEmail(data.email);

            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
                if (error.response && error.response.status === 403) {
                    console.error('Acesso negado - erro 403.');
                } else if (error.response && error.response.status === 401) {
                    navigate('/home');
                }
            }
        }

        fetchDriver();
    }, [email, navigate]);

    const handleDeleteClick = (vehicle) => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteDriver = async (email) => {
        try {
            await axios.delete(`/vehicle/delete/AllByUserEmail/${email}`)

            await axios.delete(`/driver/delete/${email}`);
            alert('Cnh desvinculada com sucesso!');
            navigate('/home')
        } catch (error) {
            console.error('Erro ao desvincular cnh:', error);
            alert(error);
        }
    };

    const handleConfirmDelete = () => {
        console.log(`Cnh será desvinculada do email: ${email}.`);
        handleDeleteDriver(email);
        closeDeleteModal();

    };
    return (
        <div className="gerenciar-container">
            <div className={"gerenciar-box"}>
                <button
                    className="gerenciar-Btn"
                    onClick={() => navigate('/perfil')}
                >
                    ↩ Voltar
                </button>
                <button
                    className="btn-action-green"
                    onClick={() => navigate('/motorista/gerenciar/editar')}
                >
                    ✏️ Editar Cnh
                </button>
                <button className="btn-action-green" onClick={() => handleDeleteClick(email)}>🗑️
                    Deletar
                </button>
                {/* Modal de Exclusão */}
                {isDeleteModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Confirmar Exclusão</h2>
                            <p>Você tem certeza que deseja desvincular sua cnh?
                                Todos os seus veiculos vinculados serao deletados
                            </p>
                            <div>
                                <div className="button-container">
                                    <button className={'gerenciar-Btn'} onClick={handleConfirmDelete}>✔ Confirmar
                                    </button>
                                    <button className={'gerenciar-Btn'}
                                            onClick={closeDeleteModal}>❌
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GerenciarMotorista;
