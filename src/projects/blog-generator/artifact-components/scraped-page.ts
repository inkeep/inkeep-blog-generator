import { artifactComponent } from '@inkeep/agents-sdk';

/**
 * Scraped Page Artifact Component
 * 
 * Stores the COMPLETE result of web scraping operations from Firecrawl MCP.
 * Created by urlToMarkdown agent when scraping URLs.
 * Used by contentStrategistAgent and contentWriter to reference original source material.
 * 
 * IMPORTANT: This artifact has NO schema (props omitted) to ensure it captures
 * the entire Firecrawl tool response regardless of structure. This prevents
 * data loss from schema mismatches with the MCP tool output.
 * 
 * The agent can access all fields from the Firecrawl response including:
 * - markdown content
 * - metadata (title, URL, etc.)
 * - scraping status
 * - any additional fields Firecrawl provides
 */
export const scrapedPage = artifactComponent({
  id: "scraped_page",
  name: "scraped_page",
  description: "Complete Firecrawl scraping result with all metadata and content"
  // NO props - saves entire tool result without filtering
});

