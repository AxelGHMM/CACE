import { Router } from "express";
import * as userController from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// Ruta para crear un usuario
router.post("/register", userController.createUser);

// Ruta para iniciar sesión
router.post("/login", userController.loginUser);
router.get("/homepage", verifyToken, (req, res) => {
    res.status(200).json({ message: "Bienvenido al HomePage", user: req.user });
  });

// Exporta el router como módulo
export default router;
