# Blog Generator - Inkeep Agent Project

An intelligent blog generation system built with the Inkeep Agent Framework, featuring a 5-agent workflow that transforms URLs or source material into publication-ready blog articles following the Smart Brevity framework.

## 🎯 Overview

This project implements an autonomous multi-agent system that:
- Scrapes and processes web content using Firecrawl MCP
- Gathers user requirements and intent
- Creates strategic content outlines
- Generates publication-ready blog articles under 1,000 words

## 🏗️ Architecture

### Agent Workflow

```
User Request
    ↓
Orchestrator Agent (Entry Point)
    ↓
02-url-to-markdown (Scrapes URLs via Firecrawl)
    ↓
03-Qualification-Agent (Gathers requirements)
    ↓
04-Content-Strategist-Agent (Creates outline)
    ↓
05-content-writer (Writes final article)
    ↓
Final Blog Article
```

### Agent Descriptions

**Orchestrator**
- Entry point for all blog creation requests
- Manages sequential workflow execution
- Ensures each agent completes before moving to next
- Handles error conditions and progress updates

**02-url-to-markdown**
- Scrapes URLs using Firecrawl MCP
- Converts web content to clean markdown
- Handles multiple URLs and consolidates content
- Error handling for failed scrapes

**03-Qualification-Agent**
- Gathers user requirements and intent
- Asks key questions: blog type, target audience, tone
- Creates comprehensive intake brief
- Validates source material quality

**04-Content-Strategist-Agent**
- Analyzes requirements and source material
- Selects appropriate Smart Brevity path (How-to, Data/Analysis, Case Study, etc.)
- Creates strategic outline with SEO optimization
- Maps evidence to claims

**05-content-writer**
- Writes publication-ready article
- Follows Smart Brevity principles
- Maintains under 1,000 words
- Includes citations and clear CTAs

## 🚀 Quick Start

### Prerequisites

- Node.js >= 22.x
- pnpm package manager
- Anthropic API key (for LLM)
- Firecrawl API key (for web scraping)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd my-agent-directory

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys:
# - ANTHROPIC_API_KEY
# - FIRECRAWL_API_KEY (in the start-firecrawl-proxy.sh script)
```

### Running the Project

1. **Start Inkeep services:**
```bash
pnpm dev
```

This starts:
- Management API (port 3002)
- Run API (port 3003)
- Visual Builder UI (port 3000)

2. **Start Firecrawl MCP proxy:**
```bash
cd src/projects/blog-generator
./start-firecrawl-proxy.sh
```

This starts the Firecrawl MCP proxy on port 4000.

3. **Access the Visual Builder:**
Open http://localhost:3000 and navigate to the blog-generator project.

## 📖 Usage

### Via Visual Builder

1. Open http://localhost:3000/default/projects/blog-generator
2. Start a conversation with the orchestrator
3. Provide URLs or source material
4. Answer qualification questions
5. Receive your generated blog article

### Via CLI

```bash
# Push project to server
cd src/projects/blog-generator
npx inkeep push --config ../../../src/inkeep.config.ts

# Pull latest changes from server
npx inkeep pull --config ../../../src/inkeep.config.ts
```

## 🔧 Configuration

### Firecrawl MCP Setup

The project uses Firecrawl MCP for web scraping. You have two options:

**Option 1: Local Proxy (Recommended for development)**
```bash
# Install mcp-proxy globally
npm install -g mcp-proxy

# Run the provided script
cd src/projects/blog-generator
./start-firecrawl-proxy.sh
```

**Option 2: Manual Setup**
```bash
export FIRECRAWL_API_KEY="your-api-key"
mcp-proxy --port 4000 --shell "npx -y firecrawl-mcp"
```

### Environment Configuration

Edit `src/inkeep.config.ts`:
```typescript
export default defineConfig({
  tenantId: "default",
  agentsManageApiUrl: 'http://localhost:3002',
  agentsRunApiUrl: 'http://localhost:3003',
});
```

## 📁 Project Structure

```
src/projects/blog-generator/
├── index.ts                          # Project definition
├── agents/
│   ├── jzgxqg7rxvmofnvl7ysxp.ts    # Main agent container
│   ├── orchestrator.ts              # Workflow orchestrator
│   ├── 02-url-to-markdown.ts       # URL scraper
│   ├── 03-qualification-agent.ts    # Requirements gatherer
│   ├── 04-content-strategist-agent.ts # Content strategist
│   └── 05-content-writer.ts        # Article writer
├── tools/
│   └── firecrawl-mcp.ts            # Firecrawl MCP tool
├── README.md                         # Project documentation
└── start-firecrawl-proxy.sh        # Proxy startup script
```

## 🎨 Smart Brevity Framework

The content strategist uses the Axios Smart Brevity framework with 6 paths:

- **Path A:** How-to/Playbook - Step-by-step guides
- **Path B:** Data/Analysis - Research findings and insights
- **Path C:** Case Study/Story - Real-world examples
- **Path D:** Opinion/Point of View - Thought leadership
- **Path E:** Product/Launch Update - Product announcements
- **Path F:** Trend/Market Brief - Industry trends

## 🔄 Workflow Details

### Sequential Execution

The orchestrator ensures agents run sequentially:
1. Each agent must complete before the next starts
2. No parallel execution
3. Automatic continuation between agents
4. Error handling stops workflow if critical failures occur

### Data Flow

- **02-url-to-markdown** → Scraped markdown content
- **03-Qualification-Agent** → Intake brief with requirements
- **04-Content-Strategist-Agent** → Strategic outline
- **05-content-writer** → Final blog article

## 🛠️ Development

### Adding New Agents

1. Create agent file in `agents/` directory
2. Import and add to main agent's `subAgents` array
3. Configure `canTransferTo` or `canDelegateTo` relationships
4. Push changes: `npx inkeep push`

### Testing

```bash
# Test individual agents in Visual Builder
# Navigate to http://localhost:3000

# Test full workflow
# Provide URLs and follow prompts
```

## 📊 Key Features

- ✅ **Autonomous A2A Workflow** - Agents collaborate without orchestrator micromanagement
- ✅ **Web Scraping** - Firecrawl MCP integration for URL content extraction
- ✅ **Smart Brevity** - Professional content framework for clear, concise writing
- ✅ **SEO Optimized** - Meta descriptions, keywords, and structured content
- ✅ **Error Resilient** - Handles failed scrapes, partial successes, and validation
- ✅ **Sequential Control** - Orchestrator ensures proper workflow execution

## 🐛 Troubleshooting

### Firecrawl MCP not working
```bash
# Check proxy is running
curl http://localhost:4000/mcp

# Verify mcp-proxy is installed
which mcp-proxy

# Check API key
echo $FIRECRAWL_API_KEY
```

### Workflow stops prematurely
- Check orchestrator prompt has auto-continuation instructions
- Verify all agents are in `canTransferTo` array
- Review agent descriptions for clarity

### Port conflicts
- Change proxy port in `tools/firecrawl-mcp.ts`
- Update `start-firecrawl-proxy.sh` accordingly

## 📚 Resources

- [Inkeep Documentation](https://docs.inkeep.com/)
- [Inkeep Agent SDK](https://docs.inkeep.com/typescript-sdk/overview)
- [MCP Tools Guide](https://docs.inkeep.com/typescript-sdk/tools/mcp-tools)
- [Firecrawl MCP](https://github.com/mendableai/firecrawl)
- [mcp-proxy](https://github.com/sparfenyuk/mcp-proxy)
- [Smart Brevity Framework](https://www.axios.com/smart-brevity)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

[Your License Here]

## 👥 Team

Created by [Your Team Name]

For questions or support, contact [Your Contact Info]

---

**Built with [Inkeep Agent Framework](https://inkeep.com)** 🚀

