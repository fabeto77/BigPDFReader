import axios from 'axios';
import { config } from '../config/config.js';
import Logger from './utils/logger.js';

export class SearchEngine {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: config.api.baseURL,
      timeout: config.api.timeout,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async searchInTextChunk(textChunk, chunkInfo) {
    const prompt = this.buildSearchPrompt(textChunk, chunkInfo);
    
    try {
      const response = await this.client.post('/chat/completions', {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Eres un asistente especializado en análisis de documentos de auditoría. Busca específicamente referencias a la fecha ${config.search.targetDate} y extrae el contenido relevante. Responde SOLO con el texto encontrado que haga referencia a esa fecha, indicando la página donde aparece. Si no encuentras nada, responde con "NO_ENCONTRADO".` 
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: config.api.maxTokens,
        temperature: 0.1
      });

      const result = response.data.choices[0].message.content;
      
      if (result === "NO_ENCONTRADO" || !result.trim()) {
        return [];
      }

      return this.parseResults(result, chunkInfo);
    } catch (error) {
      Logger.error(`Error en búsqueda API: ${error.message}`);
      if (error.response?.status === 429) {
        throw new Error('RATE_LIMIT');
      }
      throw error;
    }
  }

  buildSearchPrompt(textChunk, chunkInfo) {
    return `
ANALIZA el siguiente fragmento de texto (páginas ${chunkInfo.startPage} a ${chunkInfo.endPage}) 
y BUSCA específicamente cualquier mención o referencia a la fecha: ${config.search.targetDate}

INSTRUCCIONES:
1. Busca la fecha ${config.search.targetDate} en cualquier formato
2. Si encuentras referencias a esta fecha, extrae el contenido relevante
3. Incluye el número de página donde se encontró cada mención
4. Formato de respuesta: "**PÁGINA: [número]**\n[contenido relevante]"

TEXTO A ANALIZAR:
${textChunk.substring(0, 12000)} // Limitar tamaño para no exceder tokens
    `;
  }

  parseResults(apiResponse, chunkInfo) {
    const results = [];
    const lines = apiResponse.split('\n');
    let currentPage = null;
    let currentContent = [];

    for (const line of lines) {
      const pageMatch = line.match(/\*\*PÁGINA:\s*(\d+)\*\*/i);
      if (pageMatch) {
        // Guardar resultado anterior si existe
        if (currentPage && currentContent.length > 0) {
          results.push({
            page: currentPage,
            content: currentContent.join('\n').trim()
          });
        }
        // Nuevo resultado
        currentPage = parseInt(pageMatch[1]);
        currentContent = [];
      } else if (currentPage && line.trim()) {
        currentContent.push(line.trim());
      }
    }

    // Último resultado
    if (currentPage && currentContent.length > 0) {
      results.push({
        page: currentPage,
        content: currentContent.join('\n').trim()
      });
    }

    return results;
  }
}
