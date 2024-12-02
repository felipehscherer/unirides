import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../services/axiosConfig';
import './styles/Motorista.css';
import { Messages } from "primereact/messages";
import { Toast } from "primereact/toast";

function EditarVeiculo() {
    const { plate } = useParams();
    const [color, setColor] = useState('');
    const [capacity, setCapacity] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [email, setEmail] = useState('');
    const [plateState, setPlate] = useState('');
    const messagesRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicleData = async () => {
            try {
                const response = await axios.get('/user/profile');
                const data = response.data;
                setEmail(data.email);

                const responseVeiculo = await axios.get(`/vehicle/get/${plate}`);
                const vehicleData = responseVeiculo.data;

                // Atualize plateState com o valor da placa
                setColor(vehicleData.color || '');
                setCapacity(vehicleData.capacity || '');
                setModel(vehicleData.model || '');
                setBrand(vehicleData.brand || '');
                setPlate(vehicleData.plate || '');
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
                if (error.response && error.response.status === 403) {
                    console.error('Acesso negado - erro 403.');
                } else if (error.response && error.response.status === 401) {
                    navigate('/home');
                }
            }
        };

        fetchVehicleData();
    }, [plate, navigate]);

    const showError = (severity, summary, detail) => {
        messagesRef.current.clear();
        messagesRef.current?.show({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 5000
        });
    };

    const handleCadastro = async (e) => {
        e.preventDefault();

        try {
            const dados = { email, color, capacity, model, brand, plate: plateState };
            console.log(dados);

            const response = await axios.put(`vehicle/update/${plate}`, dados);

            const mensagem = "Veiculo atualizado com Sucesso!";
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

    return (
        <div className="driver-container">
            <Toast ref={messagesRef} />
            <div className="login-box">
                <form onSubmit={handleCadastro}>
                    <p className="driver-title">Editar Veiculo</p>
                    <p className='driver-description'>Preencha as informações sobre seu veiculo</p>
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="Cor"
                        className="underline-input"
                        required
                    />
                    <input
                        type="text"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="Capacidade"
                        className="underline-input"
                        required
                    />
                    <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="Modelo"
                        className="underline-input"
                        required
                    />
                    <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="Marca"
                        className="underline-input"
                        required
                    />
                    <input
                        type="text"
                        value={plateState}
                        onChange={(e) => setPlate(e.target.value)}
                        placeholder="Placa"
                        className="underline-input"
                        required
                    />
                    <div className='buttons-driver'>
                        <button type="submit" className='driver-button'>📝 Atualizar</button>
                        <button
                            className='btn-profile-driver'
                            onClick={() => navigate('/perfil')}
                        >
                            Voltar
                        </button>
                    </div>
                </form>
                <Messages className='custom-toast' ref={messagesRef} />
            </div>
        </div>
    );
}

export default EditarVeiculo;
