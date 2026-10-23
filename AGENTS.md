# Workspace Agent Guidelines & Active Plugins

This project is configured with the following active workflow plugins and standards:

1. **Ponytail ("Lazy Senior Dev")**: Anti-overengineering decision ladder. Write the absolute minimum code necessary. Reuse native features and existing modules before introducing anything new.
2. **Get Shit Done (GSD)**: Spec-driven development framework. Break complex tasks into phased specifications and execute atomically to prevent context degradation.
3. **Ralph Loop**: Autonomous continuous iteration loop. When executing a multi-step objective, keep iterating through implementation, testing, and fixing until all criteria are satisfied.
4. **CodeRabbit**: High-rigor automated code review and security audits. Review all diffs for logic bugs, security issues, performance regressions, and edge cases.
5. **ZooCode**: Multi-role autonomous agent coordination (Architect, Coder, Reviewer).
6. **Frontend Design**: Creative design director standard. Enforce distinct typography, deliberate color systems, and micro-animations to avoid generic AI styling.
7. **UI/UX Pro**: Spatial rhythm (8pt grid), 60-30-10 color balance, complete state handling (loading/empty/error), and WCAG accessibility standards.

---

## 1. Ponytail: The Decision Ladder
Before writing any code, evaluate the task against this hierarchy and stop at the earliest rung:
1. **YAGNI**: Does this need to exist? Skip unrequested features, premature flexibility, and speculative configs.
2. **Existing Code**: Can an existing helper, utility, or component in this repository solve it?
3. **Standard Library**: Does the language's standard library or runtime already have built-in support?
4. **Platform Native**: Does the web platform/browser natively provide it (e.g. `<dialog>`, `<details>`, `Intl`, `fetch`, CSS variables)?
5. **Installed Dependency**: Does an already installed package handle it? Never install a new package for a small helper.
6. **One-Liner**: Can it be expressed clearly and simply in a clean one-liner?
7. **Minimal Code**: Write only the exact, minimal lines needed to satisfy the requirement.

*Non-negotiables: Never cut corners on security, input sanitization, error handling, or accessibility.*

---

## 2. Get Shit Done (GSD) Workflow
- For any feature or refactoring task with >1 step, define the objective clearly.
- Create or update a brief task checklist before editing files.
- Complete tasks atomically: inspect, implement, verify, check off.
- Keep context clean: do not bloat responses with unnecessary explanations.

---

## 3. Ralph Loop Autonomous Standard
- When executing comprehensive tasks (e.g. via `/goal` or batch requests), do not stop halfway.
- If an error or test failure occurs, inspect the exact error, diagnose the root cause, apply the fix, and re-test.
- Maintain a progress state until the task definition of done is 100% achieved.

---

## 4. CodeRabbit Review Standard
Before presenting completed code or finalizing pull requests:
- Audit changed lines for OWASP Top 10 security issues.
- Check edge cases (null/undefined checks, network failures, empty states).
- Verify no secrets or sensitive tokens are exposed.
