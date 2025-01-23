import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import HomePage from './pages/Dashboard/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<HomePage />} />
      {/* Agrega más rutas aquí */}
    </Routes>
  );
}

export default App;
