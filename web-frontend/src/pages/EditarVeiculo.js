import React, {useEffect, useRef, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../services/axiosConfig';
import './styles/EditarVeiculo.css';
import logoImage from '../assets/logo.jpg';
import {Messages} from "primereact/messages";

function EditarVeiculo() {
    const { plate } = useParams();
    const [color, setColor] = useState('');
    const [capacity, setCapacity] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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

                setColor(vehicleData.color || '');
                setCapacity(vehicleData.capacity || '');
                setModel(vehicleData.model || '');
                setBrand(vehicleData.brand || '');
                setPlate(vehicleData.plate || ''); // Atualiza a variável de estado usada no formulário

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
    }, [plate]);


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

            const mensagem = "Veiculo atualizado com Sucesso!"

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
        <div className="edit-container-vehicle">
            <div className="edit-box-vehicle">
                <form onSubmit={handleCadastro}>
                    <img src={logoImage} alt="Logo" className="edit-logo-vehicle" />

                    <p className="edit-title-vehicle">Edite as informações do seu carro</p>

                    <label htmlFor="color" className="edit-label-vehicle">Digite a cor</label>
                    <input
                        id="color"
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="Cor"
                        required
                    />

                    <label htmlFor="capacity" className="edit-label-vehicle">Digite a capacidade</label>
                    <input
                        id="capacity"
                        type="text"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        placeholder="Capacidade"
                        required
                    />

                    <label htmlFor="model" className="edit-label-vehicle">Digite o modelo</label>
                    <input
                        id="model"
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="Modelo"
                        required
                    />

                    <label htmlFor="brand" className="edit-label-vehicle">Digite a marca</label>
                    <input
                        id="brand"
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="Marca"
                        required
                    />

                    <label htmlFor="plate" className="edit-label-vehicle">Digite a placa</label>
                    <input
                        id="plate"
                        type="text"
                        value={plateState}
                        onChange={(e) => setPlate(e.target.value)}
                        placeholder="Placa"
                        required
                    />

                    <button type="submit" className="button-edit-vehicle">📝 Salvar</button>
                    <button
                        className="btn-profile-vehicle"
                        onClick={() => navigate('/perfil')}
                    >
                        Voltar para Perfil
                    </button>
                </form>
            </div>
            <Messages className='custom-toast' ref={messagesRef} />
        </div>
    );
}

export default EditarVeiculo;
