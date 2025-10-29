import { project } from '@inkeep/agents-sdk';
import { jzgxqg7rxvmofnvl7ysxp } from './agents/jzgxqg7rxvmofnvl7ysxp';

export const blogGenerator = project({
  id: 'blog-generator',
  name: 'blog generator',
  description: `Responsible for routing between different agents.`,
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
    jzgxqg7rxvmofnvl7ysxp
  ]
});