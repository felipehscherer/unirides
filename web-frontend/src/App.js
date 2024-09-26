import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
// Importar outras páginas conforme necessário ou for criando
// quando necessario proteger uma routa só chamar "</ProtectedRoute.js>" dentro da routa 
// exemplo <Route path="" element={<protectRoute> element </protectRoute>}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        {/* Outras rotas */}
      </Routes>
    </Router>
  );
}

export default App;
