import { artifactComponent } from '@inkeep/agents-sdk';
import { z } from 'zod';
import { preview } from '@inkeep/agents-core';

/**
 * Scraped Page Artifact Component
 * 
 * Stores the complete result of web scraping operations from Firecrawl.
 * Created by urlToMarkdown agent when scraping URLs.
 * Used by contentStrategistAgent and contentWriter to reference original source material.
 * 
 * This artifact captures the tool result from Firecrawl MCP, making it available
 * to downstream agents for analysis and citation.
 */
export const scrapedPage = artifactComponent({
  id: "scraped_page",
  name: "scraped_page",
  description: "Scraped webpage content with metadata from Firecrawl",
  props: z.object({
    title: preview(z.string().describe("Page title extracted from the webpage")),
    url: preview(z.string().describe("Source URL that was scraped")),
    wordCount: preview(z.number().describe("Total word count of the content")),
    markdown: z.string().describe("Full markdown-formatted content from the page"),
    extractedAt: preview(
      z.string().describe("ISO timestamp when the page was scraped")
    ),
    status: preview(
      z.enum(["success", "partial", "failed"])
        .describe("Scraping status indicator")
    )
  })
});

