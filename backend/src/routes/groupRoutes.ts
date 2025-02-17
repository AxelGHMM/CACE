import { Router } from "express";
import * as groupController from "../controllers/groupController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// Ruta para obtener un grupo por nombre
router.get("/:name", verifyToken, groupController.getGroupByName);

// Ruta para obtener todos los grupos
router.get("/", verifyToken, groupController.getAllGroups);

// **Nueva ruta para crear un grupo**
router.post("/", verifyToken, groupController.createGroup);

export default router;
