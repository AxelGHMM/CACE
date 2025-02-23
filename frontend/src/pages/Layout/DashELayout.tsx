import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Drawer, IconButton, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import MenuIcon from "@mui/icons-material/Menu";

const adminSidebarItems = [
  { label: "Inicio", route: "/dashE" },
  { label: "Usuarios", route: "/dashE/users" },
  { label: "Estudiantes", route: "/dashE/students" },
  { label: "Materias y Grupos", route: "/dashE/subjects-groups" },
];

const drawerWidth = 250; // Ancho fijo del sidebar

const DashELayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Si el usuario no es admin, redirigir al inicio
  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const isActiveTab = (route: string) => location.pathname === route;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: "#2B2C28", // 🔳 Gris oscuro elegante
        p: 2,
        height: "95%",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "#F2F2F2" }}>
        Admin: {user?.name || "Usuario"}
      </Typography>

      <List sx={{ flexGrow: 1 }}>
        {adminSidebarItems.map(({ label, route }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton
              onClick={() => navigate(route)}
              sx={{
                bgcolor: isActiveTab(route) ? "#08DC2B" : "transparent", // 🟢 Verde brillante cuando está seleccionado
                "&:hover": { bgcolor: "#27AE60" }, // 🟢 Verde más oscuro al pasar el cursor
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <ListItemText 
                primary={label} 
                sx={{ 
                  color: isActiveTab(route) ? "#131515" : "#08DC2B", // 🟢 Texto verde en opciones no seleccionadas, negro en seleccionadas
                  fontSize: "1rem", 
                  fontWeight: "bold",
                  textTransform: "uppercase" // 🔹 Resaltar opciones
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* 🔹 Botón "Cerrar Sesión" con fondo negro grisáceo */}
      <Button
        onClick={logout}
        sx={{
          bgcolor: "#131515", // 🔳 Negro grisáceo para el botón
          "&:hover": { bgcolor: "#2B2C28" }, // 🔳 Gris oscuro al hacer hover
          borderRadius: "8px",
          color: "white",
          fontWeight: "bold",
          fontSize: "1rem",
          padding: "12px",
          textTransform: "none",
          border: "2px solid #08DC2B", // 🟢 Borde verde brillante
        }}
        fullWidth
      >
        Cerrar Sesión
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar fijo en pantallas grandes */}
      <Box
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          position: "fixed",
          height: "100vh",
          zIndex: 1200,
          display: { xs: "none", md: "block" },
        }}
      >
        {drawerContent}
      </Box>

      {/* Sidebar deslizante en móviles */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "#2B2C28" }, // 🔳 Sidebar gris en móvil
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Contenido principal con margen */}
      <Box sx={{ flexGrow: 1, p: 3, ml: { xs: 0, md: `${drawerWidth}px` }, mr: { xs: 0, md: 0 }, bgcolor: "#FFFAFB" }}>
        {/* Botón para abrir el sidebar en móviles */}
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            display: { xs: "block", md: "none" },
            position: "absolute",
            top: 10,
            left: 10,
            color: "white",
          }}
        >
          <MenuIcon />
        </IconButton>

        {children}
      </Box>
    </Box>
  );
};

export default DashELayout;
