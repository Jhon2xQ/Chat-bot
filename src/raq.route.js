import multer from "multer";
import { Router } from "express";
import RaqController from "./raq.controller.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

const raqController = new RaqController();

router.post("/upload", upload.single("file"), raqController.uploadData);
router.post("/chat", raqController.askQuestion);

export default router;
