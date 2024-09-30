import React, { useState } from 'react';
import axios from '../services/axiosConfig';

function CadastroMotorista() {
    const [email, setEmail] = useState('');
    const [cnh, setCnh] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [categoria, setCategoria] = useState('');


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
            <p>Email: {CadastroMotorista.email}</p>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu Email..."
                className='form-control'
                required
            />
            <p>cnh: {CadastroMotorista.number}</p>
            <input
                type="text"
                value={cnh}
                onChange={(e) => setCnh(e.target.value)}
                placeholder="Digite sua Cnh..."
                required
            />
            <p>Data de Emissao: {CadastroMotorista.date}</p>
            <input
                type="text"
                value={dataEmissao}
                onChange={(e) => setDataEmissao(e.target.value)}
                placeholder="Digite a Data de Emissao da cnh..."
                required
            />
            <p>Data de Validade: {CadastroMotorista.email}</p>
            <input
                type="text"
                value={dataValidade}
                onChange={(e) => setDataValidade(e.target.value)}
                placeholder="Digite a Data de validade..."
                required
            />
            <p>Categoria: {CadastroMotorista.email}</p>
            <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Digite a Categoria..."
                required
            />
            <button type="submit">Cadastrar</button>
        </form>
    );
}

export default CadastroMotorista;
