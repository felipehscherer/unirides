import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import CadastroMotorista from './pages/CadastroMotorista';
import CadastroVeiculo from "./pages/CadastroVeiculo";
import Perfil from "./pages/Perfil";
import ApresentarVeiculos from "./pages/ApresentarVeiculos";
import EditarVeiculo from "./pages/EditarVeiculo";
// Importar outras páginas conforme necessário ou for criando
// quando necessario proteger uma routa só chamar "</ProtectedRoute.js>" dentro da routa
// exemplo <Route path="" element={<protectRoute> element </protectRoute>}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/home" element={<protectRoute> <Home /> </protectRoute>} />
                <Route path="/perfil" element={<protectRoute> <Perfil /> </protectRoute>} />
                <Route path="/motorista/cadastro" element={<protectRoute> <CadastroMotorista /> </protectRoute>} />
                <Route path="/veiculo/cadastro" element={<protectRoute> <CadastroVeiculo /> </protectRoute>} />
                <Route path="/veiculo/apresentarLista" element={<protectRoute> <ApresentarVeiculos /> </protectRoute>} />
                <Route path="/veiculo/apresentarLista/editar/:plate" element={<protectRoute> <EditarVeiculo /> </protectRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
