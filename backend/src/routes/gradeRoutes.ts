import { Router } from "express";
import * as gradeController from "../controllers/gradeController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/group/:groupId/subject/:subjectId/:partial?", verifyToken, gradeController.getGradesByGroupAndSubject);
router.put("/:id", verifyToken, gradeController.updateGrade);
router.get("/professor/:professorId", verifyToken, gradeController.getGradesByProfessor);

export default router;
