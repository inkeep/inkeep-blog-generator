import { mcpTool } from "@inkeep/agents-sdk";

// Note: Firecrawl MCP requires stdio transport which needs to be proxied to HTTP/SSE
// for the Visual Builder. You have two options:
//
// Option 1: Run mcp-proxy locally:
//   FIRECRAWL_API_KEY=fc-a714655fe4e94a0086be8c2c7d5bf759 \
//   mcp-proxy --port 4000 --shell "npx -y firecrawl-mcp"
//
// Option 2: Use the Firecrawl remote MCP server if available
//
// For now, this is configured for a local proxy on port 4000

export const firecrawlMcpTool = mcpTool({
  id: 'firecrawl-mcp',
  name: 'Firecrawl',
  description: 'Web scraping and content extraction tool using Firecrawl',
  serverUrl: 'http://localhost:4000/mcp',
});

