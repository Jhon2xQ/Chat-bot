import fs from "fs";
import DocumentService from "./services/document.service.js";
import ChatService from "./services/chat.service.js";

export default class RaqController {
  constructor() {
    this.documentService = new DocumentService();
    this.chatService = new ChatService();
  }

  uploadData = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No se envió archivo." });
      }

      const filePath = req.file.path;
      const folder = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(folder);

      await this.documentService.createIndex(data);

      fs.unlinkSync(filePath);

      res.status(201).json({ message: "✅ Índice creado desde archivo JSON." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al procesar archivo." });
    }
  };

  askQuestion = async (req, res) => {
    try {
      const { question } = req.body;

      if (!question) {
        return res.status(400).json({ error: "Pregunta no enviada." });
      }

      const answer = await this.chatService.askQuestion(question);

      res.status(200).json({ answer });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al procesar pregunta." });
    }
  };
}
