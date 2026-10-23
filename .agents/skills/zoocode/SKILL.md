---
name: zoocode
description: >-
  Multi-role autonomous agent workflow inspired by Zoo Code and Roo Code. Use when the user requests multi-persona workflows, role-specialized execution (Architect, Code, Test, Review), or structured task delegation.
---

# ZooCode: Multi-Role Autonomous Coordination

ZooCode enables structured, persona-driven autonomous development within the agent environment.

## Available Agent Roles:

### 1. Architect Role
- **Purpose**: High-level system design, schema definition, technology selection, and module breakdown.
- **Rules**: Does not edit implementation code. Outputs architecture blueprints, file structures, and API contracts.

### 2. Code (Engineer) Role
- **Purpose**: Direct implementation of components, functions, and services based on architectural blueprints.
- **Rules**: Strictly implements according to the spec, adhering to Ponytail anti-bloat guidelines.

### 3. Test & QA Role
- **Purpose**: Writes unit tests, integration tests, and edge-case verification scripts.
- **Rules**: Tests boundary conditions, failure paths, and ensures test suites pass cleanly.

### 4. Reviewer Role (CodeRabbit Bridge)
- **Purpose**: Audits diffs for security, logic errors, and style regressions before final acceptance.

## Workflow Execution:
When handling complex features, proceed through the roles in sequence:
`Architect` &rarr; `Engineer` &rarr; `Test` &rarr; `Reviewer`.
