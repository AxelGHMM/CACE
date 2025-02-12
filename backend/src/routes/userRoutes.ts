import { Router } from "express";
import * as userController from "../controllers/userController";

import * as user from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// Ruta para crear un usuario
router.post("/register", userController.createUser);
// src/routes/userRoutes.ts
router.get("/me", verifyToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }
  const user = req.user as { name: string }; // Asegura que `user` tenga el tipo correcto
  res.status(200).json({ name: user.name });
});

// Ruta para iniciar sesión
router.post("/login", userController.loginUser);
router.get("/homepage", verifyToken, (req, res) => {
    res.status(200).json({ message: "Bienvenido al HomePage", user: req.user });
  });

// Exporta el router como módulo
export default router;
