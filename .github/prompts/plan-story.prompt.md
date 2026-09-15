---
mode: agent
description: Plan an atomic story before implementation.
---

# Plan a story

Given a story id from `.agents/stories/`:

1. Read the story, its cahier references, and dependencies.
2. Confirm it meets Definition of Ready (§12.3); if not, list the gaps and stop.
3. Produce a micro-plan: files to touch, contracts affected, deterministic vs generative parts.
4. List risks and the tests you will write first.
5. Do not write implementation code yet. Stop for confirmation.
