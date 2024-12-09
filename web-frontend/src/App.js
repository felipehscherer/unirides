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
import EditarMotorista from "./pages/EditarMotorista";
import BuscarCarona from "./pages/BuscarCarona";
import CadastroCarona from './pages/CadastroCarona';
import DetalhesCarona from './pages/DetalhesCarona';
import LandingPage from './pages/LandingPage';
import MinhasCaronas from './pages/MinhasCaronas';
import DetalhesMinhasCaronas from './pages/DetalhesMinhasCaronas';

// Importar outras páginas conforme necessário ou for criando
// quando necessario proteger uma routa só chamar "</ProtectedRoute.js>" dentro da routa
// exemplo <Route path="" element={<protectRoute> element </protectRoute>}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/home" element={<protectRoute> <Home /> </protectRoute>} />
                <Route path="/perfil" element={<protectRoute> <Perfil /> </protectRoute>} />
                <Route path="/caronas" element={<protectRoute> <BuscarCarona /> </protectRoute>} />
                <Route path="/caronas/:rideId" element={<protectRoute><DetalhesCarona /></protectRoute>} />
                <Route path="/minhas-caronas/:rideId" element={<protectRoute><DetalhesMinhasCaronas /></protectRoute>} />
                <Route path="/motorista/gerenciar/cadastro" element={<protectRoute> <CadastroMotorista /> </protectRoute>} />
                <Route path="/motorista/gerenciar/editar" element={<protectRoute> <EditarMotorista /> </protectRoute>} />
                <Route path="/veiculo/gerenciar/cadastro" element={<protectRoute> <CadastroVeiculo /> </protectRoute>} />
                <Route path="/veiculo/gerenciar/apresentarLista" element={<protectRoute> <ApresentarVeiculos /> </protectRoute>} />
                <Route path="/veiculo/gerenciar/apresentarLista/editar/:plate" element={<protectRoute> <EditarVeiculo /> </protectRoute>} />
                <Route path="/cadastro-carona" element={<protectRoute> <CadastroCarona /> </protectRoute>} />
                <Route path="/minhas-caronas" element={<protectRoute> <MinhasCaronas /> </protectRoute>} />
            </Routes>
        </Router>
    );
}
//<Route path="/caronas/cadasro" element={<protectRoute> <CadastroCarona /> </protectRoute>} />
export default App;
