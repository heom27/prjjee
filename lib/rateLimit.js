const rateLimitMap = new Map();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 60;

export function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip || 'unknown';
  
  // Clean old entries periodically
  if (rateLimitMap.size > 10000) {
    for (const [k, v] of rateLimitMap) {
      if (now - v.windowStart > WINDOW_MS) rateLimitMap.delete(k);
    }
  }

  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: MAX_REQUESTS - entry.count };
}

export function getClientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || request.headers.get('x-real-ip') 
    || '127.0.0.1';
}
