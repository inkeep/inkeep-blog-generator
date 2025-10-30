# 🔍 ARTIFACT SHARING INVESTIGATION: Root Cause & Fixes

## Executive Summary

After thorough investigation of trace5 and documentation, I've identified the **root cause** of the artifact accessibility issue: **Artifacts created via `<artifact:create>` annotations are processed asynchronously AFTER the AI response completes, but delegation happens immediately, creating a race condition.**

---

## 📊 Evidence from Trace5

### Timeline of Events:

1. **Line 255:** Firecrawl tool call completes successfully ✅
2. **Line 280:** AI response includes `<artifact:create id="pg-goodwriting" tool="toolu_017itDUg7cwHYUjUvkvHi9ZJ" type="scraped_page" base="result" />`
3. **Line 281:** AI immediately delegates back to orchestrator
4. **Line 75:** Delegation response shows `parts: [{"kind":"text","text":"Task completed successfully"}]` 
   - **CRITICAL:** NO artifact data in parts array ❌
5. **Line 295:** Orchestrator extracts metadata from TEXT message (not parts array)
6. **Line 296:** Orchestrator correctly passes metadata to qualification agent
7. **Line 336:** Qualification agent calls `get_reference_artifact` → **FAILS**: "Artifact not found" ❌

---

## 🎯 Root Cause Identified

### The Problem:

**Artifacts created via `<artifact:create>` annotations are processed asynchronously:**

1. AI generates response with `<artifact:create>` annotation
2. System processes annotation **asynchronously** (in background)
3. Delegation happens **immediately** after AI response
4. Delegation response returns **before** artifact is persisted
5. Next agent tries to retrieve artifact → **NOT FOUND** (not persisted yet)

### Evidence:

- **Parts array empty:** Delegation response doesn't contain artifact metadata because artifact hasn't been created yet
- **Artifact not found:** When qualification agent tries to retrieve it seconds later, artifact still doesn't exist
- **Timing issue:** This is a **race condition** between artifact creation and delegation

---

## 🔧 Solution Options

### Option A: Wait for Artifact Processing (RECOMMENDED)

**Approach:** Update `urlToMarkdown` agent to NOT delegate immediately after creating artifact. Instead, add explicit instruction to wait for artifact processing.

**Implementation:**
```typescript
// In urlToMarkdown agent prompt - AFTER artifact creation:

**WHEN COMPLETE:**
- After successfully scraping content and creating artifacts, **WAIT** before delegating
- **CRITICAL:** The artifact:create annotation triggers asynchronous artifact creation
- **DO NOT delegate immediately** - wait for artifact to be processed
- Add a brief delay or check mechanism to ensure artifact is persisted
- Only delegate AFTER confirming artifact creation is complete
```

**Pros:**
- Simple fix
- Works with current system behavior
- No system changes needed

**Cons:**
- Requires explicit waiting logic
- May add latency

---

### Option B: Pass Tool Result Directly (ALTERNATIVE)

**Approach:** Instead of relying on artifact retrieval, pass the tool result data directly in the delegation message.

**Implementation:**
```typescript
// In urlToMarkdown agent prompt:

**WHEN COMPLETE:**
- After scraping, create artifact AND include key data in delegation message
- Format: "Scraped [URL]. Artifact ID: [id]. Tool result summary: [key points]"
- This provides immediate access to data while artifact processes in background
```

**Pros:**
- Immediate data access
- Workflow continues without delay

**Cons:**
- Loses artifact benefits (citations, full data access)
- Not ideal for production

---

### Option C: Fallback Retrieval Mechanism (ROBUST)

**Approach:** Add retry logic in downstream agents to handle async artifact creation.

**Implementation:**
```typescript
// In qualification agent prompt:

**ARTIFACT RETRIEVAL:**
- First attempt: Retrieve artifact using provided metadata
- If artifact not found: Wait 2-3 seconds, retry
- If still not found: Extract data from delegation message text (fallback)
- Continue workflow with available data
```

**Pros:**
- Handles race conditions gracefully
- Robust error handling

**Cons:**
- Adds complexity
- May still fail if artifact never creates

---

### Option D: System-Level Fix (IDEAL BUT REQUIRES SDK CHANGES)

**Approach:** Ensure artifacts are persisted synchronously before delegation responses are returned.

**Implementation:**
- Modify Inkeep Agents SDK to process `<artifact:create>` annotations synchronously
- Ensure artifacts are persisted before delegation completes
- Include artifact metadata in delegation response parts array automatically

**Pros:**
- Fixes root cause
- No prompt changes needed
- Works for all agents

**Cons:**
- Requires SDK changes
- Not immediately actionable

---

## ✅ Recommended Fix Plan

### Phase 1: Immediate Fix (Option A + C Hybrid)

**1. Update `urlToMarkdown` Agent:**
- Add explicit instruction to wait after artifact creation
- Include artifact metadata in delegation message text (current behavior - keep this)
- Add instruction: "After creating artifact, wait briefly before delegating to ensure artifact is processed"

**2. Update `qualificationAgent` (and other downstream agents):**
- Add retry logic for artifact retrieval
- Add fallback: If artifact not found, extract data from delegation message

**3. Update Orchestrator:**
- Keep current text-based extraction (works as fallback)
- Add instruction: "If parts array doesn't contain artifacts, extract from text message"

### Phase 2: Long-Term Fix (Option D)

**Work with Inkeep team to:**
- Ensure artifacts are persisted synchronously before delegation
- Include artifact metadata in delegation response parts array automatically
- This fixes the root cause for all agents

---

## 📝 Specific Code Changes Needed

### Change 1: `urlToMarkdown` Agent Prompt

```typescript
**WHEN COMPLETE:**
- After successfully scraping content and creating artifacts:
  1. Create artifact using `<artifact:create>` annotation
  2. **WAIT:** Artifact creation happens asynchronously - wait 2-3 seconds before delegating
  3. Include artifact metadata in delegation message text (as backup)
  4. Delegate back to orchestrator
- **CRITICAL:** The artifact:create annotation triggers background processing
- Do NOT delegate immediately - give the system time to persist the artifact
```

### Change 2: `qualificationAgent` Prompt

```typescript
**ARTIFACT RETRIEVAL WITH RETRY:**
- First attempt: Use get_reference_artifact with provided metadata
- If artifact not found (race condition):
  1. Wait 2-3 seconds
  2. Retry retrieval
  3. If still not found, extract key data from delegation message text
  4. Continue workflow with available data
```

### Change 3: Orchestrator Prompt

```typescript
**ARTIFACT METADATA EXTRACTION (UPDATED):**
1. FIRST: Check delegation response parts array for artifact data
2. IF parts array contains artifacts: Extract metadata from parts array
3. IF parts array is empty: Extract metadata from delegation message text (fallback)
4. Store extracted metadata for next step
5. NEVER proceed without artifact metadata
```

---

## 🧪 Testing Plan

1. **Test artifact creation:** Verify artifact is created correctly
2. **Test timing:** Confirm artifact exists before retrieval attempt
3. **Test fallback:** Verify text-based extraction works when parts array is empty
4. **Test retry:** Verify retry logic handles race conditions
5. **End-to-end:** Run full workflow to confirm all steps complete

---

## 🎯 Expected Outcome

After implementing these fixes:
- ✅ Artifacts are accessible to downstream agents
- ✅ Workflow completes successfully
- ✅ Race conditions are handled gracefully
- ✅ Fallback mechanisms ensure workflow continues even if artifacts are delayed

---

## 📌 Key Insights

1. **Artifact creation is asynchronous:** `<artifact:create>` annotations are processed after AI response
2. **Delegation is immediate:** Happens right after AI response, before artifact persists
3. **Parts array is empty:** Because artifact hasn't been created yet when delegation completes
4. **Text-based extraction works:** Orchestrator correctly extracts metadata from text (fallback)
5. **Retrieval fails:** Because artifact doesn't exist yet when qualification agent tries to access it

---

## 🔄 Next Steps

1. **Immediate:** Implement Phase 1 fixes (wait logic + retry mechanism)
2. **Test:** Verify fixes work with trace5 scenario
3. **Monitor:** Check if artifacts are accessible after fixes
4. **Long-term:** Work with Inkeep team on Option D (synchronous artifact processing)

---

## 📚 References

- Trace5 analysis: Lines 255-336 show the complete artifact lifecycle
- Inkeep documentation: Artifacts are "automatically created" but timing is unclear
- Current implementation: Text-based extraction works as fallback

