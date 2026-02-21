/**
 * 日志工具
 */

import { config } from '../config/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private prefix = '[FitnessApp]';

  debug(message: string, data?: any) {
    if (config.logging.enabled) {
      console.log(`${this.prefix} [DEBUG]`, message, data);
    }
  }

  info(message: string, data?: any) {
    console.log(`${this.prefix} [INFO]`, message, data);
  }

  warn(message: string, data?: any) {
    console.warn(`${this.prefix} [WARN]`, message, data);
  }

  error(message: string, error?: Error | any) {
    console.error(`${this.prefix} [ERROR]`, message, error);

    // 这里可以集成错误报告服务
    if (config.features.crashReporting && error instanceof Error) {
      // reportToCrashlytics(error);
    }
  }
}

export const logger = new Logger();
