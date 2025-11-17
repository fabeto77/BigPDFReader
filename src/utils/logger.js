class Logger {
  static log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${message}`);
  }

  static info(message) {
    this.log(message, 'INFO');
  }

  static warn(message) {
    this.log(message, 'WARN');
  }

  static error(message) {
    this.log(message, 'ERROR');
  }

  static progress(current, total, message = 'Procesando') {
    const percentage = ((current / total) * 100).toFixed(1);
    process.stdout.write(`\r${message}: ${current}/${total} (${percentage}%)`);
    if (current === total) console.log('\n¡Completado!');
  }
}

export default Logger;
