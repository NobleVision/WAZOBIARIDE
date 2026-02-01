/**
 * Vercel Serverless Function Entry Point
 * 
 * This handles API routes and serves as a lightweight backend
 * for WaZoBiaRide landing page.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';

  // Health check endpoint
  if (url === '/api/health' || url.endsWith('/health')) {
    return res.status(200).json({
      status: 'healthy',
      service: 'WaZoBiaRide',
      timestamp: new Date().toISOString()
    });
  }

  // API route for landing page stats
  if (url === '/api/stats' || url.endsWith('/stats')) {
    return res.status(200).json({
      riders: 500000,
      drivers: 50000,
      trips: 10000000,
      cities: ['Lagos', 'Ibadan', 'Abeokuta', 'Osogbo']
    });
  }

  // Default response for unmatched routes
  return res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
}