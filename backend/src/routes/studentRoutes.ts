import { Router } from "express";
import * as studentController from "../controllers/studentController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/:matricula", verifyToken, studentController.getStudentByMatricula);
router.get("/group/:groupId", verifyToken, studentController.getStudentsByGroup);

export default router;
