import { PDFProcessor } from './pdfProcessor.js';
import { SearchEngine } from './searchEngine.js';
import { config } from '../config/config.js';
import Logger from './utils/logger.js';
import fs from 'fs-extra';

class MassivePdfSearch {
  constructor(pdfPath, apiKey) {
    this.pdfProcessor = new PDFProcessor(pdfPath);
    this.searchEngine = new SearchEngine(apiKey);
    this.allResults = [];
    this.processedChunks = 0;
  }

  async initialize() {
    Logger.info('Inicializando búsqueda masiva en PDF...');
    
    // Crear directorios necesarios
    await fs.ensureDir('outputs');
    await fs.ensureDir('temp');
    
    // Obtener total de páginas
    await this.pdfProcessor.getTotalPages();
  }

  async processAllChunks() {
    const chunks = this.pdfProcessor.calculateChunks();
    const totalChunks = chunks.length;

    Logger.info(`Iniciando procesamiento de ${totalChunks} fragmentos...`);

    for (const chunk of chunks) {
      await this.processChunk(chunk, totalChunks);
      
      // Delay entre peticiones
      if (chunk.chunkNumber < totalChunks) {
        const delay = config.processing.delayBetweenRequests;
        Logger.info(`Esperando ${delay}ms antes del siguiente fragmento...`);
        await this.delay(delay);
      }
    }

    Logger.info('Procesamiento completado!');
  }

  async processChunk(chunk, totalChunks) {
    let retries = 0;
    
    while (retries <= config.pdf.maxRetries) {
      try {
        Logger.progress(this.processedChunks + 1, totalChunks, `Fragmento ${chunk.chunkNumber}`);
        
        // Extraer texto del fragmento
        const textChunk = await this.pdfProcessor.extractPageRange(
          chunk.startPage, 
          chunk.endPage
        );

        if (!textChunk || !textChunk.text.trim()) {
          Logger.warn(`Fragmento ${chunk.chunkNumber} vacío, omitiendo`);
          this.processedChunks++;
          return;
        }

        // Buscar en el fragmento
        const chunkResults = await this.searchEngine.searchInTextChunk(
          textChunk.text, 
          chunk
        );

        if (chunkResults.length > 0) {
          Logger.info(`Encontradas ${chunkResults.length} coincidencias en fragmento ${chunk.chunkNumber}`);
          this.allResults.push(...chunkResults);
        }

        this.processedChunks++;
        break; // Salir del loop de reintentos si fue exitoso

      } catch (error) {
        retries++;
        
        if (error.message === 'RATE_LIMIT' && retries <= config.pdf.maxRetries) {
          const backoffDelay = config.pdf.retryDelay * retries;
          Logger.warn(`Rate limit detectado, reintento ${retries} en ${backoffDelay}ms`);
          await this.delay(backoffDelay);
          continue;
        }
        
        Logger.error(`Error procesando fragmento ${chunk.chunkNumber}: ${error.message}`);
        break;
      }
    }
  }

  async saveFinalResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = `outputs/resultados_busqueda_${timestamp}.txt`;
    
    // Ordenar resultados por página
    this.allResults.sort((a, b) => a.page - b.page);
    
    await this.pdfProcessor.saveResults(this.allResults, outputPath);
    
    Logger.info(`Búsqueda completada. Total de coincidencias: ${this.allResults.length}`);
    Logger.info(`Resultados guardados en: ${outputPath}`);
    
    return outputPath;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async run() {
    try {
      await this.initialize();
      await this.processAllChunks();
      const resultsFile = await this.saveFinalResults();
      
      Logger.info('=== RESUMEN FINAL ===');
      Logger.info(`Total de páginas procesadas: ${this.pdfProcessor.totalPages}`);
      Logger.info(`Total de coincidencias encontradas: ${this.allResults.length}`);
      Logger.info(`Archivo de resultados: ${resultsFile}`);
      
    } catch (error) {
      Logger.error(`Error en la ejecución: ${error.message}`);
      process.exit(1);
    }
  }
}

// Ejecución principal
const apiKey = process.env.DEEPSEEK_API_KEY;
const pdfPath = process.env.PDF_PATH || './documento_auditoria.pdf';

if (!apiKey) {
  Logger.error('Falta la variable de entorno DEEPSEEK_API_KEY');
  process.exit(1);
}

if (!fs.existsSync(pdfPath)) {
  Logger.error(`No se encuentra el archivo PDF: ${pdfPath}`);
  process.exit(1);
}

const searchApp = new MassivePdfSearch(pdfPath, apiKey);
searchApp.run();
