---
name: cycle
description: Run one Chronicle writing cycle (stage 1 of the pipeline-automation spec) — preflight, hunt, writer subagent, injection, gates, referee subagent, PR. Use when the owner says to run a cycle, run the pipeline, or write the next chapter via the pipeline. One explicit trigger = one cycle; never queue.
---

# /cycle — one writing cycle, session-orchestrated

You are the stage-1 orchestrator. The scripts are the rails: **never free-hand
what a script can assert.** The accept decision is the owner's; you HALT at a
PR. The referee's verdict can halt you earlier. One invocation = one cycle.

## Boundaries (violating any of these is a critical failure)
- NEVER merge anything. NEVER edit master/ by hand — only `inject` writes it.
- Any §7 escalation trigger (shelf cards, renumbering, timeline lanes, maps
  beyond colour, ownership boundaries, work-order conflicts, contradicted
  targets, referee requesting more context, phase boundary): run
  `python3 pipeline/lib/escalate.py`, push the branch, open the GitHub issue
  titled `ESCALATION: <slug> — <reason>`, and STOP. No PR.
- Serialize on master/: check no other `cycle/*` branch has an open PR before
  starting (codexfs.save rewrites every file — parallel cycles corrupt).

## Control flow
1. `git checkout main && git pull` — start from the accepted tip.
2. `python3 pipeline/run_cycle.py start` (add `--dry-run` if asked). It does
   preflight (pinned scripts, real work order, validator-green main), parses
   the brief, snapshots the baseline, runs hunt-before, assembles the writer
   prompt, and prints the run-id + context budget. If it exits 3, escalate; if
   it demands an external target list, ask the owner for one and STOP.
3. `git checkout -b cycle/<run-id>`.
4. WRITER: launch a subagent — model from the brief (`sonnet` default, `opus`
   if routed), prompt = the FULL contents of `pipeline/logs/<run>/writer-prompt.md`,
   instruction: "follow the OUTPUT CONTRACT exactly; return only fragments and
   writer notes." Save its complete output verbatim to
   `pipeline/logs/<run>/writer-output.md`. Record the model id and approximate
   token counts in `pipeline/logs/<run>/costs.md`.
5. `python3 pipeline/run_cycle.py inject --run <run>` then
   `python3 pipeline/run_cycle.py gates --run <run>`.
   On failure: ONE retry — re-launch the writer with the failure text appended;
   `git checkout -- master/` first to reset; second failure = abort + issue,
   branch pushed with logs.
6. `python3 pipeline/run_cycle.py hunt-after --run <run>`.
7. `python3 pipeline/run_cycle.py assemble-referee --run <run>`.
8. REFEREE: launch a subagent — model **opus-4.8, pinned; never the session's
   own model if that differs**, prompt = `referee-prompt.md`, instruction:
   "follow the referee OUTPUT CONTRACT." Save verbatim to
   `pipeline/logs/<run>/referee-output.md`; append model id + tokens to costs.md.
9. Parse the verdict sections:
   - ESCALATIONS non-empty → escalate path (above). STOP.
   - PATCHES present → write them to `pipeline/logs/<run>/referee-patches.md`,
     `inject --run <run> --fragments …`, re-run `gates`, `hunt-after --post-patch`.
     Patch failure = abort + issue; never silently drop a patch.
   - NEXT BRIEF → save to `pipeline/logs/<run>/next-brief.md`, then
     `python3 pipeline/run_cycle.py next-brief --run <run> --file pipeline/logs/<run>/next-brief.md`.
10. `python3 pipeline/run_cycle.py prbody --run <run>`. Commit EVERYTHING
    (master change + briefs/next.md + pipeline/logs/<run>/) on the cycle
    branch; push; open the PR with `pr-body.md` as the body, base `main`.
11. Post the PR link to the owner and HALT. Nothing merges. Do not start
    another cycle unless explicitly told to.

## Stage 2 (only when the owner replies on the PR)
`/approve`: verify main hasn't advanced past the merge-base (if it has:
rebase, re-run gates + hunt, referee delta-audit, post it — the old approval
is VOID). Then launch the referee subagent with a MERGE MANDATE to re-confirm
the gates, merge the PR (squash, message `<slug>: <one-line verdict>`),
archive the old brief to `briefs/archive/<slug>.md` in the merge.
`/approve-with-patch <text>`: referee applies it as a bounded patch, re-gates,
records it, merges. Out of bounds → escalate, don't merge.
`/reject <text>`: fold the text into the brief on the branch, re-run from
step 4 (rewrite), post the new verdict. Branch stays open.
