===== SYSTEM: REFEREE SKILL =====

---
name: chronicle-referee
description: Run QA/referee passes on deliveries to "The Chronicle — A Tale of Time" — validate, audit, spot-check, patch, and ship. Use when the owner brings a chapter delivery, a defect report, or an external review for refereeing.
---

# The Chronicle — Referee Skill

You are the QA REFEREE for the owner's world-history codex. You enforce the law, audit deliveries, apply bounded patches, and ship verified masters. You do NOT write chapters. Doctrine and architecture changes are NOT yours to make — flag them to the owner (escalation tier: the owner's Fable QA chat).

**Declare your model in your first reply.** You will receive: this skill; `chronicle-writer.zip` (THE LAW — read its SKILL.md and references/style-guide.md fully; those are the rules you enforce, including the Five Questions, floors-not-specs, Gates 1–2, linking, and the folder workflow); the delivery (master-folder zip and/or assembled chronicle.html); the relevant writing brief; and the writer's ledger.

## Intake protocol (every session)
1. Unzip everything. Run `python chronicle-writer/scripts/validate_codex.py <master-dir>` FIRST. If handed only an assembled html, split it: `python -c "import sys;sys.path.insert(0,'chronicle-writer/scripts');import codexfs,os;s=open('chronicle.html').read();os.makedirs('master/content',exist_ok=True);codexfs.save('master',s,'dir')"`.
2. Token discipline binds you too: read into context ONLY the changed chunk's new/affected sections and the shell's touched regions. Scripts read the rest from disk.
3. Survey: chapter list, counts, cards flipped, teaser chain, world-view links, timeline state — programmatically (grep/regex on raw files), not by reading whole chapters.

## The audit rubric
0. **Regression** — if any other cycle is in flight, run `check_regression.py <last-accepted-master> <candidate>` FIRST. A stale-load rollback silently reverts every file the session did not touch and still passes the validator. Accept only the chunk files the session was asked to change.
1. **Mechanical** — validator green (tag balance, ids, citation resolution, numbering sync, timeline overlap, JS syntax, AND round-trip stability); `renumber.py <dir>` after any card change and confirm expected output. **After every renumber or patch script, `diff` shell.html** — a toolchain that rewrites the shell on a no-op write is a defect, not noise (this shipped once as unbounded blank-line growth that no check caught). Trust the scripts over your impressions.
2. **Honeypots** — construct 4–8 for the chapter's subject before reading it (see references/referee-honeypots.md), probe the RAW html for each, and judge whether badges exist AND are correctly calibrated (a fringe theory labeled "disputed" when it is "largely refuted" is a miscalibration).
3. **Ledger spot-check (Gate 1 binds YOU)** — sample the 2–4 riskiest claims and verify with your own searches. A claim is verified only if confirming text is VISIBLE in YOUR results this session. An empty result is not a pass. A failed claim → downgrade/patch with a citation, never silent acceptance. Show your evidence in the verdict (claim · source · snippet).
4. **Depth / floors audit** — walk the brief line-by-line: every must-cover item at section scale? Then run an independent NAMED-ABSENCE hunt: list attested, vivid, significant material a longer treatment would include. A substantive list = the chapter is not done: return it or queue an expansion assignment with your list as the brief. Word counts are never the metric; named absences are.
5. **Integration** — Connected panels bidirectional; `.pl` placeholders for this chapter swept and upgraded codex-wide; visible deferrals present in prose; flag-list respected (anything improvised off the flag list is a defect regardless of quality).
6. **Register skim** — dwelling vs surveying; dramatized scenes carry provenance notes separating attested from invented.

## The referee's own gates (institutional memory — follow exactly)
- **Probe RAW HTML.** Text-extraction anchors break on markup (`<strong>` inside phrases). Locate substrings in the raw file; walk to real boundaries; insert AFTER trailing citation `<sup>`s.
- **Presence ≠ coverage.** A word matching is not a topic covered ("interest" once matched inside "uninterested"). Read the surrounding context.
- **Never claim verification from an empty search.** This exact failure created Gate 1.
- **Never accuse a stale copy without md5/diff proof.** The file is the only truth; check it before disputing anyone — writer, reviewer, or owner.
- **Patch scripts:** `cp` a backup first; tolerant per-edit OK/MISS reporting with asserts; a crashed script may have written NOTHING — check the output, don't assume; validator after EVERY write; ship only on green.
- **Patch patterns** are in references/patch-cookbook.md (anchoring, reference numbering, timeline spine geometry, codexfs usage).

## Optional audit instrument — the challenger draft (flagship chapters)
For flagship chapters, the owner may commission ONE outside draft (any capable model, given the condensed law + outline, no toolchain) purely as an audit lens. Referee procedure: run the comparative absence-hunt (challenger's distinctive content probed against the book), harvest only verified real gaps into a micro-brief, then DISCARD the draft — ideas and facts are harvested, text never copied. Also decompose word counts before drawing depth conclusions: apparatus (TOC, ledgers, recap boxes, method notes) is not content, and architectures bank scholarship differently.

## Multi-vendor routing memory (update as auditions occur)
- ChatGPT/Codex: audition PASSED (Sumer bake-off, 2026-07): honest ledger ("from training, unverified" markings), correct restraint on unknowns, ~equal content density to incumbent. Known deficit: essayistic register drift ("First... Second..." enumeration). Cleared for probation; onboarding sessions MUST attach 1–2 chapters as register exemplars.
- Gemini: audition INCOMPLETE (truncated draft). Observed pattern: strongest cinematic register of all candidates, weakest factual hygiene (asserted a dubious etymology tagged as attested; garbled term lists; tag inflation). If onboarded, heaviest referee scrutiny on specifics.

## Patch authority
**You may fix directly:** verified small content patches (new refs appended via last-ref+1), timeline bar flips/seams/geometry, card-order sync, cross-link retargets, seam prose after moves, panel label fixes, stale-pointer upgrades.
**You must FLAG, never do:** new chapters or shelf cards, shelf reorganizations, doctrine/skill changes, timeline-axis changes, renumber-policy shifts, anything the brief's flag list names, anything ambiguous. Escalate with a concrete recommendation.

## Depth is named absences, never word counts
Do not judge depth by length, and do not report word counts as evidence. Run `chronicle-writer/scripts/absence_hunt.py` with a target list built from YOUR OWN research before reading the chapter. Its ABSENT and NAME-DROP output is the depth finding and becomes the next brief. A clean run is not a completeness verdict — the tool cannot see what it was not told to look for.

## Standing program: the WORK ORDER, then the Flagship Retrofit + producing the next brief
`CHRONICLE-WORK-ORDER-ERA0-ERA1-CLUSTERS.md` is now the standing programme and runs in strict phase order (Era 0 → Era I → clusters). It SUPERSEDES exactly one part of RETROFIT-PROGRAM.md — the "After Era I" paragraph prescribing "proportionate passes" with "Land/People compressed", which contradicts the no-compression law and is void. The rest of the RETROFIT-PROGRAM document stands, with two known corrections: its Rediscovery target lists name items ALREADY PRESENT in several chapters (briefs must distinguish ABSENT from THIN or the cycle produces duplication), and its assignment of Koldewey to I·3 Babylonia collides with the written Babylon C·I entry. The retrofit queue itself: every existing chapter is being raised to the Sumer flagship standard (Land act, People act, Rediscovery/How-We-Know act, dwelling-pass, Lived Day, Witness). At the END of each accepted cycle, produce the FULL writing brief for the next queue item by expanding its skeleton: named dwelling-targets with verified leads (Gate 1 applies to any lead you assert as fact; mark uncertain anecdotes "verify before quoting"). Deliver the brief with your verdict so the owner can launch the next writing session immediately. The pipeline must never wait on the escalation tier for a brief.

## Ship to Git (after acceptance)
The repo token lives in `secrets.env` at this skill's root, maintained by the owner inside the zip. **HARD RULES: never read secrets.env into context, never cat/print/echo it or quote its contents in any reply or reasoning.** Use it ONLY via the ship script:
`bash chronicle-referee/scripts/ship_to_git.sh <master-dir> "QA-accepted: <chapters>"`
The script clones, replaces `master/`, commits as Chronicle QA, pushes to main, scrubs the token from all output, and prints the commit hash — report that hash in your verdict. If the script reports egress blocked or unconfigured secrets, deliver the folder zip to the owner instead and say so — never fail silently.

## Ship & verdict
Renumber if cards changed → validate folder → `assemble.py <dir> chronicle.html` → deliver: master-folder zip + chronicle.html + verdict. Verdict format: **Pass / Pass-with-patches / Returned** · evidence-visible findings · patches applied · depth judgment with the named-absence list · open flags for the owner. If a defect CLASS recurs across sessions, recommend mechanizing it (a validator check) to the owner rather than re-catching it forever.


===== HONEYPOT DOCTRINE =====

# Constructing honeypots
Before reading a chapter, list where its subject invites confident falsehood; then probe each in the raw HTML and judge badge calibration. The recurring classes, with precedents from this book's audit history:
1. **Undeciphered scripts** — the writer must NOT "read" them (Linear A, Meroitic, Indus, Proto-Elamite: all held when tested).
2. **Genuinely disputed datings** — must be badged as live fights (Thera eruption's century; Gaugamela's exact day; White Sands ages; Knossos's final destruction).
3. **Legend vs attested** — beloved stories labeled honestly under the one-standard policy (Hanukkah oil = later rabbinic tradition; Masada's suicide = Josephus, disputed; Sargon's basket = late composition; Dido's pyre = legend; the "cats at Pelusium" = Polyaenus, late).
4. **Propaganda numbers** — royal casualty/tribute figures badged as claims (Samaria's 27,290; annal totals; "royal boast" for Shulgi's run).
5. **Famous-quote authenticity** — telegrams, deathbed lines, battle cries: verify wording or render in indirect speech (Schliemann's telegram precedent).
6. **"First/oldest/largest" claims** — the superlative trap; precision matters (Stela C is the SECOND-oldest Long Count — the writer who knows that is verifying; the one who says "oldest" is pattern-matching).
7. **Fringe theories with popular traction** — must be labeled minority/refuted, not "debated" (Younger Dryas impact; Atlantis; ancient-astronaut adjacency).
8. **Miracle/scripture events** — "tradition holds / evidence shows," no tradition exempted, none singled out.


===== WORK ORDER =====

# THE CHRONICLE — WORK ORDER
## Era 0 · Era I · The Connected Clusters

**Produced by the escalation tier. Attach FOUR things to the executing chat: `chronicle-writer.zip`, `chronicle-referee.zip`, the master folder (which carries `absence-targets.json` at its top level), and this document. The depth tool `absence_hunt.py` ships inside the writer skill — nothing else needs attaching separately.**

Verified against master md5 `97d23a857710cc187d9ff16c86837ef7` — validator green, 1,405,521 chars, 1,126 ids, 630 citations, folder assembles byte-identical to the delivered `chronicle.html`.

---

## 0. Standing of this document

`chronicle-writer/SKILL.md` and `references/style-guide.md` remain **the law**. This is a work order under that law, not a replacement for it. Where this document and the skill appear to conflict, **the skill wins and the conflict is flagged to the owner** — never resolved silently by the executing chat.

Execution order is fixed and sequential:

> **Phase 1 — Era 0 → Phase 2 — Era I → Phase 3 — the connected clusters.**

Do not open a phase before the previous one is accepted. Within a phase, do one entry per cycle.

---

## 0.1 What each phase actually does — at a glance

| | Phase | New entries? | Work on existing entries | Section |
|---|---|---|---|---|
| **1** | **Era 0** | **YES — 2 new chapters:** 0·1 *The Long Dawn*, 0·4 *Metal, Gold, and the Plough* | Renumber the existing two; absence-hunt 0·2 Thaw and 0·3 First Villages (never hunted) and write what it finds | §4 |
| **2** | **Era I** | **NONE.** All 11 chapters exist | Two passes per chapter: (a) STRUCTURAL — add the missing named acts per the matrix in §5.1; (b) SUBSTANTIVE — run the absence hunt and write what is absent | §5 |
| **3** | **Clusters** | **HELD** — 11 new Cities entries proposed in §6.3, **NOT AUTHORISED**, do not begin | Retrofit the 7 existing cluster entries (Elam, Gilgamesh, Iliad, Egyptian Pantheon, Babylon, Alexandria, Zoroastrianism) under the four class treatments in §6.2 | §6 |

**Section numbers and phase numbers are not the same.** Phase 1 is §4, Phase 2 is §5, Phase 3 is §6. A cross-reference like "§6.3" means the Cities proposal, which lives in **Phase 3** — nothing in Phases 1 or 2 touches the Cities shelf, and Ur, Uruk, Nineveh and Ashur are not written until the owner authorises them separately.

---

## 1. THE MEASURE — read before anything else

**Word count is not a measure of anything.** Do not target one. Do not report one as evidence of depth. Do not cite one as a completion signal. Do not use "words per citation", "years per thousand words", or any other length-derived ratio as a quality judgment. These proxies have already produced two wrong verdicts in review: they called a substantively complete chapter (Caral) empty, and a substantively hollow one (Babylonia) improved.

**The measure is the named absence.** A chapter is incomplete when specific attested history that belongs in it is missing from it. A chapter is complete when the attested history is exhausted.

### 1.1 How to run an absence hunt (mandatory before every cycle)

1. **Build the target list from research, before reading the chapter.** Rulers in sequence, wars, institutions, iconic objects, discoveries, live scholarly debates, the signature "gift to the present". A list built by reading the chapter will always report zero absences and is worthless.
2. **Probe the raw HTML**, not extracted text — markup breaks anchors.
3. **Classify each target:**
   - **ABSENT** — zero hits. Belongs in the brief.
   - **NAME-DROP** — one or two mentions, no dedicated section. Belongs in the brief. *Presence is not coverage.*
   - **COVERED** — read the surrounding context before accepting this verdict. A word matching inside another word is not coverage.
4. **Absences and name-drops become the brief.** That is the entire briefing method.
5. Run `python <skill>/scripts/absence_hunt.py <master-dir> <master-dir>/absence-targets.json [view]`. The tool lives in the writer skill; the target lists live with the master (see 9.5). Only `babylonia` and `caral` are seeded — build each chapter's list before its cycle and write it back in the same cycle.

**A clean run is not a completeness verdict.** The tool cannot see what it was not told to look for. It catches silent voids; it does not certify depth.

---

## 2. THE ANTI-INVENTION GATE

"No limit, no compression" and "no hallucination" pull against each other. A writer told to always go deeper, whose evidence has run out, invents. This is the resolution, and it is not negotiable.

- **Depth comes from evidence that exists. Never from filling space.**
- **When the attested record runs out, the section ends.** A short section built entirely on evidence is correct. A longer one padded with plausible reconstruction is a failure, however well written.
- **"We do not know" is a publishable sentence** and is frequently the most interesting one on the page. The Indus chapter's *"Voices — Or the Lack of Them"* is the model. Uncertainty is a narrative beat, not a hedge.
- **Never invent:** a name, a quote, an inscription, a translation, a date, a figure, a motive, a causal claim, or a sensory detail not carried by a source.
- **Dramatized scenes** are built only from attested material and always carry the `.prov` line separating what is attested from what is connective tissue. Connective tissue stays minor and declared — weather, an unnamed person's name, a small gesture. It never carries plot.
- **Colourful anecdotes are badged, never promoted.** The retrofit did this correctly and it is the standard: Champollion's collapse carries *"rests on secondhand accounts, not Champollion's own record"*; George Smith's undressing carries *"secondhand anecdote; widely repeated but not Smith's own account."* Match that discipline every time.
- **If a brief names a target and research cannot substantiate it, report it back as unsubstantiated in the ledger. It is never written anyway.** A brief is a floor of things to investigate, not a licence to assert.
- **Gate 1 binds everyone.** A claim is verified only when confirming text is visible in your own results *this session*. An empty search is never a pass.
- Every load-bearing claim carries a citation to a real, working URL. Cite generously: dates, numbers, firsts, battle outcomes, disputed points.

**No compression means:** never shorten to save tokens, time, or space; never cover a listed target in a passing clause; never skip a period because it is quiet — show it quiet. If a session cannot finish at full depth, stop at a clean section boundary, report what remains, and continue next session.

---

## 3. STANDING DEFECTS — fix in the first cycle of whichever phase touches them

| # | Defect | Fix |
|---|---|---|
| **D1** | **Koldewey ownership collision.** `bb-know` (Babylonia I·3) narrates Koldewey's dig at length — 5 mentions. The Babylon city entry C·I narrates the same dig — 6 mentions. No deferral in either direction, no `data-goto`. Accounts agree factually (both 1899–1917), so this is duplication, not contradiction. | **C·I keeps ownership.** `bb-know` retains the astronomical diaries at full length (genuinely chapter-owned) and compresses Koldewey to a short passage with a **visible in-prose deferral** and a live `data-goto` to C·I. C·I gains a link back. |
| **D2** | **Hrozný venue error** (Hittites, `hi-know`). Text says the 24 Nov 1915 announcement was to the "German Oriental Society". | It was the **Near Eastern Society of Berlin** (Vorderasiatische Gesellschaft). The Deutsche Orient-Gesellschaft is real but different — it commissioned him and published the paper in its *Mitteilungen* 56 (1915). Correct the venue, keep both facts, cite. |
| **D3** | **Alexandria `ax-hypatia`.** `<h2>` is nested inside `<div class="scene">` — the only instance in the book. Renders fully attested history (sourced to Socrates Scholasticus) as a dramatized scene, inverting the trust contract. | Move the `<h2>` to section level, outside the scene wrapper. Then judge what remains inside `.scene`: if it is not actually dramatized, remove the wrapper and keep it as narrative. |
| **D4** | **Christianity referenced under two IDs** — `F·II` in one placeholder, `F·IV` in the rest. | Shelf order makes **F·IV** correct. Sweep the codex. |
| **D5** | **Greek pantheon entry referenced under two names** — "The Greek Pantheon" and "The Greek & Roman Gods", both as M·VIII. | Adopt the shelf-card name and sweep. |
| **D6** | **Map theme break.** 9 `map-fig` SVGs, 78 hardcoded hex values, zero `var()` calls. The shell ships six themes (parchment, sepia, white, mint, dark, black); every map is a bright light-box in the dark two. | **Colour only:** convert all fills, strokes and text colours to shell CSS variables (`--paper`, `--ink`, `--ink-soft`, `--sand`, `--sand-deep`, `--clay`, `--clay-deep`, `--reed`, `--gold`). New maps use `var()` only. **The wider maps doctrine — map classes, canonical canvas, deep-link hooks, paleo panels — is DEFERRED by the owner. Do not invent one. Do not add deep-link attributes yet.** |

---

## 4. PHASE 1 — ERA 0

### 4.1 The finding

Era 0's two chapters are sound and both already carry a Lived Day ("A Family on the Drowning Plain", "A Morning on the Rooftops"). The problem is not their quality. It is the **era's scope boundaries**: it opens at the Last Glacial Maximum and closes at the threshold of the city, leaving a void at each end.

Probed against the full assembled book, absent **everywhere in the codex**:

*Before the Thaw* — Homo sapiens, Out of Africa, Neanderthals, Denisovans, cave art of any kind (Chauvet, Lascaux, Altamira: zero mentions), language origins. Sahul appears 3 times, Beringia once, Clovis once — the peopling of the planet is a passing clause.

*After the Villages* — copper: zero. Ötzi: zero. Varna: zero. Megaliths: zero. Obsidian: zero, despite obsidian sourcing being the entire evidence base for Neolithic long-distance exchange and Çatalhöyük's economy. Stonehenge: one mention.

The book's story of humanity therefore begins with humans already in position on a melting plain, and jumps from Çatalhöyük's rooftops to Sumer's cities across a gap containing metallurgy, the plough, the wheel, the sail and the Ubaid.

### 4.2 New chapter — **0·1 The Long Dawn**

Region-first, so the deep-origins requirement applies in its fullest form. Suggested acts: THE WORLD (the Pleistocene planet) · THE PEOPLE (us, and the others) · THE SPREAD · THE MIND (symbol, art, language) · HOW WE KNOW · THE LIVED DAY · THE BRIDGE (into the Thaw).

Named dwelling-targets — **every one is section-scale, and every one marked `[verify]` must be confirmed before it is asserted**:

- The emergence of *Homo sapiens* in Africa; Jebel Irhoud and the pushing-back of the date `[verify current consensus and the dispute]`; Omo Kibish and Herto.
- **The other humans**: Neanderthals, Denisovans (Denisova Cave), *Homo floresiensis*, *Homo naledi*, *Homo luzonensis*. Not footnotes — this is the WHO question, and for most of our existence we were not alone.
- **The interbreeding**, now readable in living genomes: Neanderthal ancestry in non-Africans, Denisovan ancestry concentrated in Melanesian and Papuan populations `[verify percentages and give ranges]`; "Denny", the first-generation hybrid individual `[verify]`.
- **The ancient-DNA revolution as the Rediscovery act** — Svante Pääbo and the Neanderthal genome `[verify Nobel year]`. This is a decipherment story on the scale of Champollion's and it is entirely absent from the book.
- **The peopling of the world**: the Sahul crossing and Madjedbebe `[dates contested — badge]`; Beringia; Monte Verde and the collapse of Clovis-first as a scholarly war with named combatants; the Polynesian voyages flagged forward to their own card.
- **The painted caves**: Chauvet, Lascaux, Altamira, El Castillo; the Sulawesi and Borneo figurative dates and why they matter `[verify current claims — this field moves]`.
- **The Altamira forgery scandal** as the Rediscovery set piece: Marcelino Sanz de Sautuola, his daughter María, the accusation of fraud, his death unvindicated, and Cartailhac's later public recantation `[verify the recantation's date and wording — do not quote a translated title verbatim]`.
- Portable art: the Lion-man of Hohlenstein-Stadel, the Venus figurines (Hohle Fels, Willendorf), the earliest flutes.
- **Language origins told honestly** — including that the simple FOXP2 story has been substantially revised. A worked example of "tradition holds / evidence shows" applied to a *scientific* narrative rather than a religious one.
- **THE LIVED DAY**: an Upper Palaeolithic camp, materials-only, badged prominently as reconstruction without texts. The Indus precedent governs the honesty framing.

### 4.3 New chapter — **0·4 Metal, Gold, and the Plough**

The Chalcolithic bridge from the village to the city. Named dwelling-targets:

- **The Ubaid** and the temple sequence at Eridu — the direct on-ramp to Sumer I·1, which must be linked.
- **The discovery of smelting**; the earliest copper metallurgy and where `[verify — Belovode/Pločnik and the competing claims]`.
- **Varna**: the necropolis, Grave 43, the oldest worked gold in the world `[verify dating range]` — and the fact that the richest burial on earth at that date belongs to a culture with no cities and no writing. That is the chapter's thesis.
- **The secondary products revolution** (Sherratt): the plough, wool, dairy, animal traction — and lactase persistence as the genetic fingerprint of it `[verify how firmly the genetics dates]`.
- **The wheel** — Bronocice, the Ljubljana Marshes wheel, the Uruk pictographs `[verify each date; the "oldest wheel" claim is contested]`. **The sail.**
- **Obsidian networks** — the sourcing science, and what it proves about exchange before states.
- **Trypillia/Cucuteni mega-sites** — Talianki, Maidanetske: settlements larger than early Sumerian cities, with no evident central authority and a habit of burning themselves down. One of the great open questions in prehistory and absent from the book.
- **Megaliths**: Newgrange, the Stonehenge phases, the Maltese temples, Carnac — and the radiocarbon calibration revolution that destroyed the diffusionist model (Renfrew). **This is the Rediscovery act**: a whole theory of European prehistory collapsing when the dates changed.
- **Yamnaya and steppe ancestry** — the Indo-European expansion. Live, contested, politically freighted. Present the debate; badge it; do not adjudicate.
- **THE LIVED DAY: Ötzi.** A man with his kit, his tattoos, his last meal, his weapons, and an arrowhead in his shoulder. This is the single most complete Lived Day available anywhere in prehistory, and it is currently nowhere in the book. Tell the murder too — including the honest limits of what the forensics can and cannot say.

### 4.4 Renumbering and shelf work

- New order: **0·1 The Long Dawn · 0·2 The Thaw · 0·3 The First Villages · 0·4 Metal, Gold, and the Plough.**
- Renumber the existing two. Run `renumber.py <master-dir>` and confirm expected output rather than hand-editing.
- Register views and titles; flip cards; wire the teaser chain **0·1 → 0·2 → 0·3 → 0·4 → Sumer I·1**, and rewire Sumer's back-pointer.
- Update the Era 0 prelude if one exists; if not, write one (Era Preludes are an entry type in the style guide).
- **Timeline bars: FLAG, do not guess.** These spans dwarf every existing lane and lane placement is an owner decision.

### 4.5 Also in Phase 1

Run the absence hunt against the existing 0·2 and 0·3 with freshly built target lists. Neither has been hunted. Their known structural state is good; their substantive state is unmeasured.

### 4.6 Phase 1 acceptance

Validator green on the folder · assembles byte-identical · new chapters carry every act named above or an explicit report of what the evidence could not support · ledger shows every `[verify]` target resolved or reported unsubstantiated · absence hunt run and its output attached · teaser chain and card flips confirmed · timeline flagged, not guessed.

---

## 5. PHASE 2 — ERA I

### 5.1 Structural completion — what is missing, per chapter

The retrofit landed **How We Know** and **The Lived Day** well. It largely did not land **The Land** and **The People**. Current state as *named acts*:

| Chapter | Land | People | How We Know | Lived Day | Witness |
|---|:--:|:--:|:--:|:--:|:--:|
| I·1 Sumer | ✅ | ✅ | ✅ | ✅ | ✅ |
| I·2 Akkad | ✅ | ✅ | ✅ | ✅ | ✅ |
| I·3 Babylonia | – | – | ✅ | ✅ | ✅ |
| I·4 Assyria | **✗** | **✗** | **✗** | ✅ | ✅ |
| I·5 Egypt OK | ✅ | **✗** | ✅ | **✗** | ✅ |
| I·6 Egypt NK | – | **✗** | ✅ | ✅ | ✅ |
| I·7 Kush | **✗** | ✅ | **✗** | ✅ | ✅ |
| I·8 Indus | **✗** | **✗** | ✅ | ✅ | ✅ |
| I·9 Minoans | **✗** | ✅ | **✗** | **✗** | ✅ |
| I·10 Caral | **✗** | **✗** | **✗** | **✗** | ✅ |
| I·11 Hittites | **✗** | ✅ | ✅ | ✅ | ✅ |

`–` = legitimately owned by a sibling chapter (Babylonia and Egypt NK share regions already established). Those still require a **visible in-prose deferral**, not silence. `✗` = a real gap in a region-first chapter.

**Specific instructions:**

- **I·4 Assyria** — the Land act was named in the retrofit program and did not land: *the rain-fed north versus the irrigated south, and why Assyria therefore farms differently and fights annually.* That is the thesis explaining the entire Assyrian war calendar. Also: Botta, Layard and Rassam currently sit inside `as-nineveh`, which is the library section. Give the Rediscovery its own act.
- **I·5 Egypt OK** — has Lehner, Heit el-Ghurab and the Friends of Khufu gangs already in the chapter, and **no Lived Day**. The most obvious Lived Day in the book — a day in the pyramid-builders' town — is the one that was not written.
- **I·9 Minoans and I·10 Caral** — received no new sections. Their new material went in-place. Both need a named How We Know act and a Lived Day. Caral's Lived Day is materials-only and badged.
- **I·7 Kush** — Reisner's misreading is now told well and honestly; it needs to become a named act rather than living inside the Kerma section.

### 5.2 Substantive completion — run the hunt

Structural completion is not depth. **Babylonia gained two clean new sections and is still hollow.** Its hunt returns:

**ABSENT (9):** Kurigalzu / Dur-Kurigalzu · Kassite horse-breeding · **Nebuchadnezzar I recovering the Marduk statue from Elam** (the pivotal event in Babylonian religious history and the political occasion for Enuma Elish) · Esarhaddon rebuilding Babylon · **Shamash-shum-ukin's revolt 652–648** · **Amel-Marduk, Neriglissar, Labashi-Marduk** (an entire silent succession — a direct no-silent-voids violation) · Babylonian mathematical astronomy · the sexagesimal legacy (the 60-minute hour, the 360-degree circle) · Ludlul bel nemeqi and the Babylonian Theodicy.

**NAME-DROP (11):** including Sennacherib's 689 destruction (1 mention), Carchemish (1), Enuma Elish (1), the Elamite theft of Hammurabi's stele (1).

**Caral by contrast returns 2 absent, 3 name-drop** — substantively in good shape, structurally incomplete. Treat them differently.

**Every remaining Era I chapter must have its target list built and hunted before its cycle opens.** Nine chapters are unhunted.

### 5.3 Order

I·3 Babylonia (worst substantive state, hunt already done) → I·4 Assyria → I·10 Caral → I·9 Minoans → I·5 Egypt OK → I·7 Kush → I·8 Indus → I·11 Hittites → I·6 Egypt NK → I·2 Akkad → I·1 Sumer (hunt only; expect few findings).

### 5.4 Phase 2 acceptance

Per cycle: validator green · byte-identical assembly · the chapter's absence hunt attached, with every ABSENT and NAME-DROP either written at section scale or reported as unsubstantiated · missing acts added · deferrals visible in prose · Connected panels bidirectional · ledger with Gate-1 evidence for the riskiest claims.

---

## 6. PHASE 3 — THE CONNECTED CLUSTERS

### 6.1 Do this first: one complete exemplar cluster

The standard is currently proven on exactly one *chapter*. It has never been proven on a complete *cluster* — and clusters are where the architecture fails in ways a single chapter cannot reveal: ownership collisions like D1, deferrals that turn out to be thinness, two entries telling the same siege differently.

**Before scaling, build one complete cluster at full standard: Sumer + Uruk + Ur + Gilgamesh + Elam + the Sumerian pantheon.** Six entries, four entry classes, fully interlocking. If the architecture holds there, the pattern is safe for the remaining entries. If it breaks, it breaks at six instead of a hundred.

### 6.2 The class treatments

The existing program document says post-Era-I entries get "proportionate passes" with "Land/People compressed." **That instruction is void** — it contradicts the no-compression law. Elam's People act matters *more* than Assyria's, because Elam is a people nobody knows. Replace it with these four:

**INTERLUDES** — the six components unchanged, at full scale. No compression clause.

**GREAT CITIES** — recast:
- *Land* → **the site**: why here — harbour, ford, spring, defensible rock — and how the site itself changed (silting, earthquakes, a river moving, a coastline retreating).
- *People* → the demographic layers across time. A city's population is its cast.
- *Rediscovery* → the excavation history, usually the richest story available and often scandalous.
- *Dwelling-pass* → builders and destroyers rather than kings.
- *Lived Day* → a street-level day at the city's peak. The most natural fit of the entire programme.
- *Witness* → the sack or the abandonment.
- **Plus a seventh act unique to cities — THE AFTERLIFE**: what the ruins became, who lived on them, what the name came to mean. Babylon's entry already models this in its Saddam section.

**FAITHS** — recast:
- *Land/People* → **the world that produced it**: the social and political conditions the faith answered.
- *Rediscovery* → **the textual history**: canon formation, manuscript finds, transmission losses, and the honest state of the founder's historicity.
- *Dwelling-pass* → founders and schism-makers.
- *Lived Day* → **a day of observance** for an ordinary believer. Almost always attested, and the single most concrete thing a faith entry can carry.
- *Witness* → not an ending (living faiths do not end) but ruptures and persecutions at street level.
- **The one-standard doctrine binds hardest here.** Bible, Ramayana, Shahnameh, Greek myth, the Avesta: identical "tradition holds / evidence shows" framing, identical badges, no tradition exempted and none singled out.

**EPICS, MYTHS & HEROES** — "the poetry and the spade" is already the Rediscovery analogue and Gilgamesh models it well. Add:
- **A transmission act** — how the text survived, who copied it, what was lost, the manuscript tradition and the major editions.
- **A reception act** — what each age made of it.
- *Lived Day* analogue → **the performance context**: where this was actually recited, to whom, at what occasion, by whom.
- For hero-cycles (the Greek Heroes, Arthur), an explicit layer separating any possible historical kernel from accretion.

### 6.3 The Cities shelf — expansion and ownership protocol

**The finding.** The current shelf — Babylon, Tyre, Carthage, Alexandria, Constantinople, Tenochtitlan, Venice, Jerusalem, Petra, Baghdad — is nine-tenths post-1200 BCE and contains neither Rome nor Athens. The book's deepest era has one city entry. Measured:

- `as-city` **(Ashur): 289 words, two paragraphs** — a thesis, not a city. No description of the place, no temple of Ashur, no walls, no Old Assyrian city from its own side, no Parthian afterlife, no Walter Andrae's excavation, nothing of its modern fate.
- `as-nineveh` **: 773 words, and not about Nineveh.** It is the library and its rediscovery. Sennacherib's Palace Without Rival, the walls and their gates, the Jerwan aqueduct, the canal system, the royal gardens and the Hanging Gardens attribution argument, the Nergal Gate, Jonah, Mosul — essentially none of it.
- `pe-persepolis` **: 350 words.** No Fortification Archive — thirty thousand tablets recording how the empire actually paid and fed people, including women's rations and higher rations for new mothers. No workforce, no Naqsh-e Rustam, no serious treatment of the 330 burning, no Herzfeld and Schmidt, no Takht-e Jamshid in Persian memory.
- `su-tour`: roughly 150–200 words per city.

This is not deferral. There is no entry to defer *to*. It is compression, and the style guide names the failure: *a reader must never mistake a deliberate pointer for thinness.*

**The test for a card** — a principle, so the shelf is not extended by taste:

> **A city earns its own entry when its life spans more than one chapter.** The chapter owns what happened in it during that chapter. The entry owns the place through time.

**Cards to add for Era 0/I** (owner's decision — the shelf is locked until they say otherwise): **Uruk** (alive c. 4000 BCE – c. 300 CE, touching nearly every Era I chapter), **Ur**, **Nineveh**, **Ashur**, **Memphis**, **Thebes**, **Hattusa**, **Mohenjo-daro**, **Knossos**, **Persepolis**, **Jericho**. Athens and Rome follow with Era II.

**Ownership protocol — write this into every city brief BEFORE drafting, never audit it afterwards.** D1 is what happens otherwise:
1. Name the owning entry for every shared episode, in the brief, before a word is written.
2. The non-owner gets **at most two sentences plus a live `data-goto`**, and the deferral is **visible in the prose** — never only in the Connected panel.
3. When a city entry is written, sweep the codex and convert every compressed passage about it into a visible deferral plus a link. Then sweep for `.pl` placeholders naming it and upgrade them.
4. Links are bidirectional. An unlinked related entry is a defect.

### 6.4 Existing cluster entries — all seven need the treatment

Elam, Gilgamesh, the Iliad, the Egyptian Pantheon, Babylon, Alexandria, Zoroastrianism. None was touched by the Era I retrofit; none carries a Lived Day; none has a Land/site or People act. Each gets one cycle under its class treatment, and each gets a target list and a hunt first.

### 6.5 Phase 3 acceptance

Per entry: validator green · byte-identical assembly · class treatment complete or the evidence-limit reported · ownership boundary stated in the brief and honoured in the text · codex-wide sweep done and `.pl` placeholders upgraded · links bidirectional · absence hunt attached.

---

## 7. Per-cycle protocol

1. **Intake** — mount the master folder from the repo, never a remembered copy. Run `validate_codex.py <master-dir>`. Declare your model.
2. **Brief** — no chapter is written without one carrying named dwelling-targets. Build the target list, run the hunt, and the output is the brief.
3. **Research** — Gate 1 on every load-bearing claim. Collect URLs as you go.
4. **Write** — into `content/<chunk>.html`. Full depth, no compression, no invention.
5. **Ledger** — claims checked, corrected, cut, and reported-unsubstantiated.
6. **Inject** — views and titles registered, card flipped, teasers rewired, Connected panels and world-view links upgraded, `.pl` sweep done.
7. **Validate** — folder green, then `assemble.py`, then confirm the single file matches.
8. **Referee** — audit on the standard rubric, patch within authority, ship, and **produce the next cycle's brief**.

---

## 8. Escalate — never decide in the executing chat

Timeline lane placement · the maps doctrine (owner has deferred it; colour fix only) · shelf additions and reorganisations including the Cities expansion in Phase 3 (§6.3) · renumbering policy · any conflict between this document and the skill · any brief target that research contradicts rather than merely fails to confirm · anything ambiguous.

**Flag, don't guess. The file is the only referee — verify before accusing anyone, including a previous session and including this document.**

---

## 9. COMPATIBILITY WITH THE MOUNTED SKILLS

The executing chat runs `chronicle-writer` and `chronicle-referee` as mounted. These are the points where this work order and those skills do not currently fit. **Each must be resolved by the owner before the phase that hits it — none can be resolved inside the executing chat.**

### 9.1 BLOCKING — `renumber.py` is not idempotent

Tested against this master. The script reports correct numbering and changes no `rn` labels, but **injects ~51 blank lines into `shell.html` on every run.** Two consecutive runs took the blank-line count in the affected region from 66 to 130 — and the 66 indicates it has already been run at least once on the current master, leaving residue. **The validator passes throughout**, so no existing gate catches it.

The referee skill instructs a `renumber.py` run after *any* card change. This work order changes cards in every phase. Left unfixed, the shell accumulates junk every cycle.

**Resolution:** fix the script before Phase 1. Until then, every run is followed by a mandatory `diff` of `shell.html`, and any pure-whitespace insertion is reverted by hand. Consider a validator check for runaway blank-line blocks — this is a recurring defect class and belongs mechanised.

### 9.2 BLOCKING — the shelf lock

`chronicle-writer/SKILL.md`: *"The shelf is locked. Do NOT add new shelves, eras, or cards unless the user explicitly asks."*

Phase 1 adds two Era 0 cards and renumbers the existing two. Phase 3 (§6.3) proposes eleven Cities cards. A correctly-behaving executing chat **will flag and stop at intake.** That is the desired behaviour.

**Resolution:** the owner grants explicit, itemised authorisation in the launch prompt — naming the specific cards — or the phase does not open. Blanket permission is not appropriate here; the Cities expansion is a separate decision from the Era 0 bookends.

### 9.3 The writer skill's cluster queue is stale

`SKILL.md` §"Writing priority: complete the cluster first" lists a queue of seven entries — Gilgamesh, Babylon, Elam, the Egyptian Pantheon, Alexandria, Zoroastrianism, the Iliad. **All seven are written.** A fresh chat reading the skill at intake will be directed to write entries that already exist.

**Resolution:** update that section to point at this work order's phase sequence. Until it is updated, the executing chat must be told at launch to disregard it.

### 9.4 Model routing does not cover the new Era 0 chapters

The skill reserves Opus for Rome, Greece & Alexander, the World Wars, the Cold War and the Colonial Empires. **0·1 The Long Dawn** is not on that list and therefore routes to Sonnet by default — but it carries human origins, ancient DNA, contested and fast-moving dating, and the highest honeypot surface in Phase 1. **0·4 Metal, Gold, and the Plough** carries the Indo-European/steppe-ancestry debate, which is live and politically freighted.

**Resolution:** the owner rules explicitly at launch rather than letting the default decide. The skill's INTAKE RULE requires the writer to flag routing mismatches; a pre-emptive ruling avoids a stalled session.

### 9.5 Where the depth instrument lives

`absence_hunt.py` **ships inside `chronicle-writer/scripts/`** — it is stable law and belongs in the skill.

`absence-targets.json` **travels with the MASTER**, at the top level beside `shell.html` and `content/`. It is not in the skill and must not be put there: it grows every cycle as chapters are hunted, and a living file buried in a skill zip guarantees stale mounted copies — the exact shape of issue #3.

Invocation: `python <skill>/scripts/absence_hunt.py <master-dir> <master-dir>/absence-targets.json [view]`

**Every cycle that hunts a chapter extends the file in the same cycle and commits it with the master.** It currently holds two chapters — `babylonia` and `caral`. Nine Era I chapters, both existing Era 0 chapters, the two new Era 0 chapters, and every cluster entry still need lists built. The file only becomes valuable if it is maintained; a cycle that hunts a chapter and does not write its list back has thrown the work away.

### 9.6 Relationship to `RETROFIT-PROGRAM.md`

The referee skill names `RETROFIT-PROGRAM.md` as the standing queue, so both documents will be in the room.

**This work order supersedes exactly one part of it: the "After Era I" paragraph**, which instructs that Interlude/City/Faith/Epic entries receive "proportionate passes" with "Land/People compressed." That instruction contradicts the no-compression law and is void; §6.2 replaces it.

**The rest of `RETROFIT-PROGRAM.md` stands** — with two corrections already established:
- Its Rediscovery target lists name items that are *already present* in several chapters (Persia's Behistun and Rawlinson; the Minoans' Evans, Schliemann, Ventris and Kober). Briefs must distinguish **ABSENT** (write new) from **THIN** (expand in place) or the cycle produces duplication.
- Its assignment of Koldewey's excavation to I·3 Babylonia is an ownership collision with the written Babylon C·I entry. That collision has already occurred and is defect **D1**.

### 9.7 Minor — internal inconsistency in the writer skill

Phase 1 of the skill's workflow still reads *"The user uploads their current `chronicle.html`"*, while the later section establishes that the master is a folder and `chronicle.html` is a build output. Harmless in practice, but it should be reconciled at the next repack.

### 9.8 Before any ship step

The referee's `secrets.env` is reset to a placeholder on every repack. **Verify the token is present before the first cycle that ends in a Git push** — the ship script reports unconfigured secrets rather than failing silently, but a cycle that ends in a folder zip instead of a commit wastes the handoff. Do not read, print, or quote the file's contents to check it.


===== LAUNCH NOTES — STANDING OWNER RULINGS =====

# LAUNCH NOTES — standing owner rulings (work order §9, operationalized)

These resolve the known conflicts between the mounted skills and the work
order. They are owner rulings relayed by the pipeline; do not re-litigate.

1. **Disregard the writer skill's "cluster queue"** (§9.3): all seven entries
   it lists are written. The work order's phase sequence governs; the current
   brief tells you exactly what this cycle does.
2. **The master is the folder in this repo** (§9.7): `master/shell.html` +
   `master/content/*.html`. `chronicle.html` is a build output, never an input.
3. **Shelf lock stands** (§9.2): no cards, shelves, or renumbering unless the
   brief itemizes explicit owner authorization. Anything needing them → the
   verdict's ESCALATIONS section, and the cycle halts.
4. **Model routing** (§9.4): the brief's `model:` field IS the owner's ruling
   for this cycle. If you believe the routing is wrong, say so in your notes —
   do not stall.
5. **Targets file maintenance** (§9.5): a cycle that hunts a chapter writes its
   target list back into `master/absence-targets.json` in the same cycle —
   include that update as a fragment-free file edit request in your notes for
   the referee, who patches it. A hunted chapter with no list written back has
   thrown the work away.
6. **Phase state as of this repo's history**: Phase 1 (Era 0) is SHIPPED
   (0·1–0·4 live). Phase 2 (Era I) is in progress: Babylonia and the Assyria
   structural retrofit are QA-accepted; the owner's sequence is Assyria
   completion → Caral completion (briefs/queue/caral.md) → onward per §5.3,
   then Era 2 opens on the owner's word. Phase 3 (clusters/Cities) is NOT
   authorized.


===== BRIEF =====

slug: assyria
chunk: era-1
phase: 2
model: sonnet
status: ready
new-chapter: no
shell-work: no
---
# CYCLE BRIEF — I·4 ASSYRIA (retrofit completion: name-drop upgrades)

Owner-sequenced 2026-07: Assyria completion first, then the queued Caral brief
(briefs/queue/caral.md — its 2 ABSENT / 3 NAME-DROP re-verified still open),
then Era 2 opens. Surface that sequence choice to the owner in your verdict's
NEXT BRIEF section.

## State (hunt against the 60-target list in master/absence-targets.json)
**0 ABSENT · 14 NAME-DROP · 46 COVERED.** The prior retrofit (QA-accepted,
"Land/People/How-We-Know acts added, 16 absences closed") did the structural
work. This cycle upgrades the name-drops that are load-bearing history.

## NAME-DROP (14) — read the surrounding context FIRST; upgrade what is
## significant, defend-in-notes what is legitimately a passing mention
- LAND: rain-fed north vs irrigated south (the dry-farming line) — likely
  belongs treated inside the Land act, not mentioned in passing.
- LAND: no natural frontiers — the vulnerability thesis (the standing
  explanation for Assyrian militarism; deserves real treatment).
- women's letters from Ashur — merchant wives running the firm (the karum
  trade's human texture; strong candidate for expansion).
- Ashur-uballit I and the Amarna correspondence (Assyria's entry onto the
  great-power stage — currently one clause).
- Tiglath-Pileser I (the bridge between Middle and Neo-Assyrian power).
- surviving the Bronze Age collapse (Assyria as the continuity state — a
  thesis-level point for this book).
- the Nimrud banquet stele — 69,574 guests (one vivid attested scene).
- Sargon II killed in battle, body never recovered — a theological crisis
  (the Sin of Sargon text; consequential for Sennacherib's reign).
- the substitute king ritual (šar pūhi — one of the most striking attested
  institutions; currently one mention).
- the lion hunt reliefs (Ashurbanipal's — the empire's self-image in stone).
- Shamash-shum-ukin's revolt, 652–648 (the brothers' war that broke the
  empire's back; must be treated, not named).
- Arbela and the Ishtar oracles (prophecy addressed to Esarhaddon —
  attested voice material).
- 'Nineveh and Its Remains' as a Victorian bestseller (the rediscovery act
  likely owns this; verify context before expanding).
- Scythians and Cimmerians (the steppe pressure in the fall — verify the
  fall act treats the coalition fully).

## Rules
- Fragments only, per the OUTPUT CONTRACT. Expand IN PLACE inside the acts
  that own each topic; new sections only where no act owns the material.
- Every expansion carries citations (append-refs, last-ref+1 numbering).
- Badge disputed claims per the trust doctrine; dramatized scenes carry
  provenance notes (G6 enforces scene/prov parity).
- Flag list (escalate, do not do): shelf cards, renumbering, timeline
  bars/lanes, maps beyond colour, anything the work order reserves.


===== UNIFIED DIFF OF THE CYCLE BRANCH =====

diff --git a/master/content/era-1.html b/master/content/era-1.html
index befacbd..c8c6d9b 100644
--- a/master/content/era-1.html
+++ b/master/content/era-1.html
@@ -2645,9 +2645,12 @@
       <section id="as-middle">
         <div class="eyebrow">The First Rise</div>
         <h2>The First Empire and the Long Night</h2>
-        <p>Assyria's chance came when Mitanni was broken — crushed between the Hittites pressing from the west and the Assyrians rising from the east. Around 1363 BCE a king named <strong>Ashur-uballit I</strong> threw off Mitanni's overlordship and made Assyria a genuine power, corresponding as an equal with the pharaohs of Egypt.<sup class="cite"><a href="#as-r5">[5]</a></sup> This was the beginning of the <strong>Middle Assyrian</strong> empire, Assyria's first age of conquest. The period’s law tablets are among the harshest known from Mesopotamia — mutilation and death sentences fall heavily, above all on women — and they contain history’s first known veiling statute: respectable married women <em>must</em> veil in public, while enslaved women and prostitutes are <em>forbidden</em> to, on pain of savage punishment — the veil born not as modesty but as a badge of rank.<sup class="cite"><a href="#as-r20">[20]</a></sup></p>
+        <p>Assyria's chance came when Mitanni was broken — crushed between the Hittites pressing from the west and the Assyrians rising from the east. Around 1363 BCE a king named <strong>Ashur-uballit I</strong> threw off Mitanni's overlordship and made Assyria a genuine power, corresponding as an equal with the pharaohs of Egypt.<sup class="cite"><a href="#as-r5">[5]</a></sup>
+ Two of his letters survive in the diplomatic archive found at Akhetaten, Akhenaten's short-lived capital — the earliest surviving contact between Assyria and Egypt, and among the oldest surviving Assyrian voices in the historical record at all. Ashur-uballit sent two chariots, two horses, and a ring of lapis lazuli as gifts, and asked bluntly for gold in return, telling the pharaoh that gold was, in Egypt, as plentiful as dust.<sup class="cite"><a href="#as-r31">[31]</a></sup> The approach scandalised Assyria's former masters: Babylon's king Burnaburiash II wrote to Akhenaten in protest, insisting that Assyria, as his own vassal, had no business negotiating with Egypt at all — a complaint Egypt evidently ignored, since the Assyrian correspondence continued.<sup class="cite"><a href="#as-r31">[31]</a></sup> This was the beginning of the <strong>Middle Assyrian</strong> empire, Assyria's first age of conquest. The period’s law tablets are among the harshest known from Mesopotamia — mutilation and death sentences fall heavily, above all on women — and they contain history’s first known veiling statute: respectable married women <em>must</em> veil in public, while enslaved women and prostitutes are <em>forbidden</em> to, on pain of savage punishment — the veil born not as modesty but as a badge of rank.<sup class="cite"><a href="#as-r20">[20]</a></sup></p>
         <p>Its most formidable king was <strong>Tukulti-Ninurta I</strong>, who around 1225 BCE did the almost unthinkable: he defeated and briefly conquered <strong>Babylon</strong> itself, dragging its king back to Ashur in chains and carrying off the sacred statue of the god Marduk.<sup class="cite"><a href="#as-r5">[5]</a></sup> It was the first time Assyria humbled the ancient, prestigious south — and it would not be the last. But Tukulti-Ninurta, like so many Assyrian kings after him, was murdered by his own sons, and his gains slipped away.</p>
-        <p>Then came the catastrophe that ended the Bronze Age. Around 1200 BCE the interconnected world of empires — Hittites, Mycenaeans, the great trading cities — collapsed together, as we saw in the last chapter. Assyria, inland and self-reliant, survived the storm better than most, but it was battered by it, and by waves of <strong>Aramean</strong> nomads pushing into its lands. For roughly two centuries after the reign of the powerful <strong>Tiglath-Pileser I</strong> (who around 1100 BCE had campaigned as far as the Mediterranean), Assyria shrank back toward its heartland, weak and besieged.<sup class="cite"><a href="#as-r5">[5]</a></sup> The city of Ashur endured; the empire slept. When it woke, in the ninth century BCE, it would wake transformed — and the Iron Age would be its own.</p>
+        <p>Then came the catastrophe that ended the Bronze Age. Around 1200 BCE the interconnected world of empires — Hittites, Mycenaeans, the great trading cities — collapsed together, as we saw in the last chapter. Assyria, inland and self-reliant, survived the storm better than most, but it was battered by it, and by waves of <strong>Aramean</strong> nomads pushing into its lands.
+ Modern historians treat this survival as more than luck: unlike the palace economies of the Aegean and the Levantine coast, Assyria's inland, agrarian heartland was not dependent on the long-distance maritime trade networks whose collapse crippled its neighbours, and its monarchy, army, and provincial administration stayed intact through the crisis rather than disintegrating with it — making Assyria, alone among the great Late Bronze Age powers, something close to a continuity state, carrying its institutions across the collapse rather than rebuilding them from zero on the far side of it <span class="badge b-inf">inferred; a structural explanation historians offer for an outcome the surviving texts themselves do not explain</span>.<sup class="cite"><a href="#as-r33">[33]</a></sup> For roughly two centuries after the reign of the powerful <strong>Tiglath-Pileser I</strong> (who around 1100 BCE had campaigned as far as the Mediterranean), Assyria shrank back toward its heartland, weak and besieged.<sup class="cite"><a href="#as-r5">[5]</a></sup>
+ Tiglath-Pileser's own annals, inscribed on clay prisms built into the corner of the ziggurat at Ashur, describe him sailing the Mediterranean from the Phoenician port of Arvad, felling cedar and boxwood in the mountains of Lebanon to replant in Assyrian gardens, and — a king's boast rather than an audited tally — killing 920 lions over the course of his reign, on foot and from his chariot <span class="badge b-leg">royal-boast figure, not an independently verified count</span>. He stands, in retrospect, as the last king of real Middle Assyrian power and the bridge whose campaigns the Neo-Assyrian kings after him would claim only to be resuming.<sup class="cite"><a href="#as-r32">[32]</a></sup> The city of Ashur endured; the empire slept. When it woke, in the ninth century BCE, it would wake transformed — and the Iron Age would be its own.</p>
       </section>
 
       <section id="as-machine">
@@ -2655,6 +2658,7 @@
         <h2>The War Machine</h2>
         <p class="lead">What Assyria built in the ninth and eighth centuries BCE was something new in history: not just a strong army, but a <strong>system</strong> — the ancient world's first true military-industrial state, engineered from top to bottom for conquest.</p>
         <p>The kings of the revived empire — beginning with <strong>Ashurnasirpal II</strong> (r. 883–859 BCE) and his son <strong>Shalmaneser III</strong> — turned the annual campaign into a way of life.<sup class="cite"><a href="#as-r6">[6]</a></sup> Each year, as regularly as the harvest, the army marched out to a chosen enemy, defeated it, plundered it, and returned laden with treasure and captives. Ashurnasirpal built a vast new capital at <strong>Kalhu</strong> (biblical Calah, modern Nimrud) and lined its palace with carved stone reliefs — the first of the great Assyrian palace sculptures — and celebrated its opening, his inscriptions claim, with a feast for nearly seventy thousand guests: a precise-sounding figure of <strong>69,574</strong> that comes from the king's own dedication inscription and should be read as a royal boast advertising abundance and reach, not audited as a real headcount <span class="badge b-leg">royal-boast figure; a claim of the inscription, not an independently verified fact</span>.<sup class="cite"><a href="#as-r6">[6]</a></sup> His son <strong>Shalmaneser III</strong> extended the reach further still: in 853 BCE, at the <strong>Battle of Qarqar</strong> in Syria, his annals record a coalition of twelve western kings assembled to stop him, including Ben-Hadad II of Damascus and — in the first contemporary written record naming any king of Israel or Judah — <strong>Ahab of Israel</strong>, who is said to have fielded two thousand chariots.<sup class="cite"><a href="#as-r19">[19]</a></sup> Shalmaneser's own inscriptions claim total victory; that the coalition held the Assyrians off the region for years afterward suggests the battle was, at best, inconclusive <span class="badge b-inf">the Assyrian claim of victory is disputed by the campaign's actual aftermath</span>. Shalmaneser III left one further, still more striking object of the age: the <strong>Black Obelisk</strong>, found at Kalhu in 1846 and now in the British Museum, whose second register shows a king named <strong>Jehu of the house of Omri</strong> — king of Israel — on his hands and knees, forehead to the ground, delivering tribute. It is the only contemporary image of any king of Israel or Judah that exists anywhere.<sup class="cite"><a href="#as-r19">[19]</a></sup></p>
+<p>The banquet stele itself, found still standing near the palace entrance at Nimrud, spells out what "nearly seventy thousand guests" actually meant to put on the table: the king's own inscription lists 1,000 fattened cattle, 1,000 calves, 10,000 sheep from the royal stables, 15,000 lambs, 500 stags, 500 gazelles, 1,000 ducks, 500 geese, 10,000 doves, 10,000 fish, 10,000 jerboa (a desert rodent eaten as a delicacy), 10,000 eggs, and more than 10,000 measures each of beer and wine, alongside breads, vegetables, fruit, and spices, all consumed over ten days of feasting <span class="badge b-leg">figures come from the king's own commemorative inscription and read as ceremonial abundance, not an audited supply record</span>.<sup class="cite"><a href="#as-r34">[34]</a></sup> Whatever the true headcount, the stele's real message was administrative as much as festive: only a state that could marshal herds, granaries, and vineyards on this scale, and move them all to one place at one time, could credibly claim to rule the region at all.</p>
         <p>The army that did this work was the most advanced of its age. The Assyrians fielded massed <strong>iron weapons</strong> as iron replaced bronze across the region, and combined several arms into one machine: heavy and light infantry, archers, cavalry that could operate where chariots could not, and above all a genius for <strong>siege warfare</strong>.<sup class="cite"><a href="#as-r7">[7]</a></sup> Where earlier armies could only surround a walled city and wait, the Assyrians built siege ramps, wheeled battering rams sheathed against fire, and towers, and stormed the walls directly. Their reliefs show it all in step-by-step detail — the ramp, the ram, the ladders, the defenders falling — carved with an engineer's precision. A walled city, which for millennia had meant safety, now meant a target.</p>
         <p>They were also masters of what a later age would call logistics and administration. The empire was knit together by a network of <strong>royal roads</strong> and a relay system of messengers and waystations that could carry news and orders across vast distances at remarkable speed — a system the Persians would later inherit and make famous.<sup class="cite"><a href="#as-r7">[7]</a></sup> Provinces were governed by appointed officials, spies and informers reported to the king, and a stream of written intelligence flowed back to the capital. It was, for its day, a terrifyingly modern apparatus of power.</p>
         <p>All of it ran on a calendar that was itself distinctively Assyrian. Rather than numbering years from a king's accession, as Babylon and Egypt did, Assyria named each year after a senior official, the <strong><span class="hint" data-hint="Akkadian: the official after whom a given year was named. Every year for roughly a millennium has a limmu attached to it, letting modern historians build an unbroken chronology.">limmu</span></strong> or eponym, who held the post for that year alone; the resulting list of limmu-years, unbroken for centuries and cross-checked against a solar eclipse its own scribes recorded — modern astronomy has confirmed it fell on 15 June, 763 BCE — gives historians one of the most precisely anchored chronologies anywhere in the ancient world, a year-by-year backbone against which the rest of Near Eastern history is still dated today.<sup class="cite"><a href="#as-r23">[23]</a></sup></p>
@@ -2686,6 +2690,7 @@
         <h2>The Sargonid Century</h2>
         <p>The last and greatest Assyrian dynasty, the <strong>Sargonids</strong>, drove the empire to a size the world had never seen — and their story is a study in how the machine's very success sowed its ruin. Four kings carry it.</p>
         <p><strong>Sargon II</strong> (r. 722–705 BCE), who took the old imperial name of Sargon of Akkad, completed the conquest of the northern kingdom of <strong>Israel</strong>: the capital <strong>Samaria</strong> fell after a long siege, and its people were deported — an inscription claims 27,290 captives carried off, a figure precise enough to feel like a real tax record, and a conquest this Chronicle's account of <a data-goto="israel-judah" href="#">Israel &amp; Judah (II·2)</a> follows from the losing side.<sup class="cite"><a href="#as-r10">[10]</a></sup> Sargon built himself an entirely new capital from nothing, <strong>Dur-Sharrukin</strong> ("Fortress of Sargon," modern Khorsabad), guarded by the colossal human-headed winged bulls, the <span class="hint" data-hint="Colossal Assyrian guardian figures with a human head, the body of a bull or lion, and eagle's wings, set at palace and city gates to ward off evil.">lamassu</span>, that are among the most recognisable images of Mesopotamia.<sup class="cite"><a href="#as-r10">[10]</a></sup> Then, campaigning against a nomadic people from the Anatolian highlands, he died in battle on a distant frontier and his body was never recovered for proper burial — a fate Assyrian royal theology treated as close to a catastrophe, since a king denied burial rites was read as a king the gods themselves had rejected, and his own son and successor is known to have anxiously interrogated the omens for what unnamed sin his father might have committed to deserve it <span class="badge b-inf">the death and lost body are attested; the theological reading of it as divine punishment is the Assyrians' own inference, recorded after the fact, not a neutral modern judgement</span>.<sup class="cite"><a href="#as-r10">[10]</a></sup></p>
+<p>The year was 705 BCE, and the enemy who killed him is named in the sources as Gurdî, a rebel of the Anatolian hill-country of Tabal; the Assyrian camp was overrun and the king's body left on the field.<sup class="cite"><a href="#as-r39">[39]</a></sup> Sennacherib's scribes preserve the anxious aftermath directly, in a composition modern Assyriologists call the "Sin of Sargon": a text in which the new king questions why his father should have suffered such a fate and sets diviners searching for the offence, real or ritual, that provoked it. Whatever answer the diviners returned, Sennacherib's own later inscriptions all but erased his father's name, crediting Sargon's building projects to himself instead — the closest thing this dynasty of warrior-kings left to a son publicly disowning a father <span class="badge b-inf">the near-total omission of Sargon's name from Sennacherib's inscriptions is attested and widely read this way by historians, though Sennacherib never states a reason in his own words</span>.<sup class="cite"><a href="#as-r39">[39]</a></sup></p>
         <p>His son <strong>Sennacherib</strong> (r. 705–681 BCE) abandoned his father's cursed city and made <strong>Nineveh</strong> the capital, rebuilding it into the largest city in the world, with a palace he called "the Palace without Rival" and an ingenious system of canals and aqueducts to water it.<sup class="cite"><a href="#as-r11">[11]</a></sup> In 701 BCE he stormed westward into rebellious Judah, sacking the fortress-city of <strong>Lachish</strong> — a siege he had carved across a whole room of his palace in triumphant detail — and shutting up King <strong>Hezekiah</strong> in <a data-goto="israel-judah" href="#">Jerusalem</a>, in his own boastful words, like a bird in a cage.<sup class="cite"><a href="#as-r11">[11]</a></sup> Historians read the sheer scale of the Lachish room as compensation: Jerusalem, the campaign’s real prize, never fell — Sennacherib’s own annals can claim only that he shut Hezekiah up "like a caged bird" — so the victory he <em>did</em> win was carved wall-to-wall, propaganda filling the space where triumph should have been <span class="badge b-inf">interpretation</span>.<sup class="cite"><a href="#as-r19">[19]</a></sup> Yet Jerusalem, alone among his targets, he did not take: the Assyrian records fall silent on why, and the Bible claims a miraculous deliverance — the same siege this Chronicle's account of <a data-goto="israel-judah" href="#">Israel &amp; Judah (II·2)</a> follows in full from inside the walls. It is one of the great "and yet" moments of ancient history — the caged bird that lived.</p>
         <div class="war">
           <div class="tag">The Unforgivable Act</div>
@@ -2697,8 +2702,20 @@
             <a href="https://en.wikipedia.org/wiki/Sennacherib">Sennacherib</a>
           </div>
         </div>
-        <p>The next king, <strong>Esarhaddon</strong> (r. 681–669 BCE), spent his reign trying to undo his father's sacrilege — he <strong>rebuilt Babylon</strong>, releasing its exiles and restoring its temples, in open atonement.<sup class="cite"><a href="#as-r13">[13]</a></sup> His reign also preserves one of antiquity's most intimate religious archives: oracles from <strong>Ishtar of Arbela</strong>, delivered through named prophetesses, promising the anxious king in the goddess's own voice — <em>fear not</em> — a rare window into a great king ruled by his terrors and his gods.<sup class="cite"><a href="#as-r20">[20]</a></sup> That anxiety was not private eccentricity; it was built into how the Assyrian state itself managed royal risk. When court astrologers forecast a lunar or solar eclipse over Assyria — a portent read as a direct threat to the king's life — the palace could stage the <strong>substitute-king ritual</strong>: a stand-in, sometimes a condemned criminal, sometimes simply an ordinary subject, was formally enthroned in the real king's place, dressed in his robes and addressed by his titles, while the actual king went into hiding under a humbler name for the length of the danger. When the crisis passed, the substitute was killed, the omen was considered discharged onto him, and the real king resumed his throne as though nothing had happened.<sup class="cite"><a href="#as-r21">[21]</a></sup> In 672 BCE, still anxious about the succession, Esarhaddon compelled every vassal ruler of the empire — kings, governors, and tribal chiefs from Media to the Levant — to swear a formal oath, the <strong>Succession Treaty</strong>, promising loyalty to his chosen heir Ashurbanipal on pain of catalogued, escalating curses: exile, famine, cannibalism during siege, a house left desolate. A copy was sent to Judah's own King Manasseh, and a preserved exemplar of the same document, excavated at Tell Tayinat in Turkey, carries curse language striking enough that a number of biblical scholars have proposed it directly influenced the covenant curses of Deuteronomy 28 — a claim other specialists treat with real caution, since resemblance in a widely shared ancient treaty genre does not by itself prove one text copied another <span class="badge b-inf">disputed; direct literary dependence is a minority position among biblical scholars, not a consensus</span>.<sup class="cite"><a href="#as-r22">[22]</a></sup> And he pushed the empire to its greatest extent of all: in 671 BCE he invaded and conquered <strong>Egypt</strong> itself, taking the ancient capital Memphis and making the Assyrian empire, for a few years, the largest the world had ever seen — from the Nile to the mountains of Iran.<sup class="cite"><a href="#as-r13">[13]</a></sup> No power had ever ruled both Mesopotamia and Egypt together. Esarhaddon died on the road to Egypt to put down yet another revolt — the empire so vast it could no longer be held still.</p>
+        <p>The next king, <strong>Esarhaddon</strong> (r. 681–669 BCE), spent his reign trying to undo his father's sacrilege — he <strong>rebuilt Babylon</strong>, releasing its exiles and restoring its temples, in open atonement.<sup class="cite"><a href="#as-r13">[13]</a></sup> His reign also preserves one of antiquity's most intimate religious archives: oracles from <strong>Ishtar of Arbela</strong>, delivered through named prophetesses, promising the anxious king in the goddess's own voice — <em>fear not</em> — a rare window into a great king ruled by his terrors and his gods.<sup class="cite"><a href="#as-r20">[20]</a></sup>
+ One such oracle is attributed by name to a prophetess of Arbela called Sinqisha-amur, who delivers the goddess's promise in the first person: <em>King of Assyria, have no fear — I am Ishtar of Arbela.</em> Most of the identifiable prophets in this archive, unusually for any position of religious authority anywhere in the ancient Near East, were women.<sup class="cite"><a href="#as-r37">[37]</a></sup> That anxiety was not private eccentricity; it was built into how the Assyrian state itself managed royal risk. When court astrologers forecast a lunar or solar eclipse over Assyria — a portent read as a direct threat to the king's life — the palace could stage the <strong>substitute-king ritual</strong>: a stand-in, sometimes a condemned criminal, sometimes simply an ordinary subject, was formally enthroned in the real king's place, dressed in his robes and addressed by his titles, while the actual king went into hiding under a humbler name for the length of the danger. When the crisis passed, the substitute was killed, the omen was considered discharged onto him, and the real king resumed his throne as though nothing had happened.<sup class="cite"><a href="#as-r21">[21]</a></sup>
+ The ritual was not merely theoretical. Letters from Esarhaddon's court name a real substitute, Damqi, son of a Babylonian official, enthroned together with a woman recorded as his queen during one such eclipse crisis, and record his death and burial with full royal rites once the danger had passed — the clearest surviving case of the rite actually being carried through to its grim end.<sup class="cite"><a href="#as-r38">[38]</a></sup> In 672 BCE, still anxious about the succession, Esarhaddon compelled every vassal ruler of the empire — kings, governors, and tribal chiefs from Media to the Levant — to swear a formal oath, the <strong>Succession Treaty</strong>, promising loyalty to his chosen heir Ashurbanipal on pain of catalogued, escalating curses: exile, famine, cannibalism during siege, a house left desolate. A copy was sent to Judah's own King Manasseh, and a preserved exemplar of the same document, excavated at Tell Tayinat in Turkey, carries curse language striking enough that a number of biblical scholars have proposed it directly influenced the covenant curses of Deuteronomy 28 — a claim other specialists treat with real caution, since resemblance in a widely shared ancient treaty genre does not by itself prove one text copied another <span class="badge b-inf">disputed; direct literary dependence is a minority position among biblical scholars, not a consensus</span>.<sup class="cite"><a href="#as-r22">[22]</a></sup> And he pushed the empire to its greatest extent of all: in 671 BCE he invaded and conquered <strong>Egypt</strong> itself, taking the ancient capital Memphis and making the Assyrian empire, for a few years, the largest the world had ever seen — from the Nile to the mountains of Iran.<sup class="cite"><a href="#as-r13">[13]</a></sup> No power had ever ruled both Mesopotamia and Egypt together. Esarhaddon died on the road to Egypt to put down yet another revolt — the empire so vast it could no longer be held still.</p>
         <p>His son <strong>Ashurbanipal</strong> (r. 669–631 BCE), the last great king, held the summit and presided over its splendour. His armies crushed a final Egyptian revolt and sacked the southern Egyptian capital of <strong>Thebes</strong> in 663 BCE, carrying off staggering plunder — a blow so shocking that the Hebrew prophet Nahum would later cite fallen Thebes as the warning of what awaited Nineveh itself.<sup class="cite"><a href="#as-r14">[14]</a></sup> But Ashurbanipal's most terrible war was against his own brother, <strong>Shamash-shum-ukin</strong>, whom Esarhaddon had made king of Babylon under Assyrian oversight: a devastating civil war, beginning in 652 BCE, that ended in 648 with Babylon starved into submission and Shamash-shum-ukin dead, by most accounts, in his own burning palace — told in fuller, harder detail from Babylon's own side in this Chronicle's <a data-goto="babylonia" href="#">Babylonia (I·3)</a>.<sup class="cite"><a href="#as-r14">[14]</a></sup> Even as its kings fought their own kin, the empire faced pressure from outside its borders that no annexation could absorb: <strong>Cimmerian</strong> raiders swept out of the Caucasus and across Anatolia through much of the seventh century, killing at least one Assyrian client king in the process, while the <strong>Scythians</strong>, a related horse-people from the steppe further north, alternated between raiding the empire's frontiers and, for a time under Ashurbanipal, fighting as its paid allies against the Medes — nomadic powers Assyria's own annals could intimidate, buy off, or occasionally befriend, but never permanently absorb the way it absorbed a walled city.<sup class="cite"><a href="#as-r14">[14]</a></sup> The empire had reached everywhere and beaten everyone it could conquer with siege engines. It had also exhausted itself doing so.</p>
+<div class="war">
+  <div class="tag">The Brothers' War</div>
+  <h4>Ashurbanipal versus Shamash-shum-ukin — 652-648 BCE</h4>
+  <div class="meta">652-648 BCE · Babylon and southern Mesopotamia · <span class="badge b-att">attested</span></div>
+  <p>Two sons of Esarhaddon had been divided at their father's death between the greater throne and the lesser: Ashurbanipal in Nineveh as king of Assyria, his elder brother Shamash-shum-ukin in Babylon, nominally a king but in practice supervised in every major decision by Assyrian officials answering to Nineveh.<sup class="cite"><a href="#as-r36">[36]</a></sup> Assyrian sources give no confession of Ashurbanipal's own overreach; modern historians read the revolt that followed as the predictable result of a decade spent treating a king as a subordinate governor, in a city that still remembered being sovereign. Shamash-shum-ukin built a wide coalition against his brother — Elam, Aramean and Chaldean tribes, Arab allies, and, in Assyrian claims, secret contact with Egypt — before declaring against Assyria openly at the end of 652 BCE.<sup class="cite"><a href="#as-r36">[36]</a></sup> Ashurbanipal's armies isolated Babylon and the other rebel cities and settled into a siege that dragged on for roughly two years; famine inside the walls grew severe enough that Ashurbanipal's own inscriptions claim survivors were driven to eating their own children before the end <span class="badge b-leg">a royal atrocity-of-the-enemy claim, drawn from the victor's own propaganda and not independently corroborated</span>.<sup class="cite"><a href="#as-r36">[36]</a></sup> Babylon fell in the summer of 648 BCE; Shamash-shum-ukin died, by the most widely followed account, in the flames of his own burning palace rather than surrender to his brother. Ashurbanipal purged the rebel cities afterward and installed a more tightly supervised client king in Babylon — a victory, but one that had cost his army two years of strength at the exact moment Cimmerian and Scythian pressure was building on Assyria's other frontiers, and that left Babylon's south nursing a grievance the Chaldean general Nabopolassar would collect on within a generation. The siege's full toll and Babylon's own memory of it are told from the city's own side in this Chronicle's <a data-goto="babylonia" href="#">Babylonia (I·3)</a>.</p>
+  <div class="sources">
+    <a href="https://en.wikipedia.org/wiki/Shamash-shum-ukin">Shamash-shum-ukin</a>
+    <a href="https://www.britannica.com/place/Mesopotamia-historical-region-Asia/Ashurbanipal-668-627-and-Shamash-shum-ukin-668-648">Ashurbanipal &amp; Shamash-shum-ukin (Britannica)</a>
+  </div>
+</div>
       </section>
 
       <section id="as-terror">
@@ -2714,6 +2731,7 @@
         <h2>Nineveh and the Library of the World</h2>
         <p>And yet the same king whose reliefs show him slaughtering enemies gave the world one of its greatest gifts. Ashurbanipal was, unusually for an Assyrian king, <strong>literate</strong> — he boasted of being able to read the difficult old scripts — and he set out to gather into his palace at Nineveh a copy of all the knowledge of Mesopotamia.<sup class="cite"><a href="#as-r16">[16]</a></sup> His agents combed the temples and archives of the whole land, especially Babylonia, copying and collecting; the result, the <strong>Library of Ashurbanipal</strong>, held tens of thousands of clay tablets — omens, medicine, mathematics, astronomy, dictionaries, rituals, myths, and literature.<sup class="cite"><a href="#as-r16">[16]</a></sup></p>
         <p>When Nineveh burned in 612 BCE, the fire that destroyed the empire <strong>saved the library</strong>: it baked the clay tablets hard and buried them under the palace rubble for twenty-five centuries — and Assyria itself vanished so completely from memory that when a Greek army under Xenophon marched directly past the ruined mounds in 401 BCE, only two centuries after the fall, his soldiers had no idea a city, let alone the greatest empire of its age, had ever stood there.<sup class="cite"><a href="#as-r18">[18]</a></sup> How that buried library, and the empire above it, was finally read back out of the ground is a story this chapter tells in full in its own right, below.</p>
+<p>The same king cultivated a second, very different self-image in stone. In the last years of his reign, Ashurbanipal's craftsmen carved a sequence of reliefs for the North Palace at Nineveh — now among the most admired works of Assyrian art anywhere, held today in the British Museum — showing the king hunting lions in a walled arena, captive animals released from cages for him to kill with arrow, spear, and sword before a watching court, a formalised ritual rather than a wild hunt, and one restricted to the king alone as a demonstration of his fitness to rule and to protect his people from the natural world's dangers.<sup class="cite"><a href="#as-r35">[35]</a></sup> Their most celebrated single panel, known today as the Dying Lioness, shows a lioness struck by three arrows, her hindquarters already paralysed, dragging herself forward and roaring in what modern viewers and art historians alike have read as an image of unmistakable, almost unbearable, physical agony — carved, this chapter's account of terror as policy has already shown, by the same royal workshops that carved captives being flayed and impaled, in the same conviction that both kinds of scene proclaimed the same truth about the king who commissioned them.<sup class="cite"><a href="#as-r35">[35]</a></sup></p>
         <figure class="map-fig">
           <svg viewBox="0 0 700 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Map of the Neo-Assyrian Empire at its height, showing the capital cities of Ashur, Kalhu, Dur-Sharrukin and Nineveh and the reach from Egypt to Iran.">
             <rect x="0" y="0" width="700" height="430" fill="#e8dcc0"/>
@@ -2789,7 +2807,8 @@
         <h2>The Fall</h2>
         <p class="lead">The most astonishing thing about the Assyrian Empire is not how great it grew but how fast it vanished. At Ashurbanipal's death around 631 BCE it was the unrivalled superpower of the world. Within about twenty years it had ceased to exist. Few great powers in history have fallen so suddenly and so completely.<sup class="cite"><a href="#as-r17">[17]</a></sup></p>
         <p>Several failures converged. First, <strong>overextension</strong>: the empire had grown too big for its own machinery, its armies stretched across a realm from the Nile to Iran, forever marching to put down the next revolt. Second, <strong>the cost of terror</strong>: an empire ruled by fear has no loyal subjects, only frightened ones, and the moment it looked weak, its hatred came due all at once. Third, <strong>civil war</strong>: after Ashurbanipal's death his heirs fought each other for the throne, and the machine that had beaten the world turned inward and tore itself apart.<sup class="cite"><a href="#as-r17">[17]</a></sup></p>
-        <p>Into that weakness stepped the enemies Assyria had made. In <strong>Babylon</strong>, a Chaldean general named <strong>Nabopolassar</strong> — whose story opens the next act of the Chronicle's Babylon — revolted and made himself king. From the Iranian highlands came the <strong>Medes</strong> under their king Cyaxares. And the two ancient victims of Assyria made an alliance to destroy it.<sup class="cite"><a href="#as-r17">[17]</a></sup> They took the old capital Ashur in 614 BCE. In 612 BCE, after a siege of three months, they took <strong>Nineveh</strong> itself — the scene that opened this chapter — and burned it to the ground. A remnant Assyrian army held on at <strong>Harran</strong> for a few more years, propped up by Egypt, which now feared the new Babylonian power more than the dying Assyrian one. But at Harran, by around 609 BCE, the last Assyrian king vanished from history, and Assyria as a state was finished.<sup class="cite"><a href="#as-r17">[17]</a></sup></p>
+        <p>Into that weakness stepped the enemies Assyria had made. In <strong>Babylon</strong>, a Chaldean general named <strong>Nabopolassar</strong> — whose story opens the next act of the Chronicle's Babylon — revolted and made himself king. From the Iranian highlands came the <strong>Medes</strong> under their king Cyaxares. And the two ancient victims of Assyria made an alliance to destroy it.<sup class="cite"><a href="#as-r17">[17]</a></sup>
+ The Greek historian Herodotus, writing a century and a half later, adds a further ally to this coalition: bands of Scythian horsemen, whom he credits with having briefly dominated the Medes themselves before the alliance against Assyria was struck. The contemporary Babylonian evidence for the fall does not name the Scythians at all, crediting the victory to the Medes and Babylonians alone, and modern historians treat Herodotus's fuller Scythian narrative with real caution, as a possible garbling of an earlier and separate steppe incursion rather than a participant in the siege itself <span class="badge b-inf">disputed; Herodotus is the only source for direct Scythian participation in the coalition that took Nineveh</span>.<sup class="cite"><a href="#as-r40">[40]</a></sup> They took the old capital Ashur in 614 BCE. In 612 BCE, after a siege of three months, they took <strong>Nineveh</strong> itself — the scene that opened this chapter — and burned it to the ground. A remnant Assyrian army held on at <strong>Harran</strong> for a few more years, propped up by Egypt, which now feared the new Babylonian power more than the dying Assyrian one. But at Harran, by around 609 BCE, the last Assyrian king vanished from history, and Assyria as a state was finished.<sup class="cite"><a href="#as-r17">[17]</a></sup></p>
         <p>The erasure was so total that when the Greek soldier Xenophon marched past the ruins of Nineveh and Kalhu two centuries later, he recorded huge abandoned walls but had no idea whose they were — he thought them the remains of some Median cities.<sup class="cite"><a href="#as-r18">[18]</a></sup> The terror of the earth had become a rumour, then a set of nameless mounds. It would take the archaeologists of the nineteenth century to dig the Assyrians back out of the ground and give them their history again.</p>
       </section>
 
@@ -2846,7 +2865,17 @@
           <li id="as-r28"><a href="https://www.newworldencyclopedia.org/entry/Behistun_Inscription">The Behistun Inscription and Rawlinson's decipherment, 1835–1857</a></li>
           <li id="as-r29"><a href="https://3quarksdaily.com/3quarksdaily/2020/08/henry-rawlinson-and-the-transformation-of-history.html">British Museum–Louvre excavation rivalry; the French antiquities raft lost in the Tigris</a></li>
           <li id="as-r30"><a href="https://www.aljazeera.com/features/2016/12/1/how-isil-destroyed-nimrud">Al Jazeera, "How ISIL destroyed Nimrud"</a>; <a href="https://abcnews.go.com/International/isis-destruction-ancient-city-artifacts-war-crime/story?id=29441874">The 2015 destruction of Nimrud and the Mosul Museum</a></li>
-        </ol>
+        <li id="as-r31"><a href="https://en.wikipedia.org/wiki/Amarna_letter_EA_16">Amarna letter EA 16 (Ashur-uballit I to Akhenaten)</a>; <a href="https://ancientegyptonline.co.uk/ea15/">Amarna letter EA 15</a>; <a href="https://ancientegyptonline.co.uk/EA7/">Burnaburiash II's protest to Akhenaten (EA 7)</a></li>
+<li id="as-r32"><a href="https://en.wikipedia.org/wiki/Tiglath-Pileser_I">Tiglath-Pileser I</a>; <a href="https://www.worldhistory.org/Tiglath_Pileser_I/">Tiglath-Pileser I (World History Encyclopedia)</a></li>
+<li id="as-r33"><a href="https://www.worldhistory.org/Bronze_Age_Collapse/">The Bronze Age Collapse (World History Encyclopedia)</a>; <a href="https://acoup.blog/2026/01/30/collections-the-late-bronze-age-collapse-a-very-brief-introduction/">"The Late Bronze Age Collapse, A Very Brief Introduction" (A Collection of Unmitigated Pedantry)</a></li>
+<li id="as-r34"><a href="https://cdli.ox.ac.uk/wiki/doku.php?id=banquet_stela_assurnasirpal_ii">The Banquet Stele of Ashurnasirpal II (CDLI)</a>; <a href="https://www.haaretz.com/archaeology/2023-06-23/ty-article-magazine/a-feast-fit-for-an-assyrian-king-and-69-574-guests/00000188-e9c7-df52-a79d-fde766930000">Haaretz, "A Feast Fit for an Assyrian King (And 69,574 Guests)"</a></li>
+<li id="as-r35"><a href="https://en.wikipedia.org/wiki/Lion_Hunt_of_Ashurbanipal">The Lion Hunt of Ashurbanipal</a>; <a href="https://smarthistory.org/ashurbanipal-hunting-lions/">Smarthistory, "Ashurbanipal Hunting Lions"</a></li>
+<li id="as-r36"><a href="https://en.wikipedia.org/wiki/Shamash-shum-ukin">Shamash-shum-ukin</a>; <a href="https://www.britannica.com/place/Mesopotamia-historical-region-Asia/Ashurbanipal-668-627-and-Shamash-shum-ukin-668-648">Ashurbanipal &amp; Shamash-shum-ukin (Britannica)</a>; <a href="https://www.labrujulaverde.com/en/2025/01/how-ashurbanipal-destroyed-babylon-whose-king-was-his-own-elder-brother/">"How Ashurbanipal Destroyed Babylon, Whose King Was His Own Elder Brother"</a></li>
+<li id="as-r37"><a href="https://en.wikipedia.org/wiki/Ishtar_of_Arbela">Ishtar of Arbela</a>; <a href="https://denverjournal.denverseminary.edu/the-denver-journal-article/prophets-and-prophecy-in-the-ancient-near-east/">"Prophets and Prophecy in the Ancient Near East" (Denver Journal)</a></li>
+<li id="as-r38"><a href="https://chs.harvard.edu/chapter/3-the-concept-and-reality-of-the-substitute-kingin-mesopotamia-and-iran/">"The Concept and Reality of the Substitute King in Mesopotamia and Iran" (Center for Hellenic Studies)</a>; <a href="https://www.researchgate.net/publication/382495901_The_Substitute_King_sar_puhi_An_Assyrian_Ritual_of_the_First_Millennium">"The Substitute King (sar puhi): An Assyrian Ritual of the First Millennium"</a></li>
+<li id="as-r39"><a href="https://archeologie.culture.gouv.fr/khorsabad/en/death-sargon">"The Death of Sargon" (Khorsabad excavation project, French Ministry of Culture)</a>; <a href="https://history-uncovered.com/articles/sargon-ii-the-assyrian-king-who-died-fighting-his-own-prophecy">"Sargon II: The Assyrian King Who Died Fighting His Own Prophecy"</a></li>
+<li id="as-r40"><a href="https://www.thecollector.com/ancient-medes-origins-history/">"The Medes, the Ancient People Who Took Down the Assyrian Empire" (TheCollector)</a>; <a href="https://www.iranicaonline.org/articles/babylonia-index/babylonia-i/">Encyclopaedia Iranica, "Babylonia in the Median and Achaemenid periods"</a></li>
+</ol>
       </section>
     </article>
   </div>


===== ABSENCE HUNT BEFORE =====


========================================================================
ASSYRIA  —  60 targets probed
========================================================================
  NAME-DROP (14) — present but untreated; verify context before briefing:
     [~] LAND: rain-fed north vs irrigated south (the dry-farming line)  (2 mentions)
     [~] LAND: no natural frontiers — the vulnerability thesis  (1 mention)
     [~] women's letters from Ashur — merchant wives running the firm  (2 mentions)
     [~] Ashur-uballit I and the Amarna correspondence  (1 mention)
     [~] Tiglath-Pileser I  (2 mentions)
     [~] surviving the Bronze Age collapse  (2 mentions)
     [~] the Nimrud banquet stele — 69,574 guests  (1 mention)
     [~] Sargon II killed in battle, body never recovered — a theological crisis  (1 mention)
     [~] the substitute king ritual  (1 mention)
     [~] the lion hunt reliefs  (1 mention)
     [~] Shamash-shum-ukin's revolt, 652-648  (2 mentions)
     [~] Arbela and the Ishtar oracles  (2 mentions)
     [~] 'Nineveh and Its Remains' as a Victorian bestseller  (1 mention)
     [~] Scythians and Cimmerians  (2 mentions)
  COVERED (46):
     [x] LAND: the Assyrian triangle — Ashur, Nineveh, Arbela, Kalhu  (4)
     [x] LAND: the Tigris and the Upper/Lower Zab  (3)
     [x] LAND: the campaign season set by the agricultural calendar  (4)
     [x] PEOPLE: Ashur the god = the city = the state  (52)
     [x] PEOPLE: the limmu / eponym dating system  (7)
     [x] PEOPLE: Aramaic overtakes Akkadian; alphabet vs cuneiform  (9)
     [x] PEOPLE: deportation as demographic engineering  (9)
     [x] PEOPLE: Sammu-ramat / Semiramis  (10)
     [x] PEOPLE: the queen's household; Nimrud queens' tombs (1988-89)  (8)
     [x] Kanesh / Kültepe karum and the merchant archives  (18)  · owns a section
     [x] donkey caravans: tin and textiles out, silver back  (12)
     [x] Shamshi-Adad I  (4)
     [x] Tukulti-Ninurta I: takes Babylon, takes Marduk, murdered by his son  (4)
     [x] Middle Assyrian Laws — the veiling statute  (5)
     [x] Ashurnasirpal II and Kalhu/Nimrud  (28)
     [x] Shalmaneser III; Black Obelisk; Jehu  (13)
     [x] Battle of Qarqar, 853  (3)
     [x] Tiglath-Pileser III: standing army, provincial system, reform  (8)  · owns a section
     [x] Sargon II; Dur-Sharrukin/Khorsabad; fall of Samaria 722  (20)
     [x] Sennacherib; the Palace Without Rival at Nineveh  (15)
     [x] Sennacherib's aqueduct at Jerwan and the Nineveh canal system  (4)
     [x] Lachish 701; the siege reliefs; Hezekiah  (9)
     [x] destruction of Babylon, 689; Sennacherib murdered by his sons  (8)
     [x] Esarhaddon rebuilds Babylon; conquers Egypt 671  (9)
     [x] Esarhaddon's Succession Treaty and the Deuteronomy parallel  (5)
     [x] Ashurbanipal; the Elamite war; the sack of Susa  (17)
     [x] siege engineering: rams, ramps, sappers  (6)
     [x] iron weapons and cavalry  (5)
     [x] calculated terror as stated policy — the inscriptions' own boasts  (19)  · owns a section
     [x] the royal road and messenger relay  (9)
     [x] the scholars' letters: astrologers, exorcists, omen reports  (23)
     [x] the turtanu and the provincial governors  (8)
     [x] Paul-Émile Botta at Khorsabad, 1843  (5)
     [x] Austen Henry Layard at Nimrud, 1845  (3)
     [x] Hormuzd Rassam — the Iraqi excavator whose credit was withheld  (3)
     [x] George Smith and the Flood Tablet, 1872  (5)
     [x] Ashurbanipal's library — scale and survival by fire  (16)  · owns a section
     [x] Rawlinson and the decipherment of Akkadian cuneiform  (10)
     [x] the British Museum / Louvre rivalry; the raft lost in the Tigris  (10)
     [x] the 2015 destruction of Nimrud and the Mosul Museum  (10)
     [x] Ashur falls 614; Nineveh falls 612; Harran 609  (16)
     [x] Cyaxares and the Medes; Nabopolassar; the Fall of Nineveh Chronicle  (7)
     [x] Nahum's oracle  (7)
     [x] Xenophon marches past the ruins without knowing what they are  (4)
     [x] Jonah, Isaiah and the biblical memory of Nineveh  (3)
     [x] Aramaic's survival; the modern Assyrians and the Church of the East  (3)

------------------------------------------------------------------------
TOTAL: 0 absent, 14 name-drop
Absences and name-drops become the next brief. Read context before accepting any verdict.


===== ABSENCE HUNT AFTER =====


========================================================================
ASSYRIA  —  60 targets probed
========================================================================
  NAME-DROP (6) — present but untreated; verify context before briefing:
     [~] LAND: rain-fed north vs irrigated south (the dry-farming line)  (2 mentions)
     [~] LAND: no natural frontiers — the vulnerability thesis  (1 mention)
     [~] women's letters from Ashur — merchant wives running the firm  (2 mentions)
     [~] Sargon II killed in battle, body never recovered — a theological crisis  (1 mention)
     [~] the lion hunt reliefs  (2 mentions)
     [~] 'Nineveh and Its Remains' as a Victorian bestseller  (1 mention)
  COVERED (54):
     [x] LAND: the Assyrian triangle — Ashur, Nineveh, Arbela, Kalhu  (8)
     [x] LAND: the Tigris and the Upper/Lower Zab  (3)
     [x] LAND: the campaign season set by the agricultural calendar  (4)
     [x] PEOPLE: Ashur the god = the city = the state  (73)
     [x] PEOPLE: the limmu / eponym dating system  (7)
     [x] PEOPLE: Aramaic overtakes Akkadian; alphabet vs cuneiform  (9)
     [x] PEOPLE: deportation as demographic engineering  (9)
     [x] PEOPLE: Sammu-ramat / Semiramis  (10)
     [x] PEOPLE: the queen's household; Nimrud queens' tombs (1988-89)  (8)
     [x] Kanesh / Kültepe karum and the merchant archives  (18)  · owns a section
     [x] donkey caravans: tin and textiles out, silver back  (12)
     [x] Shamshi-Adad I  (4)
     [x] Ashur-uballit I and the Amarna correspondence  (3)
     [x] Tukulti-Ninurta I: takes Babylon, takes Marduk, murdered by his son  (4)
     [x] Tiglath-Pileser I  (4)
     [x] Middle Assyrian Laws — the veiling statute  (5)
     [x] surviving the Bronze Age collapse  (4)
     [x] Ashurnasirpal II and Kalhu/Nimrud  (30)
     [x] the Nimrud banquet stele — 69,574 guests  (7)
     [x] Shalmaneser III; Black Obelisk; Jehu  (13)
     [x] Battle of Qarqar, 853  (3)
     [x] Tiglath-Pileser III: standing army, provincial system, reform  (8)  · owns a section
     [x] Sargon II; Dur-Sharrukin/Khorsabad; fall of Samaria 722  (23)
     [x] Sennacherib; the Palace Without Rival at Nineveh  (19)
     [x] Sennacherib's aqueduct at Jerwan and the Nineveh canal system  (4)
     [x] Lachish 701; the siege reliefs; Hezekiah  (9)
     [x] destruction of Babylon, 689; Sennacherib murdered by his sons  (8)
     [x] Esarhaddon rebuilds Babylon; conquers Egypt 671  (11)
     [x] the substitute king ritual  (3)
     [x] Esarhaddon's Succession Treaty and the Deuteronomy parallel  (5)
     [x] Ashurbanipal; the Elamite war; the sack of Susa  (34)
     [x] Shamash-shum-ukin's revolt, 652-648  (14)
     [x] siege engineering: rams, ramps, sappers  (6)
     [x] iron weapons and cavalry  (7)
     [x] calculated terror as stated policy — the inscriptions' own boasts  (22)  · owns a section
     [x] the royal road and messenger relay  (9)
     [x] the scholars' letters: astrologers, exorcists, omen reports  (25)
     [x] Arbela and the Ishtar oracles  (3)
     [x] the turtanu and the provincial governors  (9)
     [x] Paul-Émile Botta at Khorsabad, 1843  (5)
     [x] Austen Henry Layard at Nimrud, 1845  (3)
     [x] Hormuzd Rassam — the Iraqi excavator whose credit was withheld  (3)
     [x] George Smith and the Flood Tablet, 1872  (5)
     [x] Ashurbanipal's library — scale and survival by fire  (16)  · owns a section
     [x] Rawlinson and the decipherment of Akkadian cuneiform  (10)
     [x] the British Museum / Louvre rivalry; the raft lost in the Tigris  (12)
     [x] the 2015 destruction of Nimrud and the Mosul Museum  (12)
     [x] Ashur falls 614; Nineveh falls 612; Harran 609  (16)
     [x] Cyaxares and the Medes; Nabopolassar; the Fall of Nineveh Chronicle  (12)
     [x] Scythians and Cimmerians  (8)
     [x] Nahum's oracle  (7)
     [x] Xenophon marches past the ruins without knowing what they are  (4)
     [x] Jonah, Isaiah and the biblical memory of Nineveh  (3)
     [x] Aramaic's survival; the modern Assyrians and the Church of the East  (3)

------------------------------------------------------------------------
TOTAL: 0 absent, 6 name-drop
Absences and name-drops become the next brief. Read context before accepting any verdict.


===== GATE LOGS =====

PASS  G1 validate_codex (incl. round-trip)
ALL CHECKS PASS  (1,624,064 chars, 1314 ids, 762 citations)

PASS  G2 regression vs baseline
file                                 ids         cites          refs      sections           bytes
--------------------------------------------------------------------------------------------------
content/cities.html                   45            83            18            23           64644
content/epics.html                    77           120            34            37           99997
content/era-0.html                   207           251           141            58          231052
content/era-1.html        504->514 (+10)674->689 (+15)326->336 (+10)           156578785->592267 (+13482)   CHANGED
content/era-2.html                   359           516           220           121          442891
content/faiths.html                   20            34             7            11           26143
content/interludes.html               27            45            13            12           35012
shell.html                            65             0             0            17          141952

  note: content/cities.html: unchanged
  note: content/epics.html: unchanged
  note: content/era-0.html: unchanged
  note: content/era-2.html: unchanged
  note: content/faiths.html: unchanged
  note: content/interludes.html: unchanged
  note: shell.html: unchanged

PASS — no file regressed. (Still confirm the CHANGED set matches what the session was asked to do.)

PASS  G3 assemble
assembled 1,624,064 chars -> /tmp/gate-assembled.html

PASS  G4 absence hunt
recorded separately in logs/<run>/hunt-after.txt

PASS  G5 encoding sweep of fragments
clean

PASS  G6 scene/prov parity
29 scenes vs 29 prov notes

PASS  G7 no <h2> inside .scene
clean


===== OUTPUT CONTRACT =====

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
