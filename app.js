import http from 'http';
import { config } from 'dotenv';
import { parse } from 'url';
import { getVehicles } from './handlers/getVehiclesHandler.js';
import { getAgencies } from './handlers/getAgenciesHandler.js';

config();
const PORT = process.env.PORT;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

const routes = {
    '/api/vehicles': { GET: getVehicles },
    '/api/agencies': { GET: getAgencies }
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    if (method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
    }

    const route = routes[path];
  
    if (route && route[method]) {
        try {
            await route[method](req, res, corsHeaders);
        } catch (error) {
            console.error('Error handling request:', error);
            res.writeHead(500, corsHeaders);
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    } else {
        res.writeHead(404, corsHeaders);
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Endpoints:`);
    console.log(`- GET /api/vehicles`);
    console.log(`- GET /api/agencies`);
});