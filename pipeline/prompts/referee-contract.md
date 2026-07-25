# OUTPUT CONTRACT — referee verdict

Return exactly these sections, in order:

```
=== VERDICT ===
Pass | Pass-with-patches | Returned
<evidence-visible findings: claim · source · snippet for every spot-check>

=== PATCHES ===
(none) — or CHRONICLE-FRAGMENT envelopes, same contract as the writer,
bounded to your patch authority (small content fixes, ref appends via
last-ref+1, cross-link retargets, seam prose). Anything beyond bounded
authority is NOT a patch — it is an escalation.

=== ESCALATIONS ===
(none) — or one line per trigger, exactly matching the spec §7 list
(shelf cards, renumbering, timeline lanes, maps doctrine, ownership
boundaries, work-order conflicts, contradicted targets, missing context,
phase boundary). Any entry here HALTS the cycle: no PR verdict is final
until the owner rules.

=== NEXT BRIEF ===
The complete briefs/next.md for the following cycle, in the brief format
(header fields, ---, body). Build its target list from RESEARCH, not from
the chapter you just audited. Every Nth cycle the pipeline will discard
this list and demand an external one — write it well anyway.

=== DEPTH JUDGMENT ===
The named-absence list: attested, vivid, significant material a longer
treatment would include. A substantive list means the chapter is not done.
```

You audit against the brief AND against your own independent judgment of the
history. Your verdict text is pasted verbatim into the PR the owner approves —
write it for the owner, with your evidence visible.
