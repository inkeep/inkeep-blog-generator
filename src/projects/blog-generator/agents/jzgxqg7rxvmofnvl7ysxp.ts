import { agent } from '@inkeep/agents-sdk';
import { contentStrategistAgent } from './04-content-strategist-agent';
import { contentWriter } from './05-content-writer';
import { orchestrator } from './orchestrator';
import { qualificationAgent } from './03-qualification-agent';
import { urlToMarkdown } from './02-url-to-markdown';

export const jzgxqg7rxvmofnvl7ysxp = agent({
  id: 'jzgxqg7rxvmofnvl7ysxp',
  name: 'Untitled Agent',
  defaultSubAgent: orchestrator,
  subAgents: () => [
    urlToMarkdown,
    qualificationAgent,
    contentStrategistAgent,
    contentWriter,
    orchestrator
  ],
  stopWhen: {
    transferCountIs: 10
  }
});