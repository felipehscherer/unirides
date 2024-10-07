import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '../services/axiosConfig';
import './styles/CadastroVeiculo.css';
import logoImage from '../assets/logo.jpg';
import {jwtDecode} from 'jwt-decode';

function CadastroVeiculo() {
    const [color, setColor] = useState("");
    const [capacity, setCapacity] = useState("");
    const [model, setModel] = useState("");
    const [brand, setBrand] = useState("");
    const [plate, setPlate] = useState("");

    const [capacityError, setCapacityError] = useState('')
    const [plateError, setPlateError] = useState('')

    const navigate = useNavigate();

    const handleCadastro = async (e) => {
        e.preventDefault();

        setCapacityError('')
        setPlateError('')
        if (capacity <= 1) {
            setCapacityError('O carro deve possuir no mínimo dois lugares');
            return
        }

        if (!(plate.length === 8)) {
            setPlateError('A placa deve conter 8 caracteres')
            return
        }

        try {
            const token = localStorage.getItem('token');

            const decodedToken = jwtDecode(token);  // decodific o token

            const email = decodedToken.sub;  // sub possui o email

            const response = await axios.post(
                'http://localhost:8080/vehicle',
                {email, color, capacity, model, brand, plate},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            ) // realiza o post

            navigate('/home'); //navega para a home

        } catch (error) {
            console.error("Erro ao cadastrar o veiculo:", error);
            // exibe uma mensagem de erro
        }
    };

    return (
        <div className="register-container">
            <form className="login-box" onSubmit={handleCadastro}>
                <img src={logoImage} alt="Logo" className="register-logo"/>
                <p className="register-title">🚗 Preencha as informações sobre seu carro </p>

                <label htmlFor="color" className="register-label">🔵 Digite a cor</label>
                <input
                    id="color"
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className={'inputBox'}
                    placeholder="Cor"
                    required
                />

                <label htmlFor="capacity" className="register-label">💺 Digite a capacidade</label>
                <input
                    id="capacity"
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className={'inputBox'}
                    placeholder="Capacidade"
                    required
                /><label className="errorLabel">{capacityError}</label>

                <label htmlFor="model" className="register-label">🚙 Digite o modelo</label>
                <input
                    id="model"
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className={'inputBox'}
                    placeholder="Modelo"
                    required
                />

                <label htmlFor="brand" className="register-label">🏷️ Digite a marca</label>
                <input
                    id="brand"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className={'inputBox'}
                    placeholder="Marca"
                    required
                />

                <label htmlFor="plate" className="register-label">🔢 Digite a placa</label>
                <input
                    id="password"
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    className={'inputBox'}
                    placeholder="Placa"
                    required
                /><label className="errorLabel">{plateError}</label>

                <button type="submit">📝 Cadastrar</button>
            </form>
        </div>
    );
}

export default CadastroVeiculo;
