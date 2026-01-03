export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetBase = "https://dramabox.sansekai.my.id/api/dramabox";
    
    // Path parameter handling
    // If worker is at proxy.example.com/*, we want to forward the path
    const path = url.pathname;
    const targetUrl = new URL(targetBase + path);
    
    // Forward query parameters
    url.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: new Headers(request.headers),
      body: request.body,
      redirect: 'follow'
    });

    // Handle CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "*"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const response = await fetch(newRequest);
      const newResponse = new Response(response.body, response);
      
      // Set CORS headers
      Object.keys(corsHeaders).forEach(key => {
        newResponse.headers.set(key, corsHeaders[key]);
      });

      // Optional: Logic to match our server/routes.ts behavior (unwrapping data/list)
      // Since Cloudflare Workers can parse JSON, we can do it here too if needed.
      const contentType = newResponse.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        let json = await response.json();
        if (json.data) {
          return new Response(JSON.stringify(json.data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        } else if (json.list) {
           return new Response(JSON.stringify(json.list), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        return new Response(JSON.stringify(json), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return newResponse;
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
