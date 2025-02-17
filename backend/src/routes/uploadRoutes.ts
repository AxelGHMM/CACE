import { Router } from "express";
import { uploadStudents } from "../controllers/uploadController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/upload", verifyToken, uploadStudents);

export default router;
