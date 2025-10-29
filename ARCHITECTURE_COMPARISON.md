# Inkeep Agent Architecture Comparison

**Date:** October 29, 2025  
**Comparing:** Activities Planner vs Blog Generator (Refactored)

---

## Executive Summary

Both projects now follow the **single-file agent pattern** for coordinating sequential workflows. This is Inkeep's recommended approach for tightly-coupled, sequential agent systems.

✅ **Your blog-generator is now structured optimally for sequential agentic flow!**

---

## Side-by-Side Comparison

### Activities Planner (Reference Example)

**File Structure:**
```
activities-planner/
├── index.ts
├── agents/
│   └── activities-planner.ts    # ALL agents in one file
├── tools/
│   ├── weather-mcp.ts
│   └── exa-mcp.ts
└── data-components/
    └── activities/
```

**Agent Pattern:**
```typescript
// activities-planner.ts
const activitiesPlanner = subAgent({...})      // Entry point
const weatherForecaster = subAgent({...})      // Specialist
const coordinatesAgent = subAgent({...})       // Specialist
const websearchAgent = subAgent({...})         // Specialist

export const activitiesPlannerAgent = agent({
  defaultSubAgent: activitiesPlanner,
  subAgents: () => [
    activitiesPlanner,
    weatherForecaster,
    coordinatesAgent,
    websearchAgent
  ]
})
```

**Flow Type:** Parallel/On-Demand (agents called as needed, not sequential)

---

### Blog Generator (Your Project - Refactored)

**File Structure:**
```
blog-generator/
├── index.ts
├── agents/
│   └── blog-generator-agent.ts  # ALL agents in one file ✅
├── tools/
│   └── firecrawl-mcp.ts
└── start-firecrawl-proxy.sh
```

**Agent Pattern:**
```typescript
// blog-generator-agent.ts
const orchestrator = subAgent({...})           // Entry point
const urlToMarkdown = subAgent({...})          // Step 1
const qualificationAgent = subAgent({...})     // Step 2
const contentStrategistAgent = subAgent({...}) // Step 3
const contentWriter = subAgent({...})          // Step 4

export const blogGeneratorAgent = agent({
  defaultSubAgent: orchestrator,
  subAgents: () => [
    orchestrator,
    urlToMarkdown,
    qualificationAgent,
    contentStrategistAgent,
    contentWriter
  ],
  stopWhen: {
    transferCountIs: 10
  }
})
```

**Flow Type:** Sequential (agents called in strict order: 1→2→3→4)

---

## Key Architectural Differences

### 1. Workflow Coordination

| Aspect | Activities Planner | Blog Generator |
|--------|-------------------|----------------|
| **Flow** | Parallel/On-Demand | Sequential |
| **Orchestration** | Entry agent delegates as needed | Orchestrator enforces strict order |
| **Agent Coupling** | Loose (agents independent) | Tight (agents depend on previous outputs) |
| **Flexibility** | High (can skip agents) | Low (must follow sequence) |

### 2. Agent Relationships

**Activities Planner:**
```typescript
// Entry agent can delegate to any specialist
const activitiesPlanner = subAgent({
  canDelegateTo: () => [
    weatherForecaster,    // Call if needed
    coordinatesAgent,     // Call if needed
    websearchAgent        // Call if needed
  ]
})
```

**Blog Generator:**
```typescript
// Orchestrator transfers in sequence
const orchestrator = subAgent({
  canTransferTo: () => [
    qualificationAgent,      // Always step 2
    urlToMarkdown,           // Optional step 1
    contentStrategistAgent,  // Always step 3
    contentWriter            // Always step 4 (final)
  ],
  canDelegateTo: () => [
    urlToMarkdown            // Can delegate for URL scraping
  ]
})
```

### 3. Prompt Strategy

**Activities Planner (Flexible):**
```typescript
prompt: `
You coordinate activity planning.
- Delegate to weather agent if you need weather data
- Delegate to coordinates agent if you need location data
- Delegate to search agent if you need web information
Use agents as needed based on the user's request.
`
```

**Blog Generator (Sequential):**
```typescript
prompt: `
You manage a SEQUENTIAL 5-step workflow:
1. URL Scraping (if URLs provided)
2. Requirements Gathering (ALWAYS)
3. Strategic Planning (ALWAYS)
4. Article Writing (ALWAYS - final step)

After EACH agent completes, IMMEDIATELY proceed to the next step.
DO NOT STOP between agents - keep the workflow moving.
`
```

---

## Is One Better Than the Other?

**No - they're optimized for different use cases!**

### Activities Planner Approach (Parallel/On-Demand)

**Best For:**
- ✅ Flexible workflows where steps can be skipped
- ✅ Agents that can be called in any order
- ✅ User-driven workflows (user decides what's needed)
- ✅ Independent agents that don't depend on each other

**Example Use Cases:**
- Weather planning (may or may not need all data)
- Research assistant (search different sources as needed)
- Customer support (route to relevant specialist)

### Blog Generator Approach (Sequential)

**Best For:**
- ✅ Fixed workflows with required steps
- ✅ Agents that depend on previous outputs
- ✅ Pipeline-style processing (A→B→C→D)
- ✅ Quality-controlled workflows (each step validates)

**Example Use Cases:**
- Content generation (research → outline → write → edit)
- Data processing (extract → transform → load)
- Onboarding workflows (collect → verify → setup → confirm)

---

## Why Single-File Works for Both

Despite different workflow types, both use single-file because:

1. **Visibility** - See all agents and their relationships at once
2. **Maintainability** - One file to edit for workflow changes
3. **Clarity** - Agent relationships (`canDelegateTo`, `canTransferTo`) are visible in context
4. **Simplicity** - No import dependencies between agent files
5. **Debugging** - Easier to trace workflow issues

---

## Your Blog Generator: Optimized! ✅

### What Makes It Well-Structured for Sequential Flow:

1. **✅ Single-file agent definition** (like activities-planner)
2. **✅ Clear orchestrator with explicit workflow logic**
3. **✅ Sequential transfer pattern** (`canTransferTo` all downstream agents)
4. **✅ Auto-continuation prompts** (don't stop between steps)
5. **✅ `stopWhen` safeguard** (prevents infinite loops)
6. **✅ Clear agent descriptions** (internal workflow agents)

### Improvements Over Activities Planner for Sequential Use Case:

1. **Explicit step ordering** in orchestrator prompt
2. **Auto-continuation instructions** to prevent premature stops
3. **Transfer count limit** (`stopWhen: { transferCountIs: 10 }`)
4. **Clear agent naming** (02, 03, 04, 05 indicates sequence)
5. **Detailed workflow documentation** in orchestrator prompt

---

## Comparison Summary

| Feature | Activities Planner | Blog Generator |
|---------|-------------------|----------------|
| **File Structure** | ✅ Single file | ✅ Single file |
| **Agent Count** | 4 agents | 5 agents |
| **Workflow Type** | Parallel/On-Demand | Sequential |
| **Orchestration** | Flexible delegation | Strict sequential transfers |
| **Agent Independence** | High | Low (pipeline) |
| **Use Case** | Dynamic planning | Content pipeline |
| **Best For** | User-driven workflows | Fixed process workflows |

---

## Key Takeaways

1. **Both approaches are correct** - they're optimized for different workflow types
2. **Single-file pattern works for both** - visibility and maintainability
3. **Your blog-generator is well-structured** for sequential workflows
4. **Activities-planner is well-structured** for flexible workflows
5. **Choose pattern based on use case**, not arbitrary preference

---

## When to Use Each Pattern

### Use Activities Planner Pattern When:
- Agents can be called in any order
- Steps are optional based on user input
- Agents are independent (don't depend on each other)
- Workflow is user-driven and flexible

### Use Blog Generator Pattern When:
- Agents must be called in specific order
- Each step depends on previous outputs
- Workflow is a fixed pipeline (A→B→C→D)
- Quality control requires sequential validation

---

## Conclusion

**Your blog-generator is now optimally structured for sequential agentic flow!** 🎉

The single-file approach gives you:
- ✅ Clear visibility of the entire workflow
- ✅ Easy maintenance and debugging
- ✅ Matches Inkeep's recommended patterns
- ✅ Optimized for sequential pipeline processing

**Activities-planner uses the same single-file pattern but for a different workflow type (parallel/on-demand vs sequential).**

Both are excellent examples of Inkeep's Agent-to-Agent (A2A) architecture! 🚀

