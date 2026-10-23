---
name: get-shit-done
description: >-
  Spec-driven development and context-engineering workflow (GSD framework). Use when planning complex features, starting multi-phase tasks, or managing large workstreams to prevent context rot through phased specs, atomic task execution, and verification checkpoints.
---

# Get Shit Done (GSD) Framework

The GSD workflow prevents context rot and hallucination by enforcing structured phases for any multi-step task.

## The 4-Phase Lifecycle

### Phase 1: Specification & Scope
Before touching code on a multi-step feature:
1. State the objective in 1-2 clear sentences.
2. Define the exact **Definition of Done** (acceptance criteria).
3. Identify affected files and functions.
4. If large, create a lightweight spec tracking document.

### Phase 2: Context Isolation & Task Decomposition
Break the implementation into small, atomic tasks:
- Task 1: [Specific file / logic change]
- Task 2: [Specific integration / wiring]
- Task 3: [Verification / test]

Each task must be executable in a single focused step without needing to re-read the entire history.

### Phase 3: Atomic Execution
For each task:
1. Execute the code change.
2. Verify the change immediately (syntax check, build check, or manual smoke test).
3. Check off the task in your checklist.
4. Move immediately to the next task without pausing or wandering off-task.

### Phase 4: Final Verification & Clean Hand-off
1. Confirm all acceptance criteria are met.
2. Verify no extraneous temporary files or broken imports were left behind.
3. Summarize concisely what was completed.
