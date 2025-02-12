import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación

const UsersPage = () => {
  const navigate = useNavigate(); // Crea la función de navegación

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Página de Usuarios
      </Typography>




      {/* Botón para navegar a otra página */}
      <Box sx={{ marginTop: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")} 
        >
          Volver a Pagina principal 
        </Button>
      </Box>


    </Box>
  );
};

export default UsersPage;
