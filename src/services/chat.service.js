import { Ollama } from "@langchain/community/llms/ollama";
import { RetrievalQAChain } from "langchain/chains";
import DocumentService from "./document.service.js";
import { PromptTemplate } from "@langchain/core/prompts";

export default class ChatService {
  constructor() {
    this.documentService = new DocumentService();
    this.llm = new Ollama({
      model: "gemma3:1b",
      baseUrl: "http://localhost:11434",
    });

    this.prompt = PromptTemplate.fromTemplate(
      `
      Eres un asistente que responde preguntas sobre trámites.
      
      Como asistente siempre responderas en Español.
      
      Usa SOLO la información proporcionada en el siguiente contexto para responder.
      {context}
      
      Si la pregunta no tiene relación o no encuentras suficiente información relevante, responde exactamente: 
      "Lo siento, no tengo información sobre tu pregunta."
      
      NO INVENTES información. 
      NO completes datos por tu cuenta.

      Pregunta: {question}
      `
    );
  }

  async askQuestion(question) {
    const vectorStore = await this.documentService.loadIndex();
    const retriever = vectorStore.asRetriever({ k: 2 });

    const chain = RetrievalQAChain.fromLLM(this.llm, retriever, {
      prompt: this.prompt,
      inputKey: "question",
    });

    const response = await chain.invoke({ question: question });
    return response;
  }
}
