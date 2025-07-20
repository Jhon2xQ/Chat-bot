import { OllamaEmbeddings } from "@langchain/ollama";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { Document } from "@langchain/core/documents";

export default class DocumentService {
  constructor() {
    this.embeddings = new OllamaEmbeddings({
      model: "granite-embedding:278m",
      baseUrl: "http://localhost:11434",
    });
  }

  async createIndex(data) {
    const docs = this.buildDocuments(data);
    const vectorStore = await FaissStore.fromDocuments(docs, this.embeddings);
    await vectorStore.save("faiss_index");
  }

  async loadIndex() {
    const vectorStore = await FaissStore.load("faiss_index", this.embeddings);
    return vectorStore;
  }

  buildDocuments(data) {
    return data.map(
      (d) =>
        new Document({
          pageContent: `Trámite: ${d.titulo}\nDescripción: ${d.descripcion}\nRequisitos: ${d.requisitos.join(", ")}`,
          metadata: { titulo: d.titulo },
        })
    );
  }
}
