import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; // Asegúrate de que esta ruta sea correcta
import "../../css/LoginPage.css";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // Para manejar la navegación

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await api.post("/login", {
        email: username,
        password,
      });
  
      console.log("Respuesta de la API:", response.data);
  
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token); // Guardar el token
        navigate("/dashboard");
      } else {
        setError("Credenciales inválidas. Inténtalo de nuevo.");
      }
    } catch (err) {
      console.error("Error al intentar iniciar sesión:", err);
      setError("Ocurrió un error al intentar iniciar sesión.");
    }
  };
  
  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Usuario:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Contraseña:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LoginPage;
