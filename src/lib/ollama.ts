import { TextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function processDocument(file: File): Promise<string> {
  const text = await file.text();
  return text;
}

export async function splitText(text: string): Promise<string[]> {
  const splitter = new TextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const docs = await splitter.createDocuments([text]);
  return docs.map((doc: Document) => doc.pageContent);
}

export async function queryOllama(messages: Message[]): Promise<string> {
  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        messages: messages,
        stream: false,
      }),
    });

    const data = await response.json();
    return data.message.content;
  } catch (error) {
    console.error('Error querying Ollama:', error);
    throw new Error('Failed to get response from Ollama');
  }
}