import { NextRequest } from 'next/server';

/**
 * Оборачивает хендлер API, измеряет длительность и шлёт событие в внутренний _usage endpoint.
 * Использует process.hrtime.bigint() (Node runtime). Безопасно: fire-and-forget.
 */
export function withUsage<T extends (req: NextRequest) => Promise<Response>>(
  handler: T,
  meta?: (req: NextRequest, res: Response) => Promise<Record<string, any>> | Record<string, any>
) {
  return async (req: NextRequest): Promise<Response> => {
    const start = typeof process !== 'undefined' && process.hrtime ? process.hrtime.bigint() : null;
    let res: Response;
    try {
      res = await handler(req);
      return res;
    } finally {
      try {
        const end = typeof process !== 'undefined' && process.hrtime ? process.hrtime.bigint() : null;
        const durationMs = start && end ? Number((end - start) / BigInt(1_000_000)) : null;

        const body: any = {
          path: req.nextUrl.pathname,
          method: req.method,
          status: res ? (res as any).status ?? 0 : 0,
          duration_ms: durationMs,
        };
        if (meta) {
          const extra = await meta(req, res!);
          Object.assign(body, extra || {});
        }

        // fire-and-forget
        const key = process.env.INTERNAL_USAGE_KEY || '';
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/_usage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Internal-Key': key,
          },
          body: JSON.stringify(body),
          // не ждём ответа
        }).catch(() => {});
      } catch {}
    }
  };
}

