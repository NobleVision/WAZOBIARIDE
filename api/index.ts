/**
 * Vercel Serverless Function Entry Point
 * 
 * This handles API routes and serves as a lightweight backend
 * for WaZoBiaRide landing page.
 */

import { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage & { url?: string }, res: ServerResponse) {
  // Health check endpoint
  if (req.url === '/health' || req.url === '/api/health') {
    return res.status(200).json({
      status: 'healthy',
      service: 'WaZoBiaRide',
      timestamp: new Date().toISOString()
    });
  }

  // API route for landing page data
  if (req.url === '/api/stats' || req.url === '/stats') {
    return res.status(200).json({
      riders: 500000,
      drivers: 50000,
      trips: 10000000,
      cities: ['Lagos', 'Ibadan', 'Abeokuta', 'Osogbo']
    });
  }

  // Default response for unmatched routes
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
}