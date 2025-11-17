export const config = {
  pdf: {
    chunkSize: 100, // páginas por fragmento
    maxRetries: 3,
    retryDelay: 2000
  },
  search: {
    targetDate: "2024-01-15", // Fecha específica a buscar
    dateFormats: [
      "YYYY-MM-DD",
      "DD/MM/YYYY", 
      "MM-DD-YYYY",
      "DD MMM YYYY",
      "MMMM DD, YYYY"
    ]
  },
  api: {
    baseURL: "https://api.deepseek.com/v1",
    timeout: 30000,
    maxTokens: 4000
  },
  processing: {
    delayBetweenRequests: 2000, // 2 segundos entre peticiones
    maxConcurrent: 1
  }
};
