export async function getVehicles(req, res, corsHeaders) {
    try {
        const tranzyUrl = 'https://api.tranzy.ai/v1/opendata/vehicles';
        const headers = {
            'Accept': 'application/json',
            'X-API-KEY': process.env.TRANZY_API_KEY,
            'X-Agency-Id': process.env.TRANZY_AGENCY_ID
        };

        console.log('Fetching vehicles from Tranzy...');
    
        const response = await fetch(tranzyUrl, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Tranzy API error: ${response.status} ${response.statusText}`);
        }

        const vehicles = await response.json();
    
        console.log(`Received ${vehicles.length} vehicles`);

        const processedVehicles = vehicles.map(vehicle => ({
            id: vehicle.id,
            label: vehicle.label,
            lat: vehicle.latitude,
            lng: vehicle.longitude,
            type: vehicle.vehicle_type,
            routeId: vehicle.route_id,
            speed: vehicle.speed,
            timestamp: vehicle.timestamp
        }));

        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({
            success: true,
            count: processedVehicles.length,
            vehicles: processedVehicles
        }));

    } catch (error) {
        console.error('Error in getVehiclesHandler:', error);
    
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({
            success: false,
            error: error.message
        }));
    }
}