---
name: coderabbit
description: >-
  Automated code review, security audit, and quality gate. Use when reviewing code changes, checking pull requests, auditing diffs, or validating security, performance, and best practices before merging or completing a task.
---

# CodeRabbit: Automated Code Review & Security Audit

This skill acts as an autonomous reviewer, performing in-depth analysis on modified files and diffs.

## Review Dimensions:

### 1. Security & Vulnerability Check
- **Secrets & Credentials**: Flag any API keys, tokens, hardcoded passwords, or internal URLs.
- **Injection & XSS**: Check that raw user inputs are not injected into `innerHTML`, `eval`, or unsanitized DOM sinks.
- **Authentication & Authorization**: Verify that protected endpoints and operations enforce permission checks.

### 2. Logic & Edge Cases
- **Null / Undefined checks**: Check for missing optional chaining (`?.`) or fallback defaults (`??`).
- **Async & Promises**: Check for unhandled Promise rejections, missing `await`, or race conditions.
- **Boundary values**: Empty arrays, 0, negative numbers, extremely long strings.

### 3. Performance & Cleanliness
- **Resource Cleanup**: Are event listeners, timeouts, and subscriptions removed when components unmount?
- **Unnecessary Overhead**: Does the change introduce large imports or redundant computations?
- **Dead Code**: Flag unused variables, commented-out dead code, and leftover debugging logs.

## Review Report Format:
When this skill runs, generate a structured review summary:
- **Status**: `PASSED` / `CHANGES_REQUESTED`
- **Security Assessment**: `Clean` / `Vulnerabilities Found`
- **Key Findings**: Bulleted list with file and line references
- **Recommended Action**: Concrete fix recommendations
