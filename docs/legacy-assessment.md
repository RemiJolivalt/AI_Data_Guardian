# Legacy Assessment — `Manual_Inputs/`

**Method:** read-only inspection of `Manual_Inputs/` (file listing, sampling of contents,
git-tracking analysis). No file under `Manual_Inputs/` was modified.

## Headline finding (fact)

The "Previous POC" is an **unrecoverable cloud-sync snapshot**, not usable source code. The actual
program files were never downloaded: they are OneDrive/SharePoint download-failure placeholders.
Opening e.g. `__dev/Api/cortexai.py_Error.txt` returns:

> "This file cannot be downloaded. ExceptionType: TooManyRequestsMeTAException."

Every meaningful source artifact carries the `*_Error.txt` suffix and contains only that error
text. What physically synced is noise: a committed Python virtual environment
(`Previous POC/dev/.venv/`, ~2,557 files) and a `.env` file.

## What survives (intent, not code)

From filenames and folder structure we can reconstruct the previous POC's **intent** only:

| Artifact (name only) | Inferred purpose |
|---|---|
| `__dev/app_Error.txt`, `__front/app_Error.txt`, `app.zip_Error.txt` | Streamlit app (backend + front) |
| `__dev/Api/cortexai.py_Error.txt` | Snowflake **Cortex AI** calls |
| `__dev/Api/Snowflake.py_Error.txt` | Snowflake connection layer |
| `__dev/Api/db.py_Error.txt` | DB access helper |
| `__dev/DEV.db_Error.txt` | SQLite database |
| `Cortex Analyst YAML Generator.txt_Error.txt` | Generating Cortex Analyst semantic-model YAML |
| `__dev/requirements/requirements.in/.txt_Error.txt` | Dependency pins |
| `__gitlab_Error.txt`, `__sbx_Error.txt` | GitLab / sandbox environment notes |

**Inference (not fact):** the POC was a Snowflake Cortex + Streamlit application that generated
Cortex Analyst semantic YAML and stored state in SQLite.

## Reuse matrix

Per the cahier's classes (REUSE / ADAPT / REFERENCE_ONLY / REJECT):

| Component | Class | Justification |
|---|---|---|
| All `*_Error.txt` "source" files | **REFERENCE_ONLY** | Content unrecoverable; only intent is usable |
| Committed `.venv/` (both `dev` and `__dev`) | **REJECT** | Environment artifact; never belongs in the repo |
| `dev/.env` | **REJECT** | Secret material; must not be tracked |
| Cortex Analyst YAML generator (concept) | **REFERENCE_ONLY** | Useful as inspiration for semantic-model export, not reusable as-is |
| SQLite usage pattern (`DEV.db`, `db.py`) | **REFERENCE_ONLY** | Validates SQLite choice; no code to port |

**Net: there is no `REUSE` or `ADAPT` code.** The A03 Legacy Assessment Agent and non-regression
tests on `Manual_Inputs/` (cahier §5.2, §10.3) are therefore not needed; this document satisfies
the legacy-assessment requirement (US-002, F0-06).

## Actions taken (outside `Manual_Inputs/`)

- Added a root `.gitignore`.
- `git rm --cached` on the tracked `.venv/` and `.env` (files **kept on disk**, only untracked).
  Tracked file count dropped from 2,577 to 18.

## Recommendations

1. Treat the previous POC as inspiration only; do not attempt to port it.
2. If the real POC source is still needed, re-export it from the original OneDrive/SharePoint
   location (the current copy is corrupt).
3. Rotate any credential that may have been present in the tracked `.env` (assume exposed).
4. Do not reintroduce `.venv` or `.env` into git.

## Guarantees

- No file under `Manual_Inputs/` was modified, renamed, or deleted.
- Only git **index** entries were changed for the venv and `.env`; on-disk content is intact.
