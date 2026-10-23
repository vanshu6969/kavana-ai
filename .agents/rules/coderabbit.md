# Rule: CodeRabbit Automated Review Gate

Enforce an automated quality and security review gate on all code changes prior to presenting them as finished.

## Quality Standards:
1. **Security**:
   - No hardcoded secrets, API keys, or credentials.
   - User inputs must be validated and sanitized to prevent XSS / injection.
   - Safe handling of sensitive tokens and authentication state.

2. **Defensive Coding & Edge Cases**:
   - Null and undefined safety on deep object accesses (`?.` and `??`).
   - Network calls must have `try/catch` and appropriate error handling.
   - Graceful fallback for empty lists, loading states, and network failures.

3. **Performance & Cleanliness**:
   - Avoid unintentional memory leaks (dangling event listeners, interval timers).
   - Avoid duplicate renders, unneeded DOM updates, and blocking operations.
   - Remove debugging `console.log` statements before finalizing code.
