import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Grid, Typography, Box, Paper, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import backgroundImage from "../../assets/photo1.jpeg";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await api.post("/login", data);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setErrorMessage("Credenciales inválidas. Por favor, revise su correo y contraseña.");
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setErrorMessage("Correo o contraseña incorrectos.");
      } else if (err.response && err.response.status >= 500) {
        setErrorMessage("Error del servidor. Inténtelo más tarde.");
      } else {
        setErrorMessage("Error de conexión. Verifique su red.");
      }
    }
  };

  const handleForgotPassword = () => {
    alert("Por favor, comuníquese con el administrador para restablecer su contraseña.");
  };

  const handleCloseSnackbar = () => {
    setErrorMessage(null);
  };

  return (
    <Grid container component="main" sx={{ width: "100vw", height: "100vh", backgroundColor: "#0f0f17", display: "flex" }}>
      <Grid item xs={12} sm={6} md={6} sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: { xs: 'none', sm: 'block' }
      }} />

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
          backgroundColor: "#1c1c27", 
          color: "white",
          borderRadius: "20px",
          p: 4,
          width: "90%",
          maxWidth: 380,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Bienvenido a CACE
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            variant="outlined"
            InputLabelProps={{ style: { color: "#9a9a9a" } }}
            InputProps={{ style: { color: "white", backgroundColor: "#29293d", borderRadius: "10px" } }}
            {...register("email", {
              required: "El correo es obligatorio.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "El correo no tiene un formato válido."
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            margin="normal"
            fullWidth
            type="password"
            label="Contraseña"
            variant="outlined"
            InputLabelProps={{ style: { color: "#9a9a9a" } }}
            InputProps={{ style: { color: "white", backgroundColor: "#29293d", borderRadius: "10px" } }}
            {...register("password", { required: "La contraseña es obligatoria." })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: "#635bff", color: "white", fontWeight: "bold", borderRadius: "10px", '&:hover': { backgroundColor: "#4a47c7" } }}
          >
            Iniciar Sesión
          </Button>

          <Typography sx={{ color: "#9a9a9a", textAlign: "center", cursor: "pointer" }} onClick={handleForgotPassword}>
            ¿Olvidó la contraseña?
          </Typography>
        </Box>

        {/* Snackbar para mostrar mensajes de error */}
        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
