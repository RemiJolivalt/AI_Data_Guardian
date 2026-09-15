---
mode: agent
description: Implement an atomic story test-first, minimal scope.
---

# Implement a story

1. Restate the acceptance criteria as tests and add them first (they should fail).
2. Implement the minimal code to satisfy them; keep compute deterministic.
3. Run tests, `ruff`, `mypy`, and security checks; fix causes, not symptoms.
4. Update `.agents/STATE.md` and any affected docs/ADRs.
5. Hand off to the reviewer agent. Do not merge or start another story.
