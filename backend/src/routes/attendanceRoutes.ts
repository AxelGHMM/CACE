import { Router } from "express";
import * as attendanceController from "../controllers/attendanceController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// Obtener lista de alumnos de un grupo y materia
router.get("/group/:groupId/subject/:subjectId", verifyToken, attendanceController.getAttendanceByGroupAndSubject);

// Enviar asistencias
router.post("/submit", verifyToken, attendanceController.createAttendances);

export default router;
