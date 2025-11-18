import { POST as complianceCheck } from "./api/compliance-check.ts";
import { POST as policyIngest } from "./api/policy-ingest.ts";
import { withCors, handleCorsPreflight, addCorsHeaders } from "./utils/cors.ts";

const requiredEnvVars = ["ANTHROPIC_API_KEY", "DAYTONA_API_KEY"] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// CORS configuration
const corsOptions = {
  origin: "*", // Allow all origins (change to specific origin(s) in production)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

const server = Bun.serve({
  hostname: "0.0.0.0", // Listen on all network interfaces
  port: Number(process.env.PORT ?? 3000),
  routes: {
    "/health": {
      GET: withCors(() => {
        return Response.json({ status: "ok", timestamp: new Date().toISOString() });
      }, corsOptions),
    },
    "/api/policies/ingest": {
      POST: withCors(policyIngest, corsOptions),
    },
    "/api/compliance/check": {
      POST: withCors(complianceCheck, corsOptions),
    },
  },
  fetch(request) {
    // Handle CORS preflight for unmatched routes
    const preflightResponse = handleCorsPreflight(request, corsOptions);
    if (preflightResponse) {
      return preflightResponse;
    }

    // Add CORS headers to 404 response
    const notFoundResponse = new Response("Not Found", { status: 404 });
    return addCorsHeaders(notFoundResponse, request, corsOptions);
  },
  error(error) {
    console.error("Unhandled server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  },
});

console.log(`🚀 Bun server listening on http://localhost:${server.port}`);
console.log(`📡 Accessible from network at http://<your-ip>:${server.port}`);
console.log(`   Find your IP with: ifconfig | grep "inet " | grep -v 127.0.0.1`);