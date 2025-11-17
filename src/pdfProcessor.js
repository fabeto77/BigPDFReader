import pdf from 'pdf-parse';
import fs from 'fs-extra';
import { config } from '../config/config.js';
import Logger from './utils/logger.js';

export class PDFProcessor {
  constructor(filePath) {
    this.filePath = filePath;
    this.totalPages = 0;
    this.processedChunks = new Set();
  }

  async getTotalPages() {
    try {
      const dataBuffer = await fs.readFile(this.filePath);
      const data = await pdf(dataBuffer);
      this.totalPages = data.numpages;
      Logger.info(`PDF detectado con ${this.totalPages} páginas`);
      return this.totalPages;
    } catch (error) {
      Logger.error(`Error al leer PDF: ${error.message}`);
      throw error;
    }
  }

  async extractPageRange(startPage, endPage) {
    const chunkKey = `${startPage}-${endPage}`;
    
    if (this.processedChunks.has(chunkKey)) {
      Logger.warn(`Fragmento ${chunkKey} ya procesado, omitiendo`);
      return null;
    }

    try {
      Logger.info(`Extrayendo páginas ${startPage} a ${endPage}`);
      
      const dataBuffer = await fs.readFile(this.filePath);
      const data = await pdf(dataBuffer, {
        pagerender: this.renderPageRange(startPage, endPage)
      });

      this.processedChunks.add(chunkKey);
      
      return {
        text: data.text,
        startPage,
        endPage,
        chunkKey
      };
    } catch (error) {
      Logger.error(`Error extrayendo páginas ${startPage}-${endPage}: ${error.message}`);
      throw error;
    }
  }

  renderPageRange(startPage, endPage) {
    return (pageData) => {
      const pageNumber = pageData.pageIndex + 1;
      
      if (pageNumber >= startPage && pageNumber <= endPage) {
        return pageData.getTextContent().then(textContent => {
          return textContent.items.map(item => item.str).join(' ');
        });
      }
      
      return '';
    };
  }

  calculateChunks() {
    const chunks = [];
    const totalChunks = Math.ceil(this.totalPages / config.pdf.chunkSize);
    
    for (let i = 0; i < totalChunks; i++) {
      const startPage = i * config.pdf.chunkSize + 1;
      const endPage = Math.min((i + 1) * config.pdf.chunkSize, this.totalPages);
      chunks.push({ startPage, endPage, chunkNumber: i + 1 });
    }
    
    Logger.info(`Dividido en ${chunks.length} fragmentos de ${config.pdf.chunkSize} páginas`);
    return chunks;
  }

  async saveResults(results, outputPath) {
    try {
      let content = `RESULTADOS DE BÚSQUEDA - FECHA: ${config.search.targetDate}\n`;
      content += `Documento: ${this.filePath}\n`;
      content += `Total de páginas: ${this.totalPages}\n`;
      content += `Fecha de búsqueda: ${new Date().toISOString()}\n`;
      content += '='.repeat(80) + '\n\n';

      if (results.length === 0) {
        content += 'No se encontraron coincidencias para la fecha especificada.\n';
      } else {
        results.forEach(result => {
          content += `\n${'='.repeat(60)}\n`;
          content += `**PÁGINA: ${result.page}**\n`;
          content += `${'='.repeat(60)}\n`;
          content += `${result.content}\n\n`;
        });
      }

      await fs.writeFile(outputPath, content, 'utf8');
      Logger.info(`Resultados guardados en: ${outputPath}`);
      return outputPath;
    } catch (error) {
      Logger.error(`Error guardando resultados: ${error.message}`);
      throw error;
    }
  }
}
