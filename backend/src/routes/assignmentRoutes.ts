import { Router } from "express";
import * as assignmentController from "../controllers/assignmentController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/user/:userId", verifyToken, assignmentController.getAssignmentsByUserId);
router.get("/:id", verifyToken, assignmentController.getAssignmentById);
router.post("/", verifyToken, assignmentController.createAssignment);
router.put("/:id", verifyToken, assignmentController.updateAssignment);
router.delete("/:id", verifyToken, assignmentController.deleteAssignment);

export default router;
