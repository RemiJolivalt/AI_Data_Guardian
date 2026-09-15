# ADR-0006 — Executive export approach

- Status: proposed
- Date: 2026-09-15
- Relates to: cahier ADR-006, §3.1, US-080

## Context

The Executive Brief must export to Markdown and JSON, and optionally PDF. PDF generation adds a
dependency and rendering complexity.

## Options

1. Markdown + JSON only in MVP; PDF deferred.
2. Markdown + JSON + PDF via a lightweight HTML-to-PDF renderer.
3. Markdown + JSON + PDF via a heavier reporting engine.

## Recommendation (pending approval)

Option 1 for the first demo, with the export interface designed so PDF (Option 2) is a drop-in.

## Decision

_Pending._
