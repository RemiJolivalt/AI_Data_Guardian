---
mode: agent
description: Independently review a completed story.
---

# Review a story

1. Re-derive the acceptance criteria from the story; verify each against the diff.
2. Check every factual claim has an `evidence_id`; flag any invented fact or number.
3. Confirm simulations are labelled `SIMULATED` and synthetic data is flagged.
4. Confirm deterministic/generative boundary, versioned scoring, and reproducibility.
5. Run tests and security checks. Confirm guardrails upheld.
6. Output `APPROVED` or a precise, blocking gap list.
