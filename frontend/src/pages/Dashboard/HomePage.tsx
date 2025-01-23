import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [user, setUser] = useState<any>(null); // Estado para el usuario
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const response = await api.get("/homepage"); // Llama al backend para validar el token
        console.log("Respuesta del backend:", response.data);
        setUser(response.data.user); // Guarda la información del usuario
      } catch (err) {
        console.error("Error al cargar el homepage:", err);
        navigate("/login"); // Redirige al login si no hay un token válido
      }
    };

    fetchHomepage();
  }, [navigate]);

  if (!user) {
    return <p>Cargando...</p>; // Muestra un mensaje mientras verifica el token
  }

  return (
    <div>
      <h1>Bienvenido, {user.name}</h1>
      <p>Este es el homepage.</p>
    </div>
  );
};

export default HomePage;
