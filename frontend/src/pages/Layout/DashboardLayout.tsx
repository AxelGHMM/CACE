import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api"; // Asegúrate de que esto apunte a tu configuración de Axios

const sidebarItems = [
  { label: "Inicio", route: "/dashboard" },
  { label: "Calificaciones", route: "/dashboard/grades" },
  { label: "Asistencia", route: "/dashboard/attendance" },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await api.get("/me"); // Llama a la ruta para obtener el nombre del usuario
        setUsername(response.data.name);
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
        setUsername("Usuario"); // Valor por defecto en caso de error
      }
    };

    fetchUsername();
  }, []);

  const isActiveTab = (route: string) => location.pathname === route;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#1E1E1E", color: "white" }}>
      <Box sx={{ width: 250, bgcolor: "black", p: 2 }}>
        <Typography variant="h5" gutterBottom>Bienvenido, {username}</Typography>
        <List>
          {sidebarItems.map(({ label, route }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                onClick={() => navigate(route)}
                sx={{
                  bgcolor: isActiveTab(route) ? "#800080" : "transparent",
                  "&:hover": { bgcolor: "#4b0082" },
                }}
              >
                <ListItemText primary={label} sx={{ color: "white" }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
    </Box>
  );
};

export default DashboardLayout;
