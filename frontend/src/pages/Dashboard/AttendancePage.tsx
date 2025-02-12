import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import DashboardLayout from "../Layout/DashboardLayout";

const AttendancePage: React.FC = () => {
  const attendanceData = [
    { student: "Juan Pérez", date: "2025-02-06", status: "Presente" },
    { student: "María López", date: "2025-02-06", status: "Ausente" },
    { student: "Carlos Gómez", date: "2025-02-05", status: "Tarde" },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ bgcolor: "#1E1E1E", color: "white", p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Registro de Asistencias
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ bgcolor: "#222", color: "white" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Últimas Asistencias Registradas
                </Typography>
                <List>
                  {attendanceData.map((attendance, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton>
                        <ListItemText
                          primary={`${attendance.student} - ${attendance.status}`}
                          secondary={`Fecha: ${attendance.date}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="secondary">
            Consultar Asistencias
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default AttendancePage;
