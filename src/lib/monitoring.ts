// src/lib/monitoring.ts
// Centralized monitoring configuration

export interface MonitoringConfig {
  sentry?: {
    dsn: string;
    environment: string;
    tracesSampleRate: number;
  };
  logtail?: {
    token: string;
    source: string;
  };
}

export function getMonitoringConfig(): MonitoringConfig {
  return {
    sentry: process.env.SENTRY_DSN ? {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    } : undefined,
    logtail: process.env.LOGTAIL_TOKEN ? {
      token: process.env.LOGTAIL_TOKEN,
      source: 'lifeundo-api',
    } : undefined,
  };
}

export function logError(error: Error, context?: Record<string, any>) {
  console.error('[ERROR]', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
}

export function logInfo(message: string, data?: Record<string, any>) {
  console.log('[INFO]', {
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

export function logWarning(message: string, data?: Record<string, any>) {
  console.warn('[WARNING]', {
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}
