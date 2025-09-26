import { NextRequest } from 'next/server';

export function requireAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }
  
  const token = authHeader.substring(6);
  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  const [username, password] = decoded.split(':');
  
  const adminToken = process.env.ADMIN_TOKEN || 'admin-secret-key';
  
  return username === 'admin' && password === adminToken;
}

export function getAdminAuthHeaders() {
  const adminToken = process.env.ADMIN_TOKEN || 'admin-secret-key';
  const credentials = Buffer.from(`admin:${adminToken}`).toString('base64');
  
  return {
    'Authorization': `Basic ${credentials}`
  };
}
