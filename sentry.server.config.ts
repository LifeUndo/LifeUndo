import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || "production",
  
  // Performance Monitoring
  tracesSampleRate: 1.0,
  
  // Filter out health checks
  beforeSend(event) {
    if (event.request?.url?.includes('/api/_health')) {
      return null;
    }
    return event;
  },
});


