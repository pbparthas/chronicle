# Chronicle pipeline — stage 1 (Claude Code edition)

Automates the handoff logistics of the writing loop; never the judgment. The
orchestrator is a **Claude Code session** following `.claude/skills/cycle/`
(`/cycle`); the scripts here are the deterministic rails. There are no API
credentials anywhere in this repo — the models run inside the session as
subagents (writer: sonnet, or opus when the brief routes it; referee: opus-4.8
pinned, deliberately distinct from the owner's escalation tier).

## The loop

owner writes/approves `briefs/next.md` → owner tells a session "run the cycle"
→ session: preflight → hunt → writer subagent → inject → gates → hunt →
referee subagent → (patches) → PR → **HALT** → owner reads the prose and
replies `/approve` / `/approve-with-patch` / `/reject` → session executes
stage 2. One trigger, one cycle. The next brief lands on main only via merge.

## Brief format — `briefs/next.md`

Header `key: value` lines, then `---`, then the free-form body (see the
docstring in `lib/brief.py` for every field). `status: ready` is required to
run; the committed sample stays `draft`. `targets:` may carry inline absence
targets (JSON) merged over `master/absence-targets.json` — a cycle with zero
targets for its view refuses to start. Every 5th cycle (config.json
`external_hunt_every`) demands an externally-built target list — the §11
defense against the referee auditing its own brief.

## Guarantees enforced by scripts, not by promises

- `run_cycle.py start` refuses: drifted `scripts/` (SHA-pinned), placeholder
  work order, validator-red main, draft briefs, unknown slugs, empty target
  lists, missed external-hunt cycles.
- `lib/inject.py` refuses: whole-file output, ambiguous anchors, `<script>`,
  id collisions, control characters/emoji, unbalanced payloads — and confirms
  every payload by re-reading the file it wrote.
- `lib/gates.py` = G1–G7 (validator+round-trip, regression vs baseline with
  chunk-scope enforcement, assemble, hunt bookkeeping, encoding sweep,
  scene/prov parity, no-h2-in-scene). Add a gate whenever a defect class
  recurs — standing rule.
- `.github/workflows/cycle-checks.yml` re-runs the gates on every `cycle/*`
  PR against the merge-base — independent verification of what the session
  claims. `drift.yml` checks main nightly with zero model involvement.

## What is deliberately manual

The accept decision (no auto-merge exists anywhere), reading the prose,
every §7 escalation, and the first brief of a new phase.

> These checks confirm the chapter is well-formed and that the listed history
> is present. They do not confirm the history is correct, well-told, or free
> of duplication with another entry. **Read the prose.**
