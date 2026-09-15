# ADR-0010 — Business objects as config-driven Domain Packs

- Status: accepted
- Date: 2026-09-15
- Relates to: cahier §3 (scope), §5, §7; extensibility requirement

## Context

The platform must support many business objects over time (Customer today; Product, HR, any master
or transactional data tomorrow) without rewriting the engine for each.

## Decision

A business object is a **Domain Pack**: a folder containing its data assets, a simulated governance
catalog, DQ rules, a curated knowledge pack, and a `domain.yaml` **manifest** (id, label,
object_type, assets with roles/keys, file names, narrative stories). A single explicit registry
`config/domains.yaml` lists registered packs.

The deterministic engine (`runDomainAssessment`) is **generic**: it reads the manifest to build the
column universe, computes coverage/gaps, and generates grounded suggestions. The UI exposes a
dynamic route `/domain/[id]` and the sidebar/landing enumerate the registry.

**Adding a business object = drop a Domain Pack folder + append one registry line.** No engine code.

## Consequences

- Customer and Product are two instances of the same engine; both tested.
- `runCustomerAssessment` is retained as a thin back-compat wrapper.
- Real connectors later replace the CSV-simulated catalog/DQ/knowledge inputs behind the same
  manifest interface.
- Manifest and knowledge packs are versioned; suggestions stay grounded and human-validated (G2/G6).
