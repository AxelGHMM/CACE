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
