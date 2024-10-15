import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from '../services/axiosConfig';
import './styles/EditarVeiculo.css';
import logoImage from '../assets/logo.jpg';

function EditarVeiculo() {
    const {plate} = useParams();
    const [color, setColor] = useState('');
    const [capacity, setCapacity] = useState('');
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicleData = async () => {
            try {
                const responseVeiculo = await axios.get(`/vehicle/get/${plate}`);
                const vehicleData = responseVeiculo.data;

                setColor(vehicleData.color || '');
                setCapacity(vehicleData.capacity || '');
                setModel(vehicleData.model || '');
                setBrand(vehicleData.brand || '');
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

    const handleCadastro = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `vehicle/update/${plate}`,
                {email, color, capacity, model, brand, plate}
            );

            navigate('/perfil');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMsg = error.response.data;
                setErrorMessage(errorMsg);
                alert(errorMsg);
            }
        }
    };

    return (
        <div className="update-container">
            <form className="update-box" onSubmit={handleCadastro}>
                <button
                    className="btn-back"
                    onClick={() => navigate('/veiculo/apresentarLista')}
                >
                    ↩
                </button>
                <img src={logoImage} alt="Logo" className="update-logo"/>
                <p className="update-title">✏️ Edite as informações do seu carro</p>

                <label htmlFor="color" className="update-label">🔵 Digite a cor</label>
                <input
                    id="color"
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className={'inputBox'}
                    placeholder="Cor"
                    required
                />

                <label htmlFor="capacity" className="update-label">💺 Digite a capacidade</label>
                <input
                    id="capacity"
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className={'inputBox'}
                    placeholder="Capacidade"
                    required
                />

                <label htmlFor="model" className="update-label">🚙 Digite o modelo</label>
                <input
                    id="model"
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className={'inputBox'}
                    placeholder="Modelo"
                    required
                />

                <label htmlFor="brand" className="update-label">🏷️ Digite a marca</label>
                <input
                    id="brand"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className={'inputBox'}
                    placeholder="Marca"
                    required
                />

                <label htmlFor="plate" className="update-label">🔢 Digite a placa</label>
                <input
                    id="plate"
                    type="text"
                    value={plate}
                    readOnly
                    className={'inputBox'}
                    placeholder="Placa"
                    required
                />

                <button type="submit">📝 Salvar</button>
            </form>
        </div>
    );
}

export default EditarVeiculo;
