import { ChatOllama } from "@langchain/ollama";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import DocumentService from "./document.service.js";
import { PromptTemplate } from "@langchain/core/prompts";

export default class ChatService {
  constructor() {
    this.documentService = new DocumentService();
    this.llm = new ChatOllama({
      model: "gemma2:2b",
      baseUrl: "http://localhost:11434",
    });

    this.prompt = PromptTemplate.fromTemplate(
      `
      Eres un asistente que responde preguntas sobre trámites.
      
      Como asistente siempre responderas en Español.
      
      Usa SOLO la información proporcionada en el siguiente contexto para responder la pregunta del usuario.
      {context}
      
      Si la pregunta no tiene relación o no encuentras suficiente información relevante, responde exactamente: 
      "Lo siento, no tengo información sobre tu pregunta."

      Responde de manera simple y solo lo necesario.
      
      NO INVENTES información. 
      NO completes datos por tu cuenta.

      Pregunta: {input}
      `
    );
  }

  async askQuestion(question) {
    const vectorStore = await this.documentService.loadIndex();
    const retriever = vectorStore.asRetriever({ k: 2 });

    const combineDocsChain = await createStuffDocumentsChain({
      llm: this.llm,
      prompt: this.prompt,
    });

    const retrievalChain = await createRetrievalChain({
      combineDocsChain,
      retriever,
    });

    const response = await retrievalChain.invoke({ input: question });
    return response;
  }
}
