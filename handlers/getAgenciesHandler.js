export async function getAgencies(req, res, corsHeaders) {
    try {
        const tranzyUrl = 'https://api.tranzy.ai/v1/opendata/agency';
    
        const headers = {
            'Accept': 'application/json',
            'X-API-KEY': process.env.TRANZY_API_KEY
        };

        console.log('Fetching agencies from Tranzy...');
    
        const response = await fetch(tranzyUrl, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Tranzy API error: ${response.status} ${response.statusText}`);
        }

        const agencies = await response.json();
    
        console.log(`Received ${agencies.length} agencies`);

        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({
            success: true,
            count: agencies.length,
            agencies: agencies
        }));

    } catch (error) {
        console.error('Error in getAgenciesHandler:', error);
    
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({
            success: false,
            error: error.message
        }));
    }
}