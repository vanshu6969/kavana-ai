---
name: ralph-loop
description: >-
  Continuous autonomous execution loop (Ralph Wiggum pattern). Use when the user requests comprehensive task completion, overnight runs, or wants iterative test-fix-loop execution until all objectives pass without stopping mid-task.
---

# Ralph Loop: Autonomous Iteration Workflow

The Ralph Loop is designed to run until completion by continuously measuring progress against a defined objective.

## Core Loop Procedure

```
[ Objective Set ]
       │
       ▼
 ┌───────────────┐
 │ Execute Step  │◄─────────────┐
 └───────┬───────┘              │
         ▼                      │ (if fail)
 ┌───────────────┐              │
 │ Verify Output ├──────────────┘
 └───────┬───────┘
         ▼ (if pass)
 ┌───────────────┐
 │ Next Task     │
 └───────┬───────┘
         ▼
 [ Objective Met ]
```

## Step-by-Step Instructions:

1. **Initialize State**:
   - Create or update `PROGRESS.md` or a local checklist with all tasks and acceptance criteria.
2. **Execute Iteration**:
   - Pick the first pending task.
   - Implement the change using surgical edits.
3. **Automated Verification**:
   - Run verification (e.g. build check, test suite, or lint check).
   - If an error occurs:
     - DO NOT stop and ask the user.
     - Read the error log carefully.
     - Formulate a fix targeting the exact root cause.
     - Apply fix and re-run verification.
4. **Mark Progress**:
   - Mark task completed.
   - Continue immediately to the next task in the loop.
5. **Exit Condition**:
   - Loop terminates only when all items are checked off and verified working.
