import React, { useState } from 'react';
import axios from '../services/axiosConfig';

function CadastroVeiculo() {
    const [email, setEmail] = useState('');
    const [modelo, setModelo] = useState('');
    const [marca, setMarca] = useState('');
    const [placa, setPlaca] = useState('');


    const handleCadastro = async (e) => {
        e.preventDefault();
        try {
            //await axios.post('/registerDriver', { email, cnh, dataEmissao, dataValidade, categoria }); // passa o parametros do body da request
            // Redirecione para a tela de login ou exiba mensagem de sucesso

        } catch (error) {
            console.error('Erro ao cadastrar:', error);
        }
    };

    return (
        <form onSubmit={handleCadastro}>
            <p>Email: {CadastroVeiculo.email}</p>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu Email..."
                className='form-control'
                required
            />
            <p>Modelo: {CadastroVeiculo.number}</p>
            <input
                type="text"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Digite o Modelo..."
                required
            />
            <p>Marca: {CadastroVeiculo.date}</p>
            <input
                type="text"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                placeholder="Digite a Marca..."
                required
            />
            <p>Placa: {CadastroVeiculo.email}</p>
            <input
                type="text"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                placeholder="Digite a Placa..."
                required
            />
            <button type="submit">Cadastrar</button>
        </form>
    );
}

export default CadastroVeiculo;
