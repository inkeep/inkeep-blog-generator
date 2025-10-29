import { project } from '@inkeep/agents-sdk';
import { blogGeneratorAgent } from './agents/blog-generator-agent';

export const blogGenerator = project({
  id: 'blog-generator',
  name: 'Blog Generator',
  description: 'Sequential 5-agent workflow that transforms URLs or source material into publication-ready blog articles following Smart Brevity framework',
  models: {
    base: {
      model: 'anthropic/claude-sonnet-4-5'
    },
    structuredOutput: {
      model: 'anthropic/claude-sonnet-4-5'
    },
    summarizer: {
      model: 'anthropic/claude-sonnet-4-5'
    }
  },
  agents: () => [
    blogGeneratorAgent
  ]
});