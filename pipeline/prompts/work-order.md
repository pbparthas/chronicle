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
