import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Modal,
  IconButton,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import DashboardLayout from "../Layout/DashboardLayout";
import axios from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";

// Tipos de datos
interface Assignment {
  group_id: number;
  group_name: string;
  subject_id: number;
  subject_name: string;
}

interface Attendance {
  student_id: number;
  matricula: string;
  name: string;
  status: "presente" | "ausente" | "retardo";
}

// Componente para seleccionar grupo y materia
const GroupSubjectSelector: React.FC<{
  assignments: Assignment[];
  selectedGroup: string | null;
  selectedSubject: string | null;
  onSelect: (groupId: string, subjectId: string) => void;
}> = ({ assignments, selectedGroup, selectedSubject, onSelect }) => {
  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel sx={{ color: "white" }}>Grupo y Materia</InputLabel>
      <Select
        value={selectedGroup && selectedSubject ? `${selectedGroup}-${selectedSubject}` : ""}
        onChange={(e) => {
          const [groupId, subjectId] = e.target.value.split("-");
          onSelect(groupId, subjectId);
        }}
        sx={{ bgcolor: "#282828", color: "white" }}
      >
        {assignments.map((assignment) => (
          <MenuItem
            key={`${assignment.group_id}-${assignment.subject_id}`}
            value={`${assignment.group_id}-${assignment.subject_id}`}
          >
            {`${assignment.subject_name} - ${assignment.group_name}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [searchDate, setSearchDate] = useState(dayjs());
  const [searchedData, setSearchedData] = useState<Attendance[]>([]);

  // Obtener asignaciones del profesor
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user?.id) return;
      try {
        const response = await axios.get(`/assignments/user/${user.id}`);
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchAssignments();
  }, [user]);

  // Obtener la lista de alumnos según el grupo y materia seleccionados
  useEffect(() => {
    if (!selectedGroup || !selectedSubject) return;

    const fetchAttendance = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/attendances/group/${selectedGroup}/subject/${selectedSubject}`);
        const formattedData: Attendance[] = response.data.map((student: any) => ({
          ...student,
          status: "presente", // Por defecto, todos presentes
        }));
        setAttendanceData(formattedData);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setAttendanceData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedGroup, selectedSubject]);

  // Manejar cambio en el estado de asistencia de un estudiante
  const handleStatusChange = (studentId: number, newStatus: Attendance["status"]) => {
    setAttendanceData(attendanceData.map(att =>
      att.student_id === studentId ? { ...att, status: newStatus } : att
    ));
  };

  // Enviar asistencias al backend
  const handleSendAttendance = async () => {
    if (!selectedGroup || !selectedSubject) {
      setSnackbar({ open: true, message: "Selecciona un grupo y una materia antes de enviar la asistencia", severity: "error" });
      return;
    }

    try {
      await axios.post(`/attendances/submit`, {
        group_id: selectedGroup,
        subject_id: selectedSubject,
        date: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
        attendances: attendanceData.map(att => ({
          student_id: att.student_id,
          status: att.status,
        })),
      });

      setSnackbar({ open: true, message: "Asistencia enviada correctamente", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "No se pudo enviar la asistencia", severity: "error" });
      console.error("Error al enviar asistencia:", error);
    }
  };

  // Buscar asistencias por fecha
  const handleSearchAttendance = async () => {
    if (!selectedGroup || !selectedSubject) {
      setSnackbar({ open: true, message: "Selecciona un grupo y una materia antes de buscar", severity: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const formattedDate = searchDate.format("YYYY-MM-DD");
      const response = await axios.get(`/attendances/group/${selectedGroup}/subject/${selectedSubject}?date=${formattedDate}`);
      setSearchedData(response.data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setSearchedData([]);
      setSnackbar({ open: true, message: "Error al obtener asistencias", severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 4, bgcolor: "#121212", color: "white", minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom>Registro de Asistencias</Typography>

        {/* Selector de Grupo y Materia */}
        <GroupSubjectSelector
          assignments={assignments}
          selectedGroup={selectedGroup}
          selectedSubject={selectedSubject}
          onSelect={(groupId, subjectId) => {
            setSelectedGroup(groupId);
            setSelectedSubject(subjectId);
          }}
        />

        {/* Tabla de Asistencias */}
        <Box component={Paper} sx={{ mt: 3, maxHeight: 400, overflow: "auto", bgcolor: "#1E1E1E", p: 2 }}>
          <Typography variant="h6" color="white">Lista de Asistencias</Typography>
          {isLoading ? (
            <Typography color="white">Cargando asistencias...</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Matrícula</TableCell>
                  <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                  <TableCell sx={{ color: "white" }}>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ color: "white", textAlign: "center" }}>
                      No hay datos de asistencia
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceData.map(attendance => (
                    <TableRow key={attendance.student_id}>
                      <TableCell sx={{ color: "white" }}>{attendance.matricula}</TableCell>
                      <TableCell sx={{ color: "white" }}>{attendance.name}</TableCell>
                      <TableCell>
                        <FormControl sx={{ minWidth: 120 }}>
                          <Select
                            value={attendance.status}
                            onChange={(e) => handleStatusChange(attendance.student_id, e.target.value as Attendance["status"])}
                            sx={{ bgcolor: "#282828", color: "white" }}
                          >
                            <MenuItem value="presente">Presente</MenuItem>
                            <MenuItem value="ausente">Ausente</MenuItem>
                            <MenuItem value="retardo">Retardo</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Box>

        {/* Botón para Enviar Asistencia */}
        <Button variant="contained" color="secondary" onClick={handleSendAttendance} sx={{ mt: 3 }}>
          Enviar Asistencia
        </Button>

        {/* Botón para Abrir Modal de Búsqueda */}
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)} sx={{ mt: 3, ml: 2 }}>
          Buscar Asistencias
        </Button>

        {/* Modal de Búsqueda de Asistencias */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#1E1E1E",
            color: "white",
            p: 4,
            borderRadius: 2,
            minWidth: 400,
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">Buscar Asistencias</Typography>
              <IconButton onClick={() => setModalOpen(false)} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Selector de Fecha */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha"
                value={searchDate}
                onChange={(newDate) => newDate && setSearchDate(newDate)}
                sx={{ mt: 2, bgcolor: "#282828", color: "white" }}
              />
            </LocalizationProvider>

            <Button variant="contained" color="secondary" sx={{ mt: 3, width: "100%" }} onClick={handleSearchAttendance}>
              Buscar
            </Button>

            {/* Tabla de Resultados */}
            <Box sx={{ mt: 3, maxHeight: 300, overflow: "auto" }}>
              {isLoading ? (
                <Typography color="white">Cargando asistencias...</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>Matrícula</TableCell>
                      <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                      <TableCell sx={{ color: "white" }}>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} sx={{ color: "white", textAlign: "center" }}>
                          No hay registros para esta fecha
                        </TableCell>
                      </TableRow>
                    ) : (
                      searchedData.map(attendance => (
                        <TableRow key={attendance.student_id}>
                          <TableCell sx={{ color: "white" }}>{attendance.matricula}</TableCell>
                          <TableCell sx={{ color: "white" }}>{attendance.name}</TableCell>
                          <TableCell sx={{ color: "white" }}>{attendance.status}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Box>
        </Modal>

        {/* Snackbar para mensajes */}
        <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default AttendancePage;