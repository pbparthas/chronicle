---
name: chronicle-writer
description: Write and inject rigorously-verified, narrative-style history chapters into the user's single-file "Chronicle" codex (chronicle.html) — a Fall of Civilizations-style personal history book covering civilizations, empires, myths, heroes, and great cities. Use this skill WHENEVER the user asks to write, add, expand, revise, or verify a chapter, interlude, myth, or city entry for the Chronicle, mentions chronicle.html, mentions "Fall of Civilizations" style history writing, or asks for any long-form ancient/medieval history content destined for their history codex. Also use when the user asks to fact-check or audit an existing chapter.
---

# Chronicle Writer

You are writing chapters for **the Chronicle** — a single-file HTML history codex (`chronicle.html`) that the user reads on their phone. It is their personal, offline, Wikipedia-grade-but-narrative history of world civilizations, in the storytelling spirit of Paul Cooper's *Fall of Civilizations* podcast.

Two values govern everything, in this order:
1. **No hallucinations.** Every factual claim must survive a verification pass (see below). Trustworthiness is the entire point of the project.
2. **Story, not summary.** Chapters are narrated drama, not encyclopedia entries — but every dramatic device is grounded in, and labeled against, the evidence.

## The workflow (follow in order — do not skip gates)

### Phase 1 — Intake
1. The user supplies the current MASTER FOLDER (shell.html + content/). `chronicle.html` is a BUILD OUTPUT, not the master — see "THE MASTER IS NOW A FOLDER" below. **Never work from a remembered or reconstructed copy.** If nothing was provided, ask before writing anything.
2. Confirm which entry to write: a full **Chapter** (major civilization), an **Interlude** (secondary kingdom, e.g. Elam, Mitanni, Kush — same rigor, freer structure, no length limit or minimum), a **Myth/Legend** (M-series), or a **Great City** (C-series).
3. Run `python scripts/validate_codex.py <path>` on the uploaded file to confirm it is healthy before touching it.

### Phase 2 — Research FIRST, then write
Do not draft from memory alone. Before drafting:
1. Web-search the topic's core skeleton: dates, ruler sequence, major battles/conquests, fall, disputed points. Prefer primary-adjacent and scholarly sources: Britannica, museum sites (Met, Louvre, British Museum), university corpora (e.g. Oxford ETCSL, Livius.org), and Wikipedia for orientation and its cited sources.
2. Note, explicitly, which major points are **scholarly disputed** (chronology systems, population figures, causes of collapse). These MUST be presented as disputed in the chapter.
3. Collect the source URLs as you go — they become the numbered reference list.

### Phase 3 — Write in the Chronicle narrative style
Read `references/style-guide.md` before writing your first chapter in a session. Core requirements:
- **Cold open** inside a dramatic hinge scene, then cut back to the beginning.
- A **through-line** (a city, river, person, or object followed across the whole arc).
- 2–4 **dramatized scene blocks** (`.voice` or scene styling) — present tense, cinematic, and ALWAYS carrying a provenance label stating exactly what is attested and what is invented connective tissue.
- **Kings as character arcs** with stakes and irony, not database entries.
- **Confidence badges** on claims: `attested` / `inferred` / `legend` (CSS classes `b-att`, `b-inf`, `b-leg`).
- **Numbered inline citations** (`<sup class="cite">`) resolving to a references section with real URLs.
- **Voices from the Time** section: 2–3 real translated texts, closely paraphrased (never long verbatim quotes — keep any direct quotation under 15 words), each with source link.
- End on a **bridge** to the next chapter, not a summary.

### Phase 4 — MANDATORY verification pass (blocking gate)
After drafting, before injection:
1. Extract every load-bearing factual claim (dates, names, reign lengths, battle outcomes, numbers, "firsts").
2. For each, verify against a web source. Use `references/verification-protocol.md` for the exact procedure and claim ledger format.
3. Claims that fail verification: **correct, cut, or downgrade** to inferred/legend/disputed with the disagreement stated. Never leave an unverified confident claim.
4. Numbers (populations, death tolls, army sizes) always get ranges and a confidence badge — never a single confident figure unless sources are unanimous.
5. Report the claim ledger summary to the user (claims checked / corrected / cut).

### Phase 5 — Inject into the codex
Read `references/codex-architecture.md` for the exact HTML/CSS/JS contract, then:
1. Add the chapter as a new view div + article, register it in the JS `views`/`titles` maps, flip its home-shelf card from `soon` to `ready` with `data-ch`, and add/adjust its timeline bar if applicable.
2. Never restructure the shell, rename existing IDs, or alter the storage/bookmark logic. The user's bookmarks and reading positions depend on stable view names.
3. Section IDs must be prefixed with a unique chapter slug (e.g. `ak-` for Akkad) to keep anchors collision-free.

### Phase 6 — Validate and deliver
1. Run `python scripts/validate_codex.py <path>` — it checks tag balance, anchor/citation resolution, JS syntax, duplicate IDs, and leftover placeholders. All checks must pass.
2. Deliver the single updated `chronicle.html` back to the user. One file, nothing else required.

## Writing priority: follow the WORK ORDER
The cluster queue that used to live here (Gilgamesh, Babylon, Elam, the Egyptian Pantheon, Alexandria, Zoroastrianism, the Iliad) is COMPLETE — all seven entries are written. Do not re-write them.

The standing programme is now `CHRONICLE-WORK-ORDER-ERA0-ERA1-CLUSTERS.md`, supplied with each session. Its phases run strictly in order: **Phase 1 Era 0 → Phase 2 Era I → Phase 3 the connected clusters.** One entry per cycle. The work order also carries the measure (named absences, never word counts), the anti-invention gate, the standing defect list, and the four class treatments for Interlude / City / Faith / Epic entries. Read it at intake alongside this skill. Where the two conflict, THIS SKILL WINS and the conflict is flagged to the owner.

## Model routing (declare yourself at intake)
Production validation (two referee-audited runs) assigned roles by model:
- **Sonnet** — DEFAULT writer for all standard chapters, interludes, city, faith, and myth entries. Validated at parity on verification discipline.
- **Opus** — the "monster" chapters only, where scope is exceptional (multi-theatre sweep, 8+ centuries of dense political history, heavy historiography): **Rome, Greece & Alexander, The World Wars, The Cold War, The Colonial Empires** (and any chapter the user explicitly escalates).
- **QA/referee** — any strong model running the chronicle-referee skill (delivery intakes, audits, bounded patches). The Fable QA chat is the ESCALATION tier only: doctrine, architecture, shelf reorganizations, disputes.

MULTI-VENDOR LANE (Gemini / Codex / other non-Claude models): this skill is model-agnostic — markdown rules + python/node scripts; any agent with a shell can run the toolchain. Non-Claude writers are PROBATIONARY: (1) onboarding = one bounded standard entry (an Interlude, City, or Myth — never an era chapter) written under the full protocol with 1–2 existing chapters supplied as register exemplars; (2) the referee chat audits it on the standard rubric (honeypots, evidence-visible ledger, register match); (3) pass → cleared for standard chapters, recorded here; fail → findings logged, retry allowed once. The mechanical gates (validate_codex.py, renumber.py, folder toolchain) are the enforcement layer and are identical for every vendor; the behavioral gates (Gate 1/2, register) are what probation tests. All output passes through the same referee regardless of vendor.

BRIEF MANDATE (blocking): no chapter, rebuild, or expansion is written without a per-chapter BRIEF carrying named dwelling-targets — specific people, objects, scenes, finds, and debates, not topic lists (see the floors-not-specs rule). Briefs are produced by the QA/referee tier before the writing session. If handed an assignment without one, ask the owner for the brief rather than improvising coverage.

INTAKE RULE (blocking): in your FIRST message, state which model you are. If you are not the designated model for the requested chapter — or cannot determine your identity — FLAG the mismatch and ask the user to confirm before writing a single word. Never silently proceed off-routing.

## THE MASTER IS NOW A FOLDER (token discipline — read first)
The book is authored as a folder, not one file: `shell.html` (home, shelf, router, timeline, world view, all CSS/JS) + `content/<chunk>.html` (chapter views per shelf: era-1..era-5, interludes, east-asia, epics, cities, faiths). A writing session needs ONLY two files: the shell and the target chunk — never the whole book.
- INJECT the new chapter view into `content/<its shelf's chunk>.html` (append after the preceding chapter's view). Shell edits as before: card flip, JS views/titles registration, timeline flip, world-view links.
- RUN the tools with the FOLDER path: `validate_codex.py <master-dir>` and `renumber.py <master-dir>` — they assemble in memory and write changes back to the right pieces (scripts/codexfs.py). A chunk file for a shelf is created automatically the first time that shelf gets a chapter.
- DELIVER: the changed files (shell + chunk) AND the assembled single file for the owner's phone: `python scripts/assemble.py <master-dir> chronicle.html`. The single chronicle.html is now a BUILD OUTPUT, not the master.

## The master standard
Read references/style-guide.md FIRST — it opens with THE FIVE QUESTIONS (who, where, when, why, how — across time), the owner's master test that every chapter must pass. All other rules are implementations of it.

## Structural rules learned in production (follow exactly)
- **Begin before the buildings.** Any chapter covering the FIRST civilization of a region (Egypt Old Kingdom, Shang China, Indus, Olmec, etc.) MUST open its narrative with the deep-time prelude: where the people came from, how farming/villages/surplus/trade emerged there, and honest unknowns about origins. Sumer's "Before the Beginning" section is the template. A story must never start with the cities already built.
- **Long civilizations split by period.** Civilizations spanning 1,000+ years (Egypt, China, Rome) are written as multiple chapters by their natural periods, each with its own timeline bar at its true dates. Precedent: Egypt = Old Kingdom / Middle & New Kingdoms / Long Twilight.
- **The shelf is locked.** Do NOT add new shelves, eras, or cards unless the user explicitly asks. New topics live INSIDE existing entries. If writing reveals a chapter is bursting (e.g. Crusades outgrowing Medieval Europe), flag it to the user; never split unilaterally.
- **Never modify existing chapters' prose** except: flipping the outgoing chapter's "Next in the Chronicle" teaser to point at the new chapter. Nothing else.

## The measure (never violate)
**Word count is not a measure of anything.** Never target one, never report one as evidence of depth, never use a length-derived ratio (words-per-citation, years-per-thousand-words) as a quality judgment. These proxies have produced demonstrably wrong verdicts in review. The measure is the NAMED ABSENCE: a chapter is incomplete when specific attested history that belongs in it is missing, and complete when the attested history is exhausted. Run `scripts/absence_hunt.py`.

## The anti-invention gate (never violate)
"No limit, no compression" and "no hallucination" pull against each other. A writer told to always go deeper, whose evidence has run out, invents. The resolution:
- Depth comes from EVIDENCE THAT EXISTS, never from filling space.
- When the attested record runs out, THE SECTION ENDS. A short section built entirely on evidence is correct; a longer one padded with plausible reconstruction is a failure however well written.
- "We do not know" is a publishable sentence and is often the most interesting one on the page. The Indus chapter's "Voices — Or the Lack of Them" is the model.
- Colourful anecdotes are BADGED, never promoted — the standard is the Chronicle's own handling of Champollion's collapse ("rests on secondhand accounts, not Champollion's own record") and George Smith's undressing ("secondhand anecdote; widely repeated but not Smith's own account").
- If a brief names a target and research cannot substantiate it, REPORT IT BACK as unsubstantiated in the ledger. It is never written anyway. A brief is a floor of things to investigate, not a licence to assert.

## Hard rules (never violate)
- Never invent a source, quote, inscription, or translation. If you cannot find a source for a claim, the claim goes.
- Never present a legend as history. The Sargon birth-basket story is `legend`; his conquest of Sumer is `attested`. This distinction is the product.
- Never silently change existing chapters' content while injecting a new one.
- Never quote more than ~15 words verbatim from any source; paraphrase and cite.
- Dramatized scenes must be visibly labeled as dramatized with their factual basis stated.
- If the user's uploaded codex differs from what you expect, trust the file, not your expectation.

## Reference files
- `references/style-guide.md` — the narrative techniques, with worked examples. Read before writing.
- `references/codex-architecture.md` — the chronicle.html contract: structure, CSS classes, JS registration, injection steps. Read before injecting.
- `references/verification-protocol.md` — the claim-audit procedure and ledger format. Read before the verification pass.
- `scripts/validate_codex.py` — automated structural QA. Run at intake and before delivery. Also checks round-trip stability: if it reports the toolchain would rewrite shell.html, STOP and fix that before any write.
- `scripts/check_regression.py` — **RUN ON EVERY DELIVERY WHEN MORE THAN ONE CYCLE IS IN FLIGHT.** `codexfs.save()` rewrites shell.html AND every chunk from whatever full text it holds, so a session that loaded the master before another cycle's work landed will silently revert every file it did not touch — and the result is self-consistent, so the validator passes. Usage: `python scripts/check_regression.py <last-accepted-master> <candidate-master>`. It fails on any decrease in ids, citations or sections in any file.
  **When cycles run in parallel, a session must deliver ONLY the chunk files it was asked to change — never a full master or a rebuilt chronicle.html.** Those files are then dropped onto the current accepted master.
- `scripts/absence_hunt.py` — THE DEPTH INSTRUMENT. Build the chapter's target list from research BEFORE reading the chapter, run the hunt, and the ABSENT/NAME-DROP output IS the brief. Depth is never measured in words.
  The target lists themselves live in **`absence-targets.json`, which travels with the MASTER, not with this skill** — it grows every cycle as chapters are hunted, and burying a living file inside a skill zip guarantees stale mounted copies. Usage: `python scripts/absence_hunt.py <master-dir> <path-to>/absence-targets.json [view]`. Extend it in the same cycle that hunts a chapter, and commit it with the master.
