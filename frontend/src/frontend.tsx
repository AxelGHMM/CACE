
// ==== Directorio: src ====

// Archivo: App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/Auth/LoginPage";
import HomePage from "./pages/Dashboard/HomePage";
import GradesPage from "./pages/Dashboard/GradesPage";
import AttendancePage from "./pages/Dashboard/AttendancePage";
import UsersPage from "./pages/DashE/UsersPage";
import StudentsPage from "./pages/DashE/StudentsPage";
import AdminHome from "./pages/DashE/AdminHome";
import SubjectGroup from "./pages/DashE/SubjectGroup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 🔹 Ruta pública */}
          <Route path="/" element={<LoginPage />} />

          {/* 🔹 Rutas protegidas para profesores */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/dashboard/grades" element={<GradesPage />} />
            <Route path="/dashboard/attendance" element={<AttendancePage />} />
          </Route>

          {/* 🔹 Rutas protegidas para administradores */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashE" element={<AdminHome />} />
            <Route path="/dashE/users" element={<UsersPage />} />
            <Route path="/dashE/students" element={<StudentsPage />} />
            <Route path="/dashE/subjects-groups" element={<SubjectGroup />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;


// Archivo: frontend.tsx

// ==== Directorio: src ====

// Archivo: App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/Auth/LoginPage";
import HomePage from "./pages/Dashboard/HomePage";
import GradesPage from "./pages/Dashboard/GradesPage";
import AttendancePage from "./pages/Dashboard/AttendancePage";
import UsersPage from "./pages/DashE/UsersPage";
import StudentsPage from "./pages/DashE/StudentsPage";
import AdminHome from "./pages/DashE/AdminHome";
import SubjectGroup from "./pages/DashE/SubjectGroup";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 🔹 Ruta pública */}
          <Route path="/" element={<LoginPage />} />

          {/* 🔹 Rutas protegidas para profesores */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/dashboard/grades" element={<GradesPage />} />
            <Route path="/dashboard/attendance" element={<AttendancePage />} />
          </Route>

          {/* 🔹 Rutas protegidas para administradores */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashE" element={<AdminHome />} />
            <Route path="/dashE/users" element={<UsersPage />} />
            <Route path="/dashE/students" element={<StudentsPage />} />
            <Route path="/dashE/subjects-groups" element={<SubjectGroup />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;


// Archivo: main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  
        <App />
);



// Archivo: merge.ts
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Si merge.ts está en src, entonces los archivos están en subdirectorios de src
const folderPath = path.resolve(__dirname); // Ya estamos en src
const outputFile = path.resolve(__dirname, "todos.tsx"); // Archivo de salida

// Función para recorrer directorios y leer archivos .ts y .tsx
const getFilesRecursively = (dir: string): string[] => {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results; // Verifica que el directorio existe

    const list = fs.readdirSync(dir);

    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(getFilesRecursively(filePath)); // Si es directorio, busca recursivamente
        } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
            results.push(filePath); // Agregar solo archivos .ts y .tsx
        }
    });

    return results;
};

// Obtener todos los archivos .ts y .tsx dentro de `src/`
const files = getFilesRecursively(folderPath);

// Organizar archivos por directorio
const filesByDirectory: Record<string, string[]> = {};

// Clasificar archivos por carpeta
files.forEach((filePath) => {
    const relativeDir = path.dirname(filePath).replace(folderPath, "").replace(/^\/|\\/g, "");
    if (!filesByDirectory[relativeDir]) {
        filesByDirectory[relativeDir] = [];
    }
    filesByDirectory[relativeDir].push(filePath);
});

let content = "";

// Recorrer los directorios y escribir los archivos dentro de cada uno
for (const [dir, filePaths] of Object.entries(filesByDirectory)) {
    content += `\n// ==== Directorio: ${dir || "src"} ====\n\n`;
    filePaths.forEach((filePath) => {
        const fileName = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath, "utf8");
        content += `// Archivo: ${fileName}\n${fileContent}\n\n`;
    });
}

// Escribir todo en el archivo final
fs.writeFileSync(outputFile, content);

console.log(`✅ Archivos .ts y .tsx combinados en ${outputFile}`);


// Archivo: vite-env.d.ts
/// <reference types="vite/client" />



// ==== Directorio: components ====

// Archivo: ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const isAdminRoute = location.pathname.startsWith("/dashE");

  // 🔹 Si es una ruta de admin pero el usuario no es admin, redirigirlo a Dashboard
  if (isAdminRoute && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // 🔹 Si es una ruta de profesores y el usuario es admin, redirigirlo a DashE
  if (!isAdminRoute && user.role === "admin") {
    return <Navigate to="/dashE" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;



// ==== Directorio: context ====

// Archivo: AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: string; 
}

interface AuthContextType {
  user: UserType | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verifyToken = async (token: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (!decoded.exp || decoded.exp < currentTime) {
        console.warn("Token expirado. Cerrando sesión.");
        logout();
        return;
      }

      // 🔹 Obtener los datos del usuario desde la API
      const response = await api.get("/users/me");
      setUser({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role, // 🔹 Asegúrate de que el backend envíe `role`
      });
    } catch (error) {
      console.error("Error verificando el token:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    sessionStorage.setItem("token", token);
    setLoading(true);
    await verifyToken(token);
    navigate("/dashboard", { replace: true });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Personaliza esto según tus necesidades
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};



// ==== Directorio: hooks ====

// Archivo: useAdminAuth.ts
import { useAuth } from "./useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAdminAuth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/"); // Redirige a la página de inicio si no es admin
    }
  }, [user, navigate]);

  return user?.role === "admin";
};

export default useAdminAuth;


// Archivo: useAuth.ts
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};



// ==== Directorio: pagesAuth ====

// Archivo: LoginPage.tsx
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


// ==== Directorio: pagesDashboard ====

// Archivo: AttendancePage.tsx
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

// Archivo: GradesPage.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Snackbar,
  Alert, // 🔹 Importar Alert para usar en el Snackbar
} from "@mui/material";
import api from "../../utils/api";
import DashboardLayout from "../Layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";

const GradesPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [partials] = useState<number[]>([1, 2, 3]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedPartial, setSelectedPartial] = useState<number | null>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [editedGrades, setEditedGrades] = useState<Record<number, any>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/assignments/user/${user.id}`);
        setAssignments(response.data);
        const uniqueGroups = response.data.reduce((acc: any[], curr: { group_id: number; group_name: string }) => {
          if (!acc.find((g) => g.id === curr.group_id)) {
            acc.push({ id: curr.group_id, name: curr.group_name });
          }
          return acc;
        }, []);
        
        setGroups(uniqueGroups);
        setSubjects([]);
      } catch (error) {
        console.error("Error al obtener asignaciones:", error);
      }
    };

    fetchAssignments();
  }, [user]);

  useEffect(() => {
    if (!selectedGroup) return;
    const relatedSubjects = assignments
      .filter((a) => a.group_id === selectedGroup)
      .map((a) => ({ id: a.subject_id, name: a.subject_name }));
    setSubjects(relatedSubjects);
    setSelectedSubject(null);
  }, [selectedGroup, assignments]);

  const fetchGrades = async () => {
    if (!selectedGroup || !selectedSubject || !selectedPartial) return;
    try {
      const response = await api.get(
        `/grade/group/${selectedGroup}/subject/${selectedSubject}/${selectedPartial}`
      );
      const sortedGrades = response.data.sort((a: any, b: any) => a.matricula.localeCompare(b.matricula));
      setGrades(sortedGrades);
    } catch (error) {
      console.error("Error al obtener calificaciones:", error);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [selectedGroup, selectedSubject, selectedPartial]);

  const handleChange = (id: number, field: string, value: string) => {
    setEditedGrades((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id: number) => {
    try {
      await api.put(`/grade/${id}`, editedGrades[id]);

      setSnackbar({ open: true, message: "Calificación guardada con éxito", severity: "success" });

      setEditedGrades({});
      fetchGrades();
    } catch (error) {
      console.error("Error al actualizar calificación:", error);
      setSnackbar({ open: true, message: "Error al guardar la calificación", severity: "error" });
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 4, bgcolor: "#121212", color: "white", minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom>Gestión de Calificaciones</Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: "white" }}>Grupo</InputLabel>
          <Select
            value={selectedGroup ?? ""}
            onChange={(e) => setSelectedGroup(Number(e.target.value))}
            sx={{ bgcolor: "#282828", color: "white" }}
          >
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: "white" }}>Materia</InputLabel>
          <Select
            value={selectedSubject ?? ""}
            onChange={(e) => setSelectedSubject(Number(e.target.value))}
            sx={{ bgcolor: "#282828", color: "white" }}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: "white" }}>Parcial</InputLabel>
          <Select
            value={selectedPartial ?? ""}
            onChange={(e) => setSelectedPartial(Number(e.target.value))}
            sx={{ bgcolor: "#282828", color: "white" }}
          >
            {partials.map((partial) => (
              <MenuItem key={partial} value={partial}>
                Parcial {partial}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box component={Paper} sx={{ mt: 3, maxHeight: 400, overflow: "auto", bgcolor: "#1E1E1E", p: 2 }}>
          <Typography variant="h6" color="white">Lista de Calificaciones</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Matrícula</TableCell>
                <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                <TableCell sx={{ color: "white" }}>Actividad 1</TableCell>
                <TableCell sx={{ color: "white" }}>Actividad 2</TableCell>
                <TableCell sx={{ color: "white" }}>Asistencia</TableCell>
                <TableCell sx={{ color: "white" }}>Proyecto</TableCell>
                <TableCell sx={{ color: "white" }}>Examen</TableCell>
                <TableCell sx={{ color: "white" }}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell sx={{ color: "white" }}>{grade.matricula}</TableCell>
                  <TableCell sx={{ color: "white" }}>{grade.name}</TableCell>
                  {["activity_1", "activity_2", "attendance", "project", "exam"].map((field) => (
                    <TableCell key={field}>
                      <TextField
                        value={editedGrades[grade.id]?.[field] ?? grade[field]}
                        onChange={(e) => handleChange(grade.id, field, e.target.value)}
                        sx={{ input: { color: "white" }, bgcolor: "#282828" }}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="contained" onClick={() => handleSave(grade.id)} sx={{ bgcolor: "#800080" }}>
                      Guardar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* 🔹 Snackbar para mostrar alertas */}
        <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default GradesPage;


// Archivo: HomePage.tsx
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
import DashboardLayout from "../Layout/DashboardLayout";
import api from "../../utils/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const HomePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<number[]>([]);
  const [gradesData, setGradesData] = useState<number[]>([]);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendanceAverage, setAttendanceAverage] = useState("0%");

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const response = await api.get("/users/homepage/stats");
        setUser(response.data.user);
        setAttendanceData(response.data.attendanceData || [0, 0, 0, 0, 0]);
        setGradesData(response.data.gradesData || [0, 0, 0]);
        setTotalAttendance(response.data.totalAttendance || 0);
        setTotalStudents(response.data.totalStudents || 0);
        setAttendanceAverage(response.data.attendanceAverage || "0%");
      } catch (err) {
        console.error("Error al cargar el homepage:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepage();
  }, []);

  const barData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
    datasets: [
      {
        label: "Asistencias",
        data: attendanceData,
        backgroundColor: "#800080",
      },
    ],
  };

  const pieData = {
    labels: ["1° Grado", "2° Grado", "3° Grado"],
    datasets: [
      {
        data: gradesData,
        backgroundColor: ["#800080", "#9932CC", "#BA55D3"],
      },
    ],
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress color="secondary" />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 4, bgcolor: "#121212", color: "white", minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom>¡Bienvenido a CACE!</Typography>
        <Typography variant="body1" gutterBottom>Tu sesión ha sido confirmada con éxito.</Typography>

        {/* 🔹 Tarjetas Resumen */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#1E1E1E", color: "white", textAlign: "center", p: 2 }}>
              <Typography variant="h6">Total de Asistencias</Typography>
              <Typography variant="h4">{totalAttendance}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#1E1E1E", color: "white", textAlign: "center", p: 2 }}>
              <Typography variant="h6">Estudiantes Registrados</Typography>
              <Typography variant="h4">{totalStudents}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: "#1E1E1E", color: "white", textAlign: "center", p: 2 }}>
              <Typography variant="h6">Promedio de Asistencias</Typography>
              <Typography variant="h4">{attendanceAverage}</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* 🔹 Gráficos */}
        <Grid container spacing={3} sx={{ mt: 2, flexGrow: 1 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: "#1E1E1E", color: "white", height: "100%" }}>
              <CardContent>
                <Typography variant="h6">Asistencias de los últimos meses</Typography>
                <Box sx={{ width: "100%", height: 300 }}>
                  <Bar data={barData} options={{ maintainAspectRatio: false }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: "#1E1E1E", color: "white", height: "100%" }}>
              <CardContent>
                <Typography variant="h6">Asistencias por Grados</Typography>
                <Box sx={{ width: "100%", height: 300 }}>
                  <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default HomePage;



// ==== Directorio: pagesDashE ====

// Archivo: AdminHome.tsx
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


// Archivo: StudentsPage.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import api from "../../utils/api";
import * as XLSX from "xlsx";
import DashELayout from "../Layout/DashELayout";
import useAdminAuth from "../../hooks/useAdminAuth";

const StudentsPage: React.FC = () => {
  const isAdmin = useAdminAuth(); // 🔹 Protege la página para admins

  if (!isAdmin) return null; // 🔹 Evita renderizar si no es admin

  const [professors, setProfessors] = useState<any[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupForAssignment, setSelectedGroupForAssignment] = useState<number | null>(null);
  const [selectedGroupForUpload, setSelectedGroupForUpload] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Obtener profesores, grupos y materias
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [professorsResponse, groupsResponse, subjectsResponse] = await Promise.all([
          api.get("/users/role/professor"),
          api.get("/groups"),
          api.get("/subjects"),
        ]);
        setProfessors(professorsResponse.data);
        setGroups(groupsResponse.data);
        setSubjects(subjectsResponse.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        setPreviewData(jsonData);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleAssign = async () => {
    if (!selectedProfessor || !selectedGroupForAssignment || !selectedSubject) {
      alert("Por favor, selecciona profesor, grupo y materia.");
      return;
    }

    try {
      await api.post("/assignments", {
        user_id: selectedProfessor,
        group_id: selectedGroupForAssignment,
        subject_id: selectedSubject,
      });
      alert("Asignación realizada con éxito.");
    } catch (error) {
      console.error("Error al asignar:", error);
      alert("Error al realizar la asignación.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    if (!selectedGroupForUpload) {
      alert("Por favor, selecciona un grupo antes de subir el archivo.");
      return;
    }

    try {
      await api.post("/upload", { data: previewData, groupId: selectedGroupForUpload });
      alert("Archivo subido con éxito.");
      setFile(null);
      setPreviewData([]);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo.");
    }
  };

  return (
    <DashELayout>
    <Box sx={{ p: 4, bgcolor: "#121212", color: "#ffffff", minHeight: "100vh", overflowY: "auto" }}>
    <Typography variant="h4" gutterBottom>Gestión de Profesores y Estudiantes</Typography>
  
      {/* Asignar Profesor a Grupo y Materia */}
      <Typography variant="h6" sx={{ mt: 3 }}>Asignar Profesor a Grupo y Materia</Typography>
  
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel sx={{ color: "white" }}>Profesor</InputLabel>
        <Select
          value={selectedProfessor ?? ""}
          onChange={(e) => setSelectedProfessor(Number(e.target.value))}
          sx={{
            bgcolor: "#282828", // 🔹 Fondo oscuro
            color: "white", // 🔹 Texto blanco
          }}
          MenuProps={{
            PaperProps: { sx: { bgcolor: "#282828", color: "white" } }, // 🔹 Menú desplegable oscuro
          }}
        >
          {professors.map((professor) => (
            <MenuItem key={professor.id} value={professor.id}>
              {professor.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel sx={{ color: "white" }}>Grupo</InputLabel>
        <Select
          value={selectedGroupForAssignment ?? ""}
          onChange={(e) => setSelectedGroupForAssignment(Number(e.target.value))}
          sx={{
            bgcolor: "#282828",
            color: "white",
          }}
          MenuProps={{
            PaperProps: { sx: { bgcolor: "#282828", color: "white" } },
          }}
        >
          {groups.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel sx={{ color: "white" }}>Materia</InputLabel>
        <Select
          value={selectedSubject ?? ""}
          onChange={(e) => setSelectedSubject(Number(e.target.value))}
          sx={{
            bgcolor: "#282828",
            color: "white",
          }}
          MenuProps={{
            PaperProps: { sx: { bgcolor: "#282828", color: "white" } },
          }}
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  
      <Button variant="contained" sx={{ mt: 2, bgcolor: "#800080", "&:hover": { bgcolor: "#4b0082" } }} onClick={handleAssign}>
        Asignar Materia y Grupo
      </Button>
  
      {/* Subir Lista de Alumnos */}
      <Typography variant="h6" sx={{ mt: 4 }}>Subir Lista de Alumnos</Typography>
  
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel sx={{ color: "white" }}>Grupo para Subida</InputLabel>
        <Select
          value={selectedGroupForUpload ?? ""}
          onChange={(e) => setSelectedGroupForUpload(Number(e.target.value))}
          sx={{
            bgcolor: "#282828",
            color: "white",
          }}
          MenuProps={{
            PaperProps: { sx: { bgcolor: "#282828", color: "white" } },
          }}
        >
          {groups.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  
      <Box sx={{ mt: 2 }}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} style={{ color: "white" }} />
      </Box>
  
      {previewData.length > 0 && (
        <Box component={Paper} sx={{ mt: 4, p: 2, maxHeight: 300, overflowY: "auto", bgcolor: "#1E1E1E" }}>
          <Typography variant="h6">Vista Previa de la Lista</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Matrícula</TableCell>
                <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                <TableCell sx={{ color: "white" }}>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {previewData.map((student, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: "white" }}>{student.matricula}</TableCell>
                  <TableCell sx={{ color: "white" }}>{student.name}</TableCell>
                  <TableCell sx={{ color: "white" }}>{student.email || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
  
      <Button variant="contained" sx={{ mt: 2, bgcolor: "#800080", "&:hover": { bgcolor: "#4b0082" } }} onClick={handleUpload} disabled={!file}>
        Subir Archivo
      </Button>
    </Box>
  </DashELayout>
  
  );
};

export default StudentsPage;


// Archivo: SubjectGroup.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../utils/api";
import DashELayout from "../Layout/DashELayout";

const SubjectGroup: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "success" });

  // 🔹 Función para agregar grupo
  const handleAddGroup = async () => {
    if (!groupName.trim()) {
      setMessage({ text: "El nombre del grupo es obligatorio", type: "error" });
      return;
    }

    try {
      const response = await api.post("/groups", { name: groupName });
      console.log("Grupo agregado:", response.data);
      setMessage({ text: "Grupo agregado con éxito", type: "success" });
      setGroupName("");
    } catch (error) {
      console.error("Error al agregar grupo:", error);
      setMessage({ text: "Error al agregar grupo", type: "error" });
    }
  };

  // 🔹 Función para agregar materia
  const handleAddSubject = async () => {
    if (!subjectName.trim()) {
      setMessage({ text: "El nombre de la materia es obligatorio", type: "error" });
      return;
    }

    try {
      const response = await api.post("/subjects", { name: subjectName });
      console.log("Materia agregada:", response.data);
      setMessage({ text: "Materia agregada con éxito", type: "success" });
      setSubjectName("");
    } catch (error) {
      console.error("Error al agregar materia:", error);
      setMessage({ text: "Error al agregar materia", type: "error" });
    }
  };

  return (
    <DashELayout>
       <Box sx={{ p: 4, bgcolor: "#121212", color: "#ffffff", minHeight: "100vh" }}>
       <Typography variant="h4" gutterBottom>Gestión de Materias y Grupos</Typography>

{/* 🔹 Formulario para agregar grupos */}
<Paper sx={{ p: 3, bgcolor: "#1E1E1E", mb: 3 }}>
  <Typography variant="h6" color="white">Agregar Grupo</Typography>
  <TextField
    fullWidth
    label="Nombre del Grupo"
    variant="outlined"
    sx={{ mt: 2, input: { color: "white" }, bgcolor: "#282828" }}
    value={groupName}
    onChange={(e) => setGroupName(e.target.value)}
    InputLabelProps={{
        style: { color: "white" }, // 🔹 Hace que el label sea blanco
      }}
  />
  <Button
    variant="contained"
    sx={{ mt: 2, bgcolor: "#800080", "&:hover": { bgcolor: "#4b0082" } }}
    onClick={handleAddGroup}
  >
    Guardar Grupo
  </Button>
</Paper>

{/* 🔹 Formulario para agregar materias */}
<Paper sx={{ p: 3, bgcolor: "#1E1E1E" }}>
  <Typography variant="h6" color="white">Agregar Materia</Typography>
  <TextField
    fullWidth
    label="Nombre de la Materia"
    variant="outlined"
    sx={{ mt: 2, input: { color: "white" }, bgcolor: "#282828" }}
    value={subjectName}
    onChange={(e) => setSubjectName(e.target.value)}
      InputLabelProps={{
      style: { color: "white" }, // 🔹 Hace que el label sea blanco
    }}
  />
  <Button
    variant="contained"
    sx={{ mt: 2, bgcolor: "#800080", "&:hover": { bgcolor: "#4b0082" } }}
    onClick={handleAddSubject}
  >
    Guardar Materia
  </Button>
</Paper>

{/* 🔹 Mensajes de éxito/error */}
<Snackbar open={Boolean(message.text)} autoHideDuration={3000} onClose={() => setMessage({ text: "", type: "success" })}>
  <Alert severity={message.type === "error" ? "error" : "success"} sx={{ width: "100%" }}>
    {message.text}
  </Alert>
</Snackbar>
</Box>
</DashELayout>
  );
};

export default SubjectGroup;


// Archivo: UsersPage.tsx
import { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Box } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import api from "../../utils/api";
import DashELayout from "../Layout/DashELayout";
import useAdminAuth from "../../hooks/useAdminAuth";

const UsersPage = () => {
  const isAdmin = useAdminAuth();

  if (!isAdmin) return null;

  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", role: "", password: "" });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleOpen = (user = { name: "", email: "", role: "", password: "" }) => {
    setFormData(user);
    setEditMode(!!user.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { id, ...data } = formData;

      if (editMode) {
        delete data.password; // No enviar password en edición
        await api.put(`/users/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/users/register", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error("Error saving user", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        const token = sessionStorage.getItem("token");
        await api.delete(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  return (
    <DashELayout>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, minHeight: "100vh", p: 4, bgcolor: "#121212", color: "#ffffff" }}>
  <Typography variant="h4" gutterBottom>Gestión de Usuarios</Typography>
        <Button 
          variant="contained" 
          sx={{ bgcolor: "#800080", "&:hover": { bgcolor: "#4b0082" } }} 
          onClick={() => handleOpen()}
        >
          Crear Usuario
        </Button>
        <TableContainer component={Paper} sx={{ mt: 2, bgcolor: "#1E1E1E", flexGrow: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#ffffff" }}>Nombre</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>Email</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>Rol</TableCell>
                <TableCell sx={{ color: "#ffffff" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ color: "#ffffff" }}>{user.name}</TableCell>
                  <TableCell sx={{ color: "#ffffff" }}>{user.email}</TableCell>
                  <TableCell sx={{ color: "#ffffff" }}>{user.role}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpen(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton sx={{ color: "#ff1744" }} onClick={() => handleDelete(user.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { bgcolor: "#1E1E1E", color: "#ffffff" } }}>
        <DialogTitle>{editMode ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" name="name" label="Nombre" value={formData.name} onChange={handleChange} InputLabelProps={{ style: { color: "#ffffff" } }} sx={{ input: { color: "#ffffff" } }} />
          <TextField fullWidth margin="dense" name="email" label="Email" value={formData.email} onChange={handleChange} InputLabelProps={{ style: { color: "#ffffff" } }} sx={{ input: { color: "#ffffff" } }} />
          
          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ color: "#ffffff" }}>Rol</InputLabel>
            <Select name="role" value={formData.role} onChange={handleChange} sx={{ color: "#ffffff" }}>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="professor">Professor</MenuItem>
            </Select>
          </FormControl>

          {!editMode && (
            <TextField fullWidth margin="dense" name="password" label="Contraseña" type="password" value={formData.password} onChange={handleChange} InputLabelProps={{ style: { color: "#ffffff" } }} sx={{ input: { color: "#ffffff" } }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#ffffff" }}>Cancelar</Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: "#800080", "&:hover": { bgcolor: "#4b0082" } }} 
            onClick={handleSubmit}
          >
            {editMode ? "Guardar Cambios" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashELayout>
  );
};

export default UsersPage;



// ==== Directorio: pagesLayout ====

// Archivo: DashboardLayout.tsx
import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Drawer, IconButton } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import MenuIcon from "@mui/icons-material/Menu";

const sidebarItems = [
  { label: "Inicio", route: "/dashboard" },
  { label: "Calificaciones", route: "/dashboard/grades" },
  { label: "Asistencia", route: "/dashboard/attendance" },
];

const drawerWidth = 250; // Ancho fijo del sidebar

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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
        Bienvenido, {user?.name || "Usuario"}
      </Typography>
      <List sx={{ flexGrow: 1 }}>
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
          zIndex: 1200, // Asegura que no quede por debajo del contenido
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

export default DashboardLayout;

// Archivo: DashELayout.tsx
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



// ==== Directorio: utils ====

// Archivo: api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "/"; // Redirige al login
    }
    return Promise.reject(error);
  }
);


export default api;




// Archivo: main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  
        <App />
);



// Archivo: merge.ts
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Si merge.ts está en src, entonces los archivos están en subdirectorios de src
const folderPath = path.resolve(__dirname); // Ya estamos en src
const outputFile = path.resolve(__dirname, "todos.tsx"); // Archivo de salida

// Función para recorrer directorios y leer archivos .ts y .tsx
const getFilesRecursively = (dir: string): string[] => {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results; // Verifica que el directorio existe

    const list = fs.readdirSync(dir);

    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(getFilesRecursively(filePath)); // Si es directorio, busca recursivamente
        } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
            results.push(filePath); // Agregar solo archivos .ts y .tsx
        }
    });

    return results;
};

// Obtener todos los archivos .ts y .tsx dentro de `src/`
const files = getFilesRecursively(folderPath);

// Organizar archivos por directorio
const filesByDirectory: Record<string, string[]> = {};

// Clasificar archivos por carpeta
files.forEach((filePath) => {
    const relativeDir = path.dirname(filePath).replace(folderPath, "").replace(/^\/|\\/g, "");
    if (!filesByDirectory[relativeDir]) {
        filesByDirectory[relativeDir] = [];
    }
    filesByDirectory[relativeDir].push(filePath);
});

let content = "";

// Recorrer los directorios y escribir los archivos dentro de cada uno
for (const [dir, filePaths] of Object.entries(filesByDirectory)) {
    content += `\n// ==== Directorio: ${dir || "src"} ====\n\n`;
    filePaths.forEach((filePath) => {
        const fileName = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath, "utf8");
        content += `// Archivo: ${fileName}\n${fileContent}\n\n`;
    });
}

// Escribir todo en el archivo final
fs.writeFileSync(outputFile, content);

console.log(`✅ Archivos .ts y .tsx combinados en ${outputFile}`);


// Archivo: theme.ts
const theme = {
    colors: {
      background: "#F2F2F2",
      card: "#F4F3F2",
      dashboardBackground: "#08DC2B", // 🟢 Fondo verde solo para el Dashboard
      primary: "#08DC2B",
      error: "#C4493A",
      text: "#131515",
    },
    fontFamily: "Helvetica Now, sans-serif",
  };
  
  export default theme;
  

// Archivo: vite-env.d.ts
/// <reference types="vite/client" />



// ==== Directorio: components ====

// Archivo: ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import { Backdrop } from "@mui/material";

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Backdrop open sx={{ zIndex: 9999, bgcolor: "rgba(0, 0, 0, 0.8)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <CircularProgress color="secondary" size={80} />
        </motion.div>
      </Backdrop>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const isAdminRoute = location.pathname.startsWith("/dashE");

  // 🔹 Si es una ruta de admin pero el usuario no es admin, redirigir a Dashboard
  if (isAdminRoute && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // 🔹 Si es una ruta de profesores y el usuario es admin, redirigirlo a DashE
  if (!isAdminRoute && user.role === "admin") {
    return <Navigate to="/dashE" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;



// ==== Directorio: context ====

// Archivo: AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: string; 
}

interface AuthContextType {
  user: UserType | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const verifyToken = async (token: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (!decoded.exp || decoded.exp < currentTime) {
        console.warn("Token expirado. Cerrando sesión.");
        logout();
        return;
      }

      // 🔹 Obtener los datos del usuario desde la API
      const response = await api.get("/users/me");
      setUser({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role, // 🔹 Asegúrate de que el backend envíe `role`
      });
    } catch (error) {
      console.error("Error verificando el token:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string) => {
    sessionStorage.setItem("token", token);
    setLoading(true);
    await verifyToken(token);
    navigate("/dashboard", { replace: true });
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Personaliza esto según tus necesidades
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};



// ==== Directorio: hooks ====

// Archivo: useAdminAuth.ts
import { useAuth } from "./useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAdminAuth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/"); // Redirige a la página de inicio si no es admin
    }
  }, [user, navigate]);

  return user?.role === "admin";
};

export default useAdminAuth;


// Archivo: useAuth.ts
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};



// ==== Directorio: pagesAuth ====

// Archivo: LoginPage.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextField, Button, Grid, Typography, Box, Paper, Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion"; 
import Swal from "sweetalert2"; // Importamos SweetAlert2
import { useAuth } from "../../hooks/useAuth";
import api from "../../utils/api";
import backgroundImage from "../../assets/fondo.jpg";
import theme from "../../theme";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await api.post("users/login", data);
      if (response.status === 200) {
        login(response.data.token);
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 404) {
          setErrorMessage("El correo no está registrado.");
        } else if (err.response.status === 401) {
          setErrorMessage("La contraseña es incorrecta.");
        } else {
          setErrorMessage("Error de conexión.");
        }
      } else {
        setErrorMessage("Error de conexión.");
      }
    }
  };

  // 🔹 Función para mostrar la alerta de recuperación de contraseña
  const handleForgotPassword = () => {
    Swal.fire({
      icon: "info",
      title: "Recuperación de contraseña",
      text: "Por favor, contacta al administrador para restablecer tu contraseña.",
      confirmButtonText: "Entendido",
      confirmButtonColor: theme.colors.primary,
      background: theme.colors.card,
      color: theme.colors.text,
    });
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme.fontFamily,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderRadius: "15px",
            padding: "2rem",
            width: "70%",
            height: "auto",
            maxWidth: 400,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            fontFamily: theme.fontFamily,
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: 3, fontWeight: "bold", color: theme.colors.text, fontFamily: theme.fontFamily }}
          >
            Bienvenido a CACE
          </Typography>
          <Typography
            
            sx={{ textAlign: "center", mb: 3, fontStyle: "italic", color: theme.colors.text, fontFamily: theme.fontFamily }}
          >
            "Más control, menos esfuerzo, mejores resultados"
          </Typography>

          <motion.div
            initial={{ x: 0 }}
            animate={errorMessage ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                variant="outlined"
                InputLabelProps={{ style: { color: theme.colors.text, fontFamily: theme.fontFamily } }}
                InputProps={{
                  style: {
                    color: theme.colors.text,
                    backgroundColor: theme.colors.card,
                    borderRadius: "10px",
                    fontFamily: theme.fontFamily,
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

              <TextField
                margin="normal"
                fullWidth
                type="password"
                label="Contraseña"
                variant="outlined"
                InputLabelProps={{ style: { color: theme.colors.text, fontFamily: theme.fontFamily } }}
                InputProps={{
                  style: {
                    color: theme.colors.text,
                    backgroundColor: theme.colors.card,
                    borderRadius: "10px",
                    fontFamily: theme.fontFamily,
                  },
                }}
                {...register("password", { required: "La contraseña es obligatoria." })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: theme.colors.primary,
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    fontFamily: theme.fontFamily,
                    "&:hover": { backgroundColor: "#06B224" },
                  }}
                >
                  Iniciar Sesión
                </Button>
              </motion.div>

              {/* 🔹 Enlace de "Olvidaste tu contraseña?" */}
              <Typography
                sx={{
                  color: theme.colors.text,
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": { color: theme.colors.primary },
                  fontSize: "0.9rem",
                  mt: 1,
                }}
                onClick={handleForgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </Typography>
            </Box>
          </motion.div>

          <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage(null)}>
            <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: "100%", backgroundColor: theme.colors.error, color: "#fff", fontFamily: theme.fontFamily }}>
              {errorMessage}
            </Alert>
          </Snackbar>
        </Paper>
      </motion.div>
    </Grid>
  );
};

export default LoginPage;



// ==== Directorio: pagesDashboard ====

// Archivo: AttendancePage.tsx
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
import theme from "../../theme"; // 🔹 Importar el tema

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

  const handleStatusChange = (studentId: number, newStatus: Attendance["status"]) => {
    setAttendanceData(attendanceData.map(att =>
      att.student_id === studentId ? { ...att, status: newStatus } : att
    ));
  };

  const handleSendAttendance = async () => {
    if (!selectedGroup || !selectedSubject) {
      setSnackbar({ open: true, message: "Selecciona un grupo y una materia antes de enviar la asistencia", severity: "error" });
      return;
    }

    try {
      await axios.post(`/attendances/submit`, {
        group_id: selectedGroup,
        subject_id: selectedSubject,
        date: new Date().toISOString().split("T")[0],
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

  return (
    <DashboardLayout>
      <Box sx={{ p: 4, bgcolor: theme.colors.background, color: theme.colors.text, minHeight: "100vh", fontFamily: theme.fontFamily }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color={theme.colors.primary}>
          Registro de Asistencias
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: theme.colors.text }}>Grupo y Materia</InputLabel>
          <Select
            value={selectedGroup && selectedSubject ? `${selectedGroup}-${selectedSubject}` : ""}
            onChange={(e) => {
              const [groupId, subjectId] = e.target.value.split("-");
              setSelectedGroup(groupId);
              setSelectedSubject(subjectId);
            }}
            sx={{ bgcolor: theme.colors.card, color: theme.colors.text }}
          >
            {assignments.map((assignment) => (
              <MenuItem key={`${assignment.group_id}-${assignment.subject_id}`} value={`${assignment.group_id}-${assignment.subject_id}`}>
                {`${assignment.subject_name} - ${assignment.group_name}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box component={Paper} sx={{ mt: 3, maxHeight: 400, overflow: "auto", bgcolor: theme.colors.card, p: 2 }}>
          <Typography variant="h6" color={theme.colors.text}>Lista de Asistencias</Typography>
          {isLoading ? (
            <Typography color={theme.colors.text}>Cargando asistencias...</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {["Matrícula", "Nombre", "Estado"].map((header) => (
                    <TableCell key={header} sx={{ color: theme.colors.text }}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ color: theme.colors.text, textAlign: "center" }}>
                      No hay datos de asistencia
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceData.map(attendance => (
                    <TableRow key={attendance.student_id}>
                      <TableCell sx={{ color: theme.colors.text }}>{attendance.matricula}</TableCell>
                      <TableCell sx={{ color: theme.colors.text }}>{attendance.name}</TableCell>
                      <TableCell>
                        <FormControl sx={{ minWidth: 120 }}>
                          <Select
                            value={attendance.status}
                            onChange={(e) => handleStatusChange(attendance.student_id, e.target.value as Attendance["status"])}
                            sx={{ bgcolor: theme.colors.card, color: theme.colors.text }}
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

        <Button variant="contained" onClick={handleSendAttendance} sx={{ mt: 3, bgcolor: theme.colors.primary }}>
          Enviar Asistencia
        </Button>

        <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default AttendancePage;


// Archivo: GradesPage.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../utils/api";
import DashboardLayout from "../Layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import theme from "../../theme"; // 🔹 Importar el tema

const GradesPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [partials] = useState<number[]>([1, 2, 3]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedPartial, setSelectedPartial] = useState<number | null>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [editedGrades, setEditedGrades] = useState<Record<number, any>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(`/assignments/user/${user.id}`);
        setAssignments(response.data);
        const uniqueGroups = response.data.reduce((acc: any[], curr: { group_id: number; group_name: string }) => {
          if (!acc.find((g) => g.id === curr.group_id)) {
            acc.push({ id: curr.group_id, name: curr.group_name });
          }
          return acc;
        }, []);
        setGroups(uniqueGroups);
        setSubjects([]);
      } catch (error) {
        console.error("Error al obtener asignaciones:", error);
      }
    };

    fetchAssignments();
  }, [user]);

  useEffect(() => {
    if (!selectedGroup) return;
    const relatedSubjects = assignments
      .filter((a) => a.group_id === selectedGroup)
      .map((a) => ({ id: a.subject_id, name: a.subject_name }));
    setSubjects(relatedSubjects);
    setSelectedSubject(null);
  }, [selectedGroup, assignments]);

  const fetchGrades = async () => {
    if (!selectedGroup || !selectedSubject || !selectedPartial) return;
    try {
      const response = await api.get(
        `/grade/group/${selectedGroup}/subject/${selectedSubject}/${selectedPartial}`
      );
      const sortedGrades = response.data.sort((a: any, b: any) => a.matricula.localeCompare(b.matricula));
      setGrades(sortedGrades);
    } catch (error) {
      console.error("Error al obtener calificaciones:", error);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [selectedGroup, selectedSubject, selectedPartial]);

  const handleChange = (id: number, field: string, value: string) => {
    setEditedGrades((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id: number) => {
    try {
      await api.put(`/grade/${id}`, editedGrades[id]);

      setSnackbar({ open: true, message: "Calificación guardada con éxito", severity: "success" });

      setEditedGrades({});
      fetchGrades();
    } catch (error) {
      console.error("Error al actualizar calificación:", error);
      setSnackbar({ open: true, message: "Error al guardar la calificación", severity: "error" });
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 4, bgcolor: theme.colors.background, color: theme.colors.text, minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color={theme.colors.primary}>
          Gestión de Calificaciones
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: theme.colors.text }}>Grupo</InputLabel>
          <Select
            value={selectedGroup ?? ""}
            onChange={(e) => setSelectedGroup(Number(e.target.value))}
            sx={{ bgcolor: theme.colors.card, color: theme.colors.text }}
          >
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: theme.colors.text }}>Materia</InputLabel>
          <Select
            value={selectedSubject ?? ""}
            onChange={(e) => setSelectedSubject(Number(e.target.value))}
            sx={{ bgcolor: theme.colors.card, color: theme.colors.text }}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: theme.colors.text }}>Parcial</InputLabel>
          <Select
            value={selectedPartial ?? ""}
            onChange={(e) => setSelectedPartial(Number(e.target.value))}
            sx={{ bgcolor: theme.colors.card, color: theme.colors.text }}
          >
            {partials.map((partial) => (
              <MenuItem key={partial} value={partial}>
                Parcial {partial}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box component={Paper} sx={{ mt: 3, maxHeight: 400, overflow: "auto", bgcolor: theme.colors.card, p: 2 }}>
          <Typography variant="h6" color={theme.colors.text}>Lista de Calificaciones</Typography>
          <Table>
            <TableHead>
              <TableRow>
                {["Matrícula", "Nombre", "Actividad 1", "Actividad 2", "Asistencia", "Proyecto", "Examen", "Acción"].map((header) => (
                  <TableCell key={header} sx={{ color: theme.colors.text }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell sx={{ color: theme.colors.text }}>{grade.matricula}</TableCell>
                  <TableCell sx={{ color: theme.colors.text }}>{grade.name}</TableCell>
                  {["activity_1", "activity_2", "attendance", "project", "exam"].map((field) => (
                    <TableCell key={field}>
                      <TextField
                        value={editedGrades[grade.id]?.[field] ?? grade[field]}
                        onChange={(e) => handleChange(grade.id, field, e.target.value)}
                        sx={{ input: { color: theme.colors.text }, bgcolor: theme.colors.card }}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="contained" onClick={() => handleSave(grade.id)} sx={{ bgcolor: theme.colors.primary }}>
                      Guardar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* 🔹 Snackbar para mostrar alertas */}
        <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </DashboardLayout>
  );
};

export default GradesPage;


// Archivo: HomePage.tsx
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
import DashboardLayout from "../Layout/DashboardLayout";
import api from "../../utils/api";
import theme from "../../theme";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const HomePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<number[]>([]);
  const [gradesData, setGradesData] = useState<number[]>([]);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendanceAverage, setAttendanceAverage] = useState("0%");

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const response = await api.get("/users/homepage/stats");
        setUser(response.data.user);
        setAttendanceData(response.data.attendanceData || [0, 0, 0, 0, 0]);
        setGradesData(response.data.gradesData || [0, 0, 0]);
        setTotalAttendance(response.data.totalAttendance || 0);
        setTotalStudents(response.data.totalStudents || 0);
        setAttendanceAverage(response.data.attendanceAverage || "0%");
      } catch (err) {
        console.error("Error al cargar el homepage:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepage();
  }, []);

  const barData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
    datasets: [
      {
        label: "Asistencias",
        data: attendanceData,
        backgroundColor: "#08DC2B", // 🟢 Verde brillante para barras
        borderColor: "#131515", // 🔳 Contorno oscuro
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["1° Grado", "2° Grado", "3° Grado"],
    datasets: [
      {
        data: gradesData,
        backgroundColor: ["#08DC2B", "#2B2C28", "#131515"], // 🟢 Verde + grises para diferenciación
      },
    ],
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress color="secondary" />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 4, bgcolor: theme.colors.background, color: theme.colors.text, minHeight: "100vh", fontFamily: theme.fontFamily }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="#08DC2B">
          {/* 🟢 Verde brillante en el título principal */}
          ¡Bienvenido a CACE!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Tu sesión ha sido confirmada con éxito.
        </Typography>

        {/* Tarjetas Resumen */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[{ label: "Total de Asistencias", value: totalAttendance }, { label: "Estudiantes Registrados", value: totalStudents }, { label: "Promedio de Asistencias", value: attendanceAverage }].map(
            (item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ bgcolor: theme.colors.card, color: theme.colors.text, textAlign: "center", p: 2, borderRadius: "10px", border: `2px solid #08DC2B` }}>
                  {/* 🟢 Tarjetas con borde verde para resaltar */}
                  <Typography variant="h6">{item.label}</Typography>
                  <Typography variant="h4">{item.value}</Typography>
                </Card>
              </Grid>
            )
          )}
        </Grid>

        {/* 🔹 Gráficos */}
        <Grid container spacing={3} sx={{ mt: 2, flexGrow: 1 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: "#FFF6F7", color: theme.colors.text, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" color="#08DC2B"> {/* 🟢 Título verde */}
                  Asistencias de los últimos meses
                </Typography>
                <Box sx={{ width: "100%", height: 300 }}>
                  <Bar data={barData} options={{ maintainAspectRatio: false }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: "#FFF6F7", color: theme.colors.text, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" color="#08DC2B"> {/* 🟢 Título verde */}
                  Asistencias por Grados
                </Typography>
                <Box sx={{ width: "100%", height: 300 }}>
                  <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default HomePage;



// ==== Directorio: pagesDashE ====

// Archivo: AdminHome.tsx
import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, CircularProgress, Box } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DashELayout from "../Layout/DashELayout";
import api from "../../utils/api";
import theme from "../../theme";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
    labels: ["Administradores", "Profesores"],
    datasets: [
      {
        label: "Cantidad",
        data: usersByRole,
        backgroundColor: theme.colors.primary, // 🟢 Verde brillante
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
      <Box sx={{ p: 4, bgcolor: theme.colors.background, color: theme.colors.text, minHeight: "100vh", fontFamily: theme.fontFamily }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color={theme.colors.primary}>
          Panel de Administración
        </Typography>
        <Typography variant="body1" gutterBottom>
          Vista general del sistema.
        </Typography>

        {/* Tarjetas Resumen */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[
            { label: "Usuarios Totales", value: totalUsers },
            { label: "Materias Registradas", value: totalSubjects },
            { label: "Grupos Registrados", value: totalGroups },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ bgcolor: theme.colors.card, color: theme.colors.text, textAlign: "center", p: 2, borderRadius: "10px", border: `2px solid ${theme.colors.primary}` }}>
                <Typography variant="h6">{item.label}</Typography>
                <Typography variant="h4">{item.value}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: theme.colors.card, color: theme.colors.text, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" color={theme.colors.primary}>
                  Usuarios por Rol
                </Typography>
                <Box sx={{ width: "100%", height: 300 }}>
                  <Bar data={barData} options={{ maintainAspectRatio: false }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashELayout>
  );
};

export default AdminHome;


// Archivo: StudentsPage.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import api from "../../utils/api";
import * as XLSX from "xlsx";
import DashELayout from "../Layout/DashELayout";
import useAdminAuth from "../../hooks/useAdminAuth";
import theme from "../../theme";

const StudentsPage: React.FC = () => {
  const isAdmin = useAdminAuth();

  if (!isAdmin) return null;

  const [professors, setProfessors] = useState<any[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<number | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupForAssignment, setSelectedGroupForAssignment] = useState<number | null>(null);
  const [selectedGroupForUpload, setSelectedGroupForUpload] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [professorsResponse, groupsResponse, subjectsResponse] = await Promise.all([
          api.get("/users/role/professor"),
          api.get("/groups"),
          api.get("/subjects"),
        ]);
        setProfessors(professorsResponse.data);
        setGroups(groupsResponse.data);
        setSubjects(subjectsResponse.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        setPreviewData(jsonData);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleAssign = async () => {
    if (!selectedProfessor || !selectedGroupForAssignment || !selectedSubject) {
      alert("Por favor, selecciona profesor, grupo y materia.");
      return;
    }

    try {
      await api.post("/assignments", {
        user_id: selectedProfessor,
        group_id: selectedGroupForAssignment,
        subject_id: selectedSubject,
      });
      alert("Asignación realizada con éxito.");
    } catch (error) {
      console.error("Error al asignar:", error);
      alert("Error al realizar la asignación.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    if (!selectedGroupForUpload) {
      alert("Por favor, selecciona un grupo antes de subir el archivo.");
      return;
    }

    try {
      await api.post("/upload", { data: previewData, groupId: selectedGroupForUpload });
      alert("Archivo subido con éxito.");
      setFile(null);
      setPreviewData([]);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo.");
    }
  };

  return (
    <DashELayout>
      <Box sx={{ p: 4, bgcolor: theme.colors.background, color: theme.colors.text, minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color={theme.colors.primary}>
          Gestión de Profesores y Estudiantes
        </Typography>

        {/* Asignar Profesor a Grupo y Materia */}
        <Typography variant="h6" sx={{ mt: 3 }} color={theme.colors.primary}>
          Asignar Profesor a Grupo y Materia
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: theme.colors.text }}>Profesor</InputLabel>
          <Select
            value={selectedProfessor ?? ""}
            onChange={(e) => setSelectedProfessor(Number(e.target.value))}
            sx={{
              bgcolor: theme.colors.card,
              color: theme.colors.text,
            }}
          >
            {professors.map((professor) => (
              <MenuItem key={professor.id} value={professor.id}>
                {professor.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: theme.colors.text }}>Grupo</InputLabel>
          <Select
            value={selectedGroupForAssignment ?? ""}
            onChange={(e) => setSelectedGroupForAssignment(Number(e.target.value))}
            sx={{
              bgcolor: theme.colors.card,
              color: theme.colors.text,
            }}
          >
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" sx={{ mt: 2, bgcolor: theme.colors.primary, "&:hover": { bgcolor: theme.colors.secondary } }} onClick={handleAssign}>
          Asignar Materia y Grupo
        </Button>

        {/* Subir Lista de Alumnos */}
        <Typography variant="h6" sx={{ mt: 4 }} color={theme.colors.primary}>
          Subir Lista de Alumnos
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: theme.colors.text }}>Grupo para Subida</InputLabel>
          <Select
            value={selectedGroupForUpload ?? ""}
            onChange={(e) => setSelectedGroupForUpload(Number(e.target.value))}
            sx={{
              bgcolor: theme.colors.card,
              color: theme.colors.text,
            }}
          >
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} style={{ color: theme.colors.text }} />
        </Box>

        {previewData.length > 0 && (
          <Box component={Paper} sx={{ mt: 4, p: 2, maxHeight: 300, overflowY: "auto", bgcolor: theme.colors.card }}>
            <Typography variant="h6" color={theme.colors.primary}>
              Vista Previa de la Lista
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: theme.colors.text }}>Matrícula</TableCell>
                  <TableCell sx={{ color: theme.colors.text }}>Nombre</TableCell>
                  <TableCell sx={{ color: theme.colors.text }}>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previewData.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: theme.colors.text }}>{student.matricula}</TableCell>
                    <TableCell sx={{ color: theme.colors.text }}>{student.name}</TableCell>
                    <TableCell sx={{ color: theme.colors.text }}>{student.email || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        <Button variant="contained" sx={{ mt: 2, bgcolor: theme.colors.primary, "&:hover": { bgcolor: theme.colors.secondary } }} onClick={handleUpload} disabled={!file}>
          Subir Archivo
        </Button>
      </Box>
    </DashELayout>
  );
};

export default StudentsPage;


// Archivo: SubjectGroup.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../utils/api";
import DashELayout from "../Layout/DashELayout";
import theme from "../../theme";

const SubjectGroup: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "success" });

  // 🔹 Función para agregar grupo
  const handleAddGroup = async () => {
    if (!groupName.trim()) {
      setMessage({ text: "El nombre del grupo es obligatorio", type: "error" });
      return;
    }

    try {
      const response = await api.post("/groups", { name: groupName });
      console.log("Grupo agregado:", response.data);
      setMessage({ text: "Grupo agregado con éxito", type: "success" });
      setGroupName("");
    } catch (error) {
      console.error("Error al agregar grupo:", error);
      setMessage({ text: "Error al agregar grupo", type: "error" });
    }
  };

  // 🔹 Función para agregar materia
  const handleAddSubject = async () => {
    if (!subjectName.trim()) {
      setMessage({ text: "El nombre de la materia es obligatorio", type: "error" });
      return;
    }

    try {
      const response = await api.post("/subjects", { name: subjectName });
      console.log("Materia agregada:", response.data);
      setMessage({ text: "Materia agregada con éxito", type: "success" });
      setSubjectName("");
    } catch (error) {
      console.error("Error al agregar materia:", error);
      setMessage({ text: "Error al agregar materia", type: "error" });
    }
  };

  return (
    <DashELayout>
      <Box sx={{ p: 4, bgcolor: theme.colors.background, color: theme.colors.text, minHeight: "100vh" }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color={theme.colors.primary}>
          Gestión de Materias y Grupos
        </Typography>

        {/* 🔹 Formulario para agregar grupos */}
        <Paper sx={{ p: 3, bgcolor: theme.colors.card, mb: 3, borderRadius: "10px" }}>
          <Typography variant="h6" color={theme.colors.primary}>
            Agregar Grupo
          </Typography>
          <TextField
            fullWidth
            label="Nombre del Grupo"
            variant="outlined"
            sx={{ mt: 2, input: { color: theme.colors.text }, bgcolor: theme.colors.background }}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            InputLabelProps={{ style: { color: theme.colors.text } }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, bgcolor: theme.colors.primary, "&:hover": { bgcolor: theme.colors.secondary } }}
            onClick={handleAddGroup}
          >
            Guardar Grupo
          </Button>
        </Paper>

        {/* 🔹 Formulario para agregar materias */}
        <Paper sx={{ p: 3, bgcolor: theme.colors.card, borderRadius: "10px" }}>
          <Typography variant="h6" color={theme.colors.primary}>
            Agregar Materia
          </Typography>
          <TextField
            fullWidth
            label="Nombre de la Materia"
            variant="outlined"
            sx={{ mt: 2, input: { color: theme.colors.text }, bgcolor: theme.colors.background }}
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            InputLabelProps={{ style: { color: theme.colors.text } }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, bgcolor: theme.colors.primary, "&:hover": { bgcolor: theme.colors.secondary } }}
            onClick={handleAddSubject}
          >
            Guardar Materia
          </Button>
        </Paper>

        {/* 🔹 Mensajes de éxito/error */}
        <Snackbar open={Boolean(message.text)} autoHideDuration={3000} onClose={() => setMessage({ text: "", type: "success" })}>
          <Alert severity={message.type === "error" ? "error" : "success"} sx={{ width: "100%" }}>
            {message.text}
          </Alert>
        </Snackbar>
      </Box>
    </DashELayout>
  );
};

export default SubjectGroup;


// Archivo: UsersPage.tsx
import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import api from "../../utils/api";
import DashELayout from "../Layout/DashELayout";
import useAdminAuth from "../../hooks/useAdminAuth";
import theme from "../../theme";

const UsersPage = () => {
  const isAdmin = useAdminAuth();

  if (!isAdmin) return null;

  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", role: "", password: "" });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleOpen = (user = { name: "", email: "", role: "", password: "" }) => {
    setFormData(user);
    setEditMode(!!user.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const { id, ...data } = formData;

      if (editMode) {
        delete data.password;
        await api.put(`/users/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/users/register", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error("Error saving user", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        const token = sessionStorage.getItem("token");
        await api.delete(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  return (
    <DashELayout>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, minHeight: "100vh", p: 4, bgcolor: theme.colors.background, color: theme.colors.text }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color={theme.colors.primary}>
          Gestión de Usuarios
        </Typography>

        <Button
          variant="contained"
          sx={{ bgcolor: theme.colors.primary, "&:hover": { bgcolor: theme.colors.secondary } }}
          onClick={() => handleOpen()}
        >
          Crear Usuario
        </Button>

        <TableContainer component={Paper} sx={{ mt: 2, bgcolor: theme.colors.card, flexGrow: 1, borderRadius: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: theme.colors.text }}>Nombre</TableCell>
                <TableCell sx={{ color: theme.colors.text }}>Email</TableCell>
                <TableCell sx={{ color: theme.colors.text }}>Rol</TableCell>
                <TableCell sx={{ color: theme.colors.text }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ color: theme.colors.text }}>{user.name}</TableCell>
                  <TableCell sx={{ color: theme.colors.text }}>{user.email}</TableCell>
                  <TableCell sx={{ color: theme.colors.text }}>{user.role}</TableCell>
                  <TableCell>
                    <IconButton sx={{ color: theme.colors.primary }} onClick={() => handleOpen(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton sx={{ color: "#ff1744" }} onClick={() => handleDelete(user.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { bgcolor: theme.colors.card, color: theme.colors.text } }}>
        <DialogTitle>{editMode ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            name="name"
            label="Nombre"
            value={formData.name}
            onChange={handleChange}
            InputLabelProps={{ style: { color: theme.colors.text } }}
            sx={{ input: { color: theme.colors.text }, bgcolor: theme.colors.background }}
          />
          <TextField
            fullWidth
            margin="dense"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            InputLabelProps={{ style: { color: theme.colors.text } }}
            sx={{ input: { color: theme.colors.text }, bgcolor: theme.colors.background }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ color: theme.colors.text }}>Rol</InputLabel>
            <Select name="role" value={formData.role} onChange={handleChange} sx={{ color: theme.colors.text, bgcolor: theme.colors.background }}>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="professor">Professor</MenuItem>
            </Select>
          </FormControl>

          {!editMode && (
            <TextField
              fullWidth
              margin="dense"
              name="password"
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={handleChange}
              InputLabelProps={{ style: { color: theme.colors.text } }}
              sx={{ input: { color: theme.colors.text }, bgcolor: theme.colors.background }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: theme.colors.text }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: theme.colors.primary, "&:hover": { bgcolor: theme.colors.secondary } }}
            onClick={handleSubmit}
          >
            {editMode ? "Guardar Cambios" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashELayout>
  );
};

export default UsersPage;



// ==== Directorio: pagesLayout ====

// Archivo: DashboardLayout.tsx
import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, Drawer, IconButton, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import MenuIcon from "@mui/icons-material/Menu";

const sidebarItems = [
  { label: "Inicio", route: "/dashboard" },
  { label: "Calificaciones", route: "/dashboard/grades" },
  { label: "Asistencia", route: "/dashboard/attendance" },
];

const drawerWidth = 250; // Ancho fijo del sidebar

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActiveTab = (route: string) => location.pathname === route;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: "#2B2C28", // 🔳 Gris oscuro elegante para el Sidebar
        p: 2,
        height: "95%",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "#F2F2F2" }}>
        {/* 🟢 Texto del usuario en verde brillante */}
        Bienvenido, {user?.name || "Usuario"}
      </Typography>

      <List sx={{ flexGrow: 1 }}>
        {sidebarItems.map(({ label, route }) => (
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

export default DashboardLayout;


// Archivo: DashELayout.tsx
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



// ==== Directorio: utils ====

// Archivo: api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "/"; // Redirige al login
    }
    return Promise.reject(error);
  }
);


export default api;


