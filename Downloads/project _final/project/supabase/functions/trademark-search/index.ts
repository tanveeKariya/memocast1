const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

const TRADEMARKIA_API_URL = 'https://api.trademarkia.com/services/v1/tm/en/basic/search';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('q');

    if (!searchQuery) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Mock response for development
    const mockData = [
      {
        id: '1',
        serialNumber: 'TM123456',
        filingDate: '2024-01-15',
        status: 'Live: Registered',
        description: 'Computer software and related services',
        markName: searchQuery.toUpperCase(),
        ownerName: 'Example Corporation'
      },
      {
        id: '2',
        serialNumber: 'TM123457',
        filingDate: '2024-01-16',
        status: 'Pending',
        description: 'Mobile applications and software services',
        markName: `${searchQuery.toUpperCase()} PRO`,
        ownerName: 'Example Tech Ltd.'
      }
    ];

    return new Response(
      JSON.stringify(mockData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Trademark search error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch trademark data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});