import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Drawer, IconButton } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import MenuIcon from "@mui/icons-material/Menu";

const adminSidebarItems = [
  { label: "Inicio", route: "/dashE" },
  { label: "Usuarios", route: "/dashE/users" },
  { label: "Estudiantes", route: "/dashE/students" },
  { label: "Materias y Grupos", route: "/dashE/subjects-groups" },
];

const drawerWidth = 250; // Ancho del sidebar

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
            bgcolor: "black",
            p: 2,
            height: "95%",
            display: "flex",
            flexDirection: "column",
          }}
        >
      <Typography variant="h5" gutterBottom>
        Admin: {user?.name || "Usuario"}
      </Typography>
      <List sx={{ flexGrow: 1 }}>
        {adminSidebarItems.map(({ label, route }) => (
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
      <ListItem disablePadding>
        <ListItemButton
          onClick={logout}
          sx={{
            bgcolor: "red",
            "&:hover": { bgcolor: "darkred" },
          }}
        >
          <ListItemText primary="Cerrar Sesión" sx={{ color: "white" }} />
        </ListItemButton>
      </ListItem>
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
          "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "black" },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Contenido principal con margen */}
      <Box sx={{ flexGrow: 1, p: 3, ml: { xs: 0, md: `${drawerWidth}px` }, mr: { xs: 0, md: 0 } }}>
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
