# DECISIONS — running log

Chronological log of material decisions. Structural ones also get an ADR in `docs/adr/`.

| Date | Decision | Rationale | ADR |
|---|---|---|---|
| 2026-09-15 | Frontend = React + TypeScript | Premium exec UX prioritized by stakeholder | ADR-001 |
| 2026-09-15 | Orchestration = internal state machine | Avoid LangGraph lock-in; §17 | ADR-002 |
| 2026-09-15 | Storage = SQLite + repository abstraction | MVP-right, cloud-swappable | ADR-003 |
| 2026-09-15 | LLM = OpenAI-compatible adapter + deterministic fallback | Provider-swappable; demo runs offline | ADR-004 |
| 2026-09-15 | Trust Score = weighted deterministic, versioned YAML | Reproducible and contestable | ADR-005 |
| 2026-09-15 | Collapse 14 agents into 5 logical agents | Reduce orchestration fragility (§17); keep observability | — |
| 2026-09-15 | Untrack committed `.venv` and `.env`; keep on disk | Repo hygiene + secret exposure remediation | — |
| 2026-09-15 | `Manual_Inputs/` legacy code treated REFERENCE_ONLY | Source files unrecoverable (download-failure stubs) | — |
| 2026-09-15 | Build vertical Wow slice before horizontal breadth | Demo impact is the primary success metric | — |
| 2026-09-15 | Technical environment = Vercel + Supabase | Stakeholder choice; fits repository abstraction | ADR-0008 |
| 2026-09-15 | Implementation language = TypeScript (overrides §11.1) | Vercel/Supabase-native; no Python on host; determinism is language-agnostic | ADR-0009 |
| 2026-09-15 | Auth = Supabase Auth, minimal roles | Believable steward/gate flows without an IdP | ADR-0007 |
| 2026-09-15 | Gate G1 approved ("Go on") | Stakeholder cleared scope/sources | — |
| 2026-09-15 | Business objects = config-driven Domain Packs (manifest + registry) | Extensibility: add Product/HR by dropping a folder, no engine code | ADR-0010 |
| 2026-09-16 | Demonstrator refonte = tight 4-screen plan (Cockpit · Carte du patrimoine · Analyse Guardian · Décisions expertes); broad "Recommandations_Dev" doc kept as north-star vocabulary/roadmap only | Two proposal docs conflicted (5 vs 4 nav); the tight plan maps ~1:1 onto existing engines, keeps the <60s story, and respects the no-invented-numbers rule | — |
| 2026-09-16 | Certificate screen kept as a route but removed from primary nav | Preserve working code without breaking the 4-entry nav | — |
| 2026-09-16 | Business exposure stays qualitative (Faible/Modérée/Élevée) + existing SIMULATED impact; no invented € figure | AGENTS.md: never invent a number without evidence | — |
## Open decisions (need owner input)

- ADR-006 PDF/executive export approach.
- Confirm the trusted counter-scenario dataset for `demo_data/` (Phase 1).
