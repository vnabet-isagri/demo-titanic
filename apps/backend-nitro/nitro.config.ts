import { defineNitroConfig } from "nitropack/config"

// https://nitro.build/config
export default defineNitroConfig({
  compatibilityDate: "latest",
  srcDir: "server",
    experimental: {
        database: true
    },
    routeRules: {
        '/api/**': { cors: true, headers: { 'access-control-allow-methods': 'GET', 'Access-Control-Allow-Origin': 'http://localhost:4200' } },
    }
});
