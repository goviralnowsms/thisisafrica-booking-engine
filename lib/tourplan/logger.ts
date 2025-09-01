/**
 * Production-safe logger for TourPlan services
 * Only logs errors and warnings in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class TourPlanLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isVerbose = process.env.TOURPLAN_DEBUG === 'true';

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment || this.isVerbose) {
      return true;
    }
    
    // In production, only log warnings and errors
    return level === 'warn' || level === 'error';
  }

  debug(...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(...args);
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.log(...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...args);
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(...args);
    }
  }

  // Performance timing helper
  time(label: string): void {
    if (this.shouldLog('debug')) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog('debug')) {
      console.timeEnd(label);
    }
  }
}

export const logger = new TourPlanLogger();