import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
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
                <Route path="/home" element={<protectRoute> <Home /> </protectRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
