import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import CadastroMotorista from './pages/CadastroMotorista';
import CadastroVeiculo from "./pages/CadastroVeiculo";
import GerenciarPerfil from "./pages/GerenciarPerfil";
// Importar outras páginas conforme necessário ou for criando
// quando necessario proteger uma routa só chamar "</ProtectedRoute.js>" dentro da routa
// exemplo <Route path="" element={<protectRoute> element </protectRoute>}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/gerenciar" element={<GerenciarPerfil />} />
                <Route path="/cadastroMotorista" element={<CadastroMotorista />} />
                <Route path="/cadastroVeiculo" element={<CadastroVeiculo />} />
            </Routes>
        </Router>
    );
}

export default App;
