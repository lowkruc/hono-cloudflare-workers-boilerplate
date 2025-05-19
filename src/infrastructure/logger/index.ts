interface LoggerOptions {
  level?: string;
  meta?: Record<string, unknown>;
}

class WorkerLogger {
  private logLevel: string;

  constructor(options: LoggerOptions = {}) {
    this.logLevel = options.level || 'info';
  }

  // Set log level dynamically
  setLogLevel(level: string): void {
    this.logLevel = level;
  }

  private isEnabled(level: string): boolean {
    const levels = { debug: 10, info: 20, warn: 30, error: 40 };
    const currentLevel = levels[this.logLevel as keyof typeof levels] || 20;
    const requestedLevel = levels[level as keyof typeof levels] || 20;
    return requestedLevel >= currentLevel;
  }

  private formatMessage(level: string, message: string, meta?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
  }

  private log(level: string, message: string, meta?: Record<string, unknown>): void {
    if (!this.isEnabled(level)) return;

    const formattedMessage = this.formatMessage(level, message, meta);

    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
      default:
        console.log(formattedMessage);
        break;
    }
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.log('error', message, meta);
  }
}

// Create a singleton logger instance
export const logger = new WorkerLogger({
  level: 'info',
});
