import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, CircularProgress, Box } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DashELayout from "../Layout/DashELayout";
import api from "../../utils/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminHome: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [usersByRole, setUsersByRole] = useState<number[]>([]);
  
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get("/admin/homepage");
        setTotalUsers(response.data.totalUsers);
        setTotalSubjects(response.data.totalSubjects);
        setTotalGroups(response.data.totalGroups);
        setUsersByRole(response.data.usersByRole);
      } catch (err) {
        console.error("Error al cargar datos administrativos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const barData = {
    labels: ["Administradores", "Profesores", "Estudiantes"],
    datasets: [
      {
        label: "Cantidad",
        data: usersByRole,
        backgroundColor: "#800080",
      },
    ],
  };

  

  if (loading) {
    return (
      <DashELayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress color="secondary" />
        </Box>
      </DashELayout>
    );
  }

  return (
    <DashELayout>
      <Box sx={{ p: 4, bgcolor: "#121212", color: "#ffffff", minHeight: "100vh" }}>
          <Typography variant="h4" gutterBottom>Panel de Administración</Typography>
        <Typography variant="body1" gutterBottom>Vista general del sistema.</Typography>

        {/* 🔹 Tarjetas Resumen */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#1E1E1E", color: "white", textAlign: "center", p: 2 }}>
              <Typography variant="h6">Usuarios Totales</Typography>
              <Typography variant="h4">{totalUsers}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#1E1E1E", color: "white", textAlign: "center", p: 2 }}>
              <Typography variant="h6">Materias Registradas</Typography>
              <Typography variant="h4">{totalSubjects}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#1E1E1E", color: "white", textAlign: "center", p: 2 }}>
              <Typography variant="h6">Grupos Registrados</Typography>
              <Typography variant="h4">{totalGroups}</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* 🔹 Gráficos */}
        <Grid container spacing={3} sx={{ mt: 2, flexGrow: 1 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: "#1E1E1E", color: "white", height: "100%" }}>
              <CardContent>
                <Typography variant="h6">Usuarios por Rol</Typography>
                <Box sx={{ width: "100%", height: 300 }}>
                  <Bar data={barData} options={{ maintainAspectRatio: false }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
          </Grid>
        </Grid>
      </Box>
    </DashELayout>
  );
};

export default AdminHome;
