# Rule: Ralph Loop Autonomous Standard

The Ralph Loop (Ralph Wiggum pattern) ensures continuous, disciplined execution until an objective is completely finished.

## Operating Principles:
1. **Never Stop Mid-Task**: When assigned an objective, see it through to completion. Do not stop after editing one file if related files, builds, or tests still need attention.
2. **Autonomous Feedback Loop**:
   - `Action` -> `Verify` -> `Diagnose` -> `Refine` -> `Complete`.
   - If a test fails, syntax error occurs, or runtime issue arises: do not ask the user what to do. Inspect the failure, trace the root cause, fix it, and verify again.
3. **Loop Persistence**:
   - Track completed items and remaining items.
   - Stop only when all success criteria are verified or an unresolvable external dependency requires user clarification.
