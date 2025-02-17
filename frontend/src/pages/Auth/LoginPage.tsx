import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Grid, Typography, Box, Paper, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import backgroundImage from "../../assets/photo1.jpeg";
import { useAuth } from "../../hooks/useAuth";  // Ajusta la ruta si es diferente


interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    console.log("Formulario enviado:", data);
    try {
      const response = await api.post("users/login", data);
      if (response.status === 200) {
        console.log("Inicio de sesión exitoso. Token recibido:", response.data.token);
        login(response.data.token);
      } else {
        console.warn("Inicio de sesión fallido.");
        setErrorMessage("Credenciales inválidas.");
      }
    } catch (err) {
      console.error("Error durante el inicio de sesión:", err);
      setErrorMessage("Error de conexión.");
    }
  };
  
  

  const handleForgotPassword = () => {
    alert("Por favor, comuníquese con el administrador para restablecer su contraseña.");
  };

  const handleCloseSnackbar = () => {
    setErrorMessage(null);
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#121212",
        display: "flex",
      }}
    >
      {/* Imagen de Fondo */}
      <Grid
        item
        xs={false}  
        sm={6}
        md={6}
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: { xs: "none", sm: "block" }, 
        }}
      />

      {/* Panel de Login */}
      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        component={Paper}
        elevation={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1E1E1E",
          color: "white",
          borderRadius: { sm: "15px" },
          p: { xs: 3, sm: 4 },
          width: { xs: "90%", sm: "80%", md: "100%" },
          maxWidth: 400,
          mx: "auto", 
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#ffffff" }}>
          Bienvenido a CACE
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
          {/* Email */}
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            variant="outlined"
            InputLabelProps={{ style: { color: "#ffffff" } }}
            InputProps={{
              style: {
                color: "white",
                backgroundColor: "#29293d",
                borderRadius: "10px",
              },
            }}
            {...register("email", {
              required: "El correo es obligatorio.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "El correo no tiene un formato válido.",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Contraseña */}
          <TextField
            margin="normal"
            fullWidth
            type="password"
            label="Contraseña"
            variant="outlined"
            InputLabelProps={{ style: { color: "#ffffff" } }}
            InputProps={{
              style: {
                color: "white",
                backgroundColor: "#29293d",
                borderRadius: "10px",
              },
            }}
            {...register("password", { required: "La contraseña es obligatoria." })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {/* Botón de Inicio de Sesión con colores de UsersPage */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#800080",
              color: "white",
              fontWeight: "bold",
              borderRadius: "10px",
              "&:hover": { backgroundColor: "#4b0082" },
            }}
          >
            Iniciar Sesión
          </Button>

          {/* Enlace para recuperar contraseña */}
          <Typography
            sx={{
              color: "#9a9a9a",
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { color: "#800080" },
            }}
            onClick={handleForgotPassword}
          >
            ¿Olvidó la contraseña?
          </Typography>
        </Box>

        {/* Snackbar para mostrar mensajes de error */}
        <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};
export default LoginPage;