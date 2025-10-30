import { artifactComponent } from '@inkeep/agents-sdk';
import { z } from 'zod';
import { preview } from '@inkeep/agents-core';

/**
 * Citation Artifact Component
 * 
 * Stores source material with proper attribution for fact-checking and citation.
 * Used by contentStrategistAgent to create evidence maps and by contentWriter 
 * to reference sources in the final article.
 * 
 * Auto-rendered by Inkeep's widget as interactive citation cards.
 */
export const citation = artifactComponent({
  id: "citation",
  name: "citation",
  description: "Source material with proper attribution for claims and evidence",
  props: z.object({
    title: preview(z.string().describe("Title of the source document or claim")),
    url: preview(z.string().describe("URL or source identifier")),
    sourceType: preview(
      z.enum(["webpage", "statistic", "quote", "data", "research"])
        .describe("Type of source material")
    ),
    content: z.string().describe("Full source content or relevant excerpt"),
    relevance: preview(
      z.string().describe("How this source relates to the claim or topic")
    ),
    extractedAt: preview(
      z.string().describe("ISO timestamp when source was extracted")
    )
  })
});

