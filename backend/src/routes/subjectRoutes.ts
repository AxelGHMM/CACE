import { Router } from "express";
import * as subjectController from "../controllers/subjectController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/:id", verifyToken, subjectController.getSubjectById);
router.get("/name/:name", verifyToken, subjectController.getSubjectByName);
router.get("/", verifyToken, subjectController.getAllSubjects);
router.post("/", verifyToken, subjectController.createSubject);
router.put("/:id", verifyToken, subjectController.updateSubject);
router.delete("/:id", verifyToken, subjectController.deleteSubject);

export default router;
