# THE FIVE QUESTIONS — the master test (read this first)
The owner's standard, verbatim: "The who, where, when, why, how — these are the basis of all history. Our book has to have these all covered properly. Across time." Every rule below serves one of these. Before delivery, answer each from the draft ALONE — any question the draft cannot answer is a defect:

- **WHO** — the people, not only the peaks: rulers in connected sequence, non-elite life (women's legal/economic status explicitly), and the gods AS ACTORS where they drove events.
- **WHERE** — geography as destiny, and cities as characters with identities (patron god, role, fate) — never name-drops.
- **WHEN** — the political spine in unbroken sequence across the FULL span: no silent voids (a "quiet century" must be shown quiet, not skipped), plus synchronic anchors — what the rest of the world was doing (Meanwhile boxes, World-view sync).
- **WHY** — causes at two levels: modern analysis (multi-causal, debates shown), AND the participants' own stated reasons (their theology, their propaganda, their laments) — labeled as theirs.
- **HOW** — the machinery: economy and credit, law and administration, armies and logistics, temples and priesthoods — the engine, not just the drivers.

"Across time" means the questions are answered for EVERY period the chapter spans, not only its famous peak.

# Chronicle Style Guide — Narrative History Done Honestly

The register: Paul Cooper's *Fall of Civilizations* — patient, cinematic, humane, and scrupulous about uncertainty. Long-form narrated prose. Not bullet points, not textbook headers, not listicle energy.

## Structure of a full Chapter
Sections (each a `<section id="XX-slug">` where XX is the chapter prefix):
1. **Cold open** — a dramatized scene at the civilization's hinge moment (often the fall). Present tense. Then cut back: "Three thousand years earlier…"
2. The world/setting (geography, what makes this place possible)
3. The people (origins — including honest unknowns)
4. Belief/gods/worldview
5. Signature achievement(s)
6. How they were ruled
7. The rulers — each major figure a full arc (see below)
8. The wars — each major war a `.war` card with narrative + source links
9. The turning point / conquest phase
10. Voices from the Time — 2–3 real texts
11. The fall — converging causes, honest about debates
12. What was passed forward — ending on a bridge scene/line into the next chapter

**Interludes** (Elam, Mitanni, Kush, Sea Peoples…): same rigor and style, free structure, any length the story demands — typically cold open → who/where → arc → fall → legacy. No minimum, no maximum.

**Myths (M-series)**: the story told beautifully, PLUS a "the poetry and the spade" section separating literary tradition from archaeology. Everything in a myth entry defaults to `legend` badge except the archaeology.

**Great Cities (C-series)**: biography of a place across its whole life — founding, golden ages, sieges, destruction/afterlife.

## The techniques

### 1. Cold open
Start inside a scene the reader will only fully understand by chapter's end. Example shape:
> It is the year 2004 BCE, and the king of the world's oldest city is watching the horizon burn. [...] To understand how it came to this, we must go back three thousand years, to the moment human beings first...

### 2. Dramatized scene blocks
Use sparingly (2–4 per chapter). Present tense, sensory, close-third-person. Scene blocks use `<div class="scene">` with paragraphs plus a final `<div class="prov">` provenance line. **Every scene block ends with that provenance label**, e.g.:

> *Dramatized — built from sources [12] and [27]. The school, the caning, and the father's gift to the teacher are attested in the text; the boy's name and the morning heat are invented.*

The label is not optional decoration; it is the trust contract. Sensory details may only come from evidence (texts, archaeology, climate/geography). Invented connective tissue must be minor (names of unnamed people, weather, small gestures) and declared.

### 3. Through-line
Pick one entity the chapter keeps returning to — Uruk for Sumer, the Nile for Egypt, a road for Persia. Introduce it early, check in at every era, end on it.

### 4. Kings as arcs
Every major ruler gets: where they came from → what they wanted → what they did (with the reader feeling the stakes) → the ironic or tragic turn → how it ended. Write the *order of revelation* for impact:
> He achieved what three centuries of warlords had died reaching for. He held it for twenty-five years. And then he was marched in a neck-stock past the temple of the very god whose favor he had claimed.

### 5. Uncertainty as drama, not hedge-mush
Disputes are part of the story: "Here the scholars part ways —" is a narrative beat. Never flatten a debate into a single confident claim; never bury the story under qualifications either. One clean sentence of dispute, badged, cited, move on.

### 6. Voices from the Time
2–3 short real texts (letters, proverbs, laments, school texts, receipts), closely paraphrased, each in a `.voice` block with attribution line + confidence badge + source citation. Purpose: the reader hears an actual human from that world. Keep any verbatim quotation under 15 words.

### 7. The bridge ending
Final paragraphs hand the torch: end on a scene or image that belongs to the NEXT chapter's world (e.g. Sumer ends with a Babylonian scribe copying the Lament for Ur centuries later).

## Prose rules
- Vary sentence length; short sentences for impact.
- No bullet lists inside narrative sections (war-card source rows excepted).
- Explain every ancient term at first use, in-flow.
- The reader is intelligent but has no prior background; never assume schooling in the topic.
- Confidence badges inline where the claim happens, not footnoted away.
- British-neutral spelling is fine; keep whatever the codex already uses (it mixes mildly — do not mass-edit old chapters).

## Citations
- `<sup class="cite"><a href="#XX-rN">[N]</a></sup>` immediately after the claim.
- References section at chapter end: `<section class="refs" id="XX-refs">` with `<li id="XX-rN">` entries containing real, working URLs.
- Cite generously: dates, numbers, "firsts", battle outcomes, quotations, disputed points. A paragraph with zero citations should contain zero checkable claims.

## Deep-origins requirement (region-first chapters)
When a chapter introduces a region for the first time, insert a "Before the Beginning"-style section immediately after the cold open: end of Ice Age / regional prehistory -> farming and domestication (dated, cited) -> the age of villages -> the specific forcing functions (irrigation, flood control, trade geography) that created surplus, specialization, trade, and government THERE. Present origins debates honestly (badge `disputed`). Sumer chapter section id `su-before` is the canonical example.

## Depth doctrine (anti-skimming) — apply to every chapter
A chapter is not done when the arc is complete; it is done when it contains the civilization's signature material. Before verification, run this test: "What are the 4-5 most famous or most astonishing things about this civilization — the things a great documentary would never omit?" Each must be either PRESENT in the chapter or EXPLICITLY DEFERRED with a one-line pointer to the chapter/interlude that will carry it. Silent omission is a defect.

Mandatory depth elements per chapter:
1. **At least one iconic archaeological object or discovery, told as a story** — including, where it exists, how modern science revised the interpretation (e.g. Ur death pits: Woolley's poison cups overturned by CT scans showing blunt-force trauma).
2. **At least one ritual, custom, or institution that makes the culture vividly strange** (e.g. the Akitu festival's ritual slapping of Babylon's king; retainer sacrifice; Persian truth-telling education).
3. **The culture's own mythology/theology given real space** when it shaped politics (e.g. Enuma Elish as Babylon's political scripture) — a pantheon list is not enough.
4. **Famous named institutions appear where they acted** (e.g. the Immortals belong in the Thermopylae account, not omitted).
5. **Compressed stretches must still name their era-defining episodes** in a line or two with a pointer (e.g. the Anabasis inside Persia's "quiet century") — compression may shorten, never silently skip.
6. **Signature "gift-to-the-present" details** (word origins like paradise, artifacts like Plimpton 322) — small, cited, unforgettable.

## Synchronicity (the horizontal view)
1. **Meanwhile boxes**: each chapter includes 1–2 `.note` blocks at pivotal dates opening with `<strong>Meanwhile in the world.</strong>` — 3–4 lines placing that moment against the other civilizations (link written chapters with data-goto). This stitches the vertical chapters horizontally.
2. **The World, Year by Year view** (`#view-world`, article `ch-world`): a synchronic snapshot page of ~10 moments. AFTER writing any chapter, update the relevant snapshots: convert your civilization's placeholder lines into data-goto links, correct any line your verified research contradicts, and add a line if the new chapter's civilization is absent from a snapshot it belongs in. Entries stay conservative one-liners — chapters carry citations; this page carries none.

## Clusters, ownership, and one standard for all traditions (owner's editorial policy)
1. **Lenses, not topics**: history chapters own what happened; Faith entries own what was believed and how the scriptures/canon formed; Epics/Myths entries own the stories as literature plus the poetry-vs-spade analysis; City entries own the place through time.
2. **Ownership rule**: every story has exactly ONE owning entry; all other entries give it ≤2 sentences and a Connected-panel link. Prevents cross-chapter contradiction.
3. **Linking is mandatory and bidirectional (owner's directive)**: every Interlude, City, Myth, and Faith entry MUST link to its related civilization chapters, and those chapters MUST link back — via Connected panels AND in-prose data-goto links wherever another entry's subject (a king, a city, a war, a god) is substantively discussed. When any new entry is written, sweep the whole codex for mentions of its subject and upgrade them to live links. An unlinked related entry is a defect.
3b. **Connected panel**: every entry in a cluster ends (before .refs) with `<div class="connected">` listing sibling entries by lens — written siblings as data-goto links, planned ones as `<span class="pl">Name (ID)</span>`. When you write a chapter, UPGRADE any .pl reference to it elsewhere into a live link.
4. **One evidential standard for every tradition** — the owner's explicit policy: Bible, Ramayana, Shahnameh, Greek myth, all epics of living and dead faiths get identical treatment: "tradition holds / the evidence shows", same badges (attested/inferred/legend), no tradition exempted, none singled out. The Epics, Myths & Legends shelf is a literary lens for ALL traditions; Faith entries carry theology and the history of belief.
5. **Search is automatic**: shelf cards and hints are indexed at runtime; no action needed beyond correct markup.

## Scale doctrine — THERE IS NO LIMIT (owner's directive, verbatim)
"Remember there is no limit for the content. All I want is the accurate and correct events and details to be populated. Don't rush, condense, or have a limit of words in each chapter."
- There is NO maximum length. Chapters are as long as their history demands — completeness and accuracy are the ONLY constraints.
- NEVER condense to save space, tokens, or time. If a session cannot finish a chapter at full depth, STOP at a clean section boundary, tell the owner what remains, and continue in the next session — a half-finished deep chapter beats a finished shallow one.
- Minimums remain as tripwires only: >~300 years per 1,000 words = presumptively too thin; split by period or deepen.
- Depth is measured in HISTORY COVERED and the Five Questions answered — never in words.
- Must-cover lists in briefs are FLOORS, not completion specs: every listed item is SECTION-SCALE — its story, its discovery, its debate — never a paragraph-and-move-on. A chapter is finished when the attested history is exhausted, not when the outline is covered.

## Political-spine rule (blocking)
Every civilization chapter must carry a CONNECTED POLITICAL NARRATIVE of its formative era — how power actually moved, in sequence, with the who/when/how of state formation — not merely a gallery of king portraits. If a civilization never unified, say so explicitly and make it a thesis (Sumer precedent: "no one unified it, until its destroyer").

## Visible deferral (blocking)
When the ownership rule defers depth to another entry, the DEFERRAL MUST BE VISIBLE IN THE PROSE at that spot ("...told in full in its own chapter of this Chronicle"), never only in the Connected panel. A reader must never mistake a deliberate pointer for thinness.

## The engine, not just the drivers (institutional depth — blocking)
External audit finding, confirmed by the owner: chapters must show HOW THE SOCIETY RAN, not only who ruled it. Each civilization chapter includes, where the evidence exists: the economic engine (credit, interest, temple/palace finance, trade mechanics — e.g. Sumer's loan rates explaining Urukagina's debt cancellations); law and administration as lived systems; and NON-ELITE life, explicitly including women's legal and economic status (e.g. Egyptian women's property/court/divorce rights; Kubaba the tavern-keeper queen). "Great Man history" — peaks without the institutional glue — is a named defect.

## The Five Questions apply to cities and gods as subjects (blocking)
The owner's generalization: cities and deities are historical SUBJECTS, owed the who/where/when/why/how like any king. The ownership test: if a city or religion has a Cities/Faiths shelf entry, the chapter gives it a visible-deferral pointer; if it has NO shelf home (true of nearly all pre-classical cities and cults — Nippur, Memphis, Uruk, Hattusa, the cult of Ptah), the CHAPTER owes it portrait-level coverage: what it was, whose god it was, what happened there, why it mattered, how it worked. Heartland-city walking tours are standard chapter equipment (Kush's Kerma→Napata→Meroë arc is the model). A capital reduced to a name-drop is a named defect.

## The Lived Day (standard equipment)
Every civilization chapter carries one "what was it like to be alive here" scene: a day in the life of an ORDINARY person (farmer, weaver, scribe-student, porter — not a king), sensory and concrete — what they ate, smelled, feared, prayed to, owed — dramatized <span>badge: dramatized</span> but built strictly from attested details (ration lists, letters, school texts, excavated houses). This is distinct from Voices (real quoted texts): the Lived Day is a guided walk through one reconstructed day.

## The Witness at the End (blocking for fall sections)
Every fall is told TWICE: the geopolitical account, and once from street level — how it felt to stand inside the ending. Dramatized from real sources (city laments, chronicles, refugee letters, archaeology of destruction layers), badged as such. The Ur laments, the Fall of Nineveh chronicle, Jeremiah’s Jerusalem, 1453’s eyewitnesses — the material exists almost everywhere; use it. An empire’s end is a human experience before it is a map change.

## Era Preludes (entry type)
Each era gets a short numberless intro (400–700 words), linked from its era-head on the shelf: "The World of This Era" — the conditions of ordinary life, the state of technology, what exists and what does not yet, and TIME-PERSPECTIVE ANCHORS that jolt the reader’s sense of scale ("while Sumer’s cities traded, the Parthenon lay two thousand years in the future"; "Cleopatra lived closer to the Moon landing than to the Great Pyramid"; "Göbekli Tepe is older to Sumer than Sumer is to us"). Registered as a small view; card-free; teasers may point into it.

## Wars as subjects (blocking)
The owner's directive: every civilization chapter carries a COMPLETE accounting of its significant wars — not just the famous set pieces. For each major war, answer the Five Questions plus the verdict:
- WHO fought: belligerents, alliances, commanders where known;
- WHERE: theatre and named battle sites (SVG map when the geography matters);
- WHEN: dates, duration, sequence;
- WHY: causes at both levels — modern analysis AND the stated casus belli of the participants;
- HOW: armies, weapons, tactics, logistics — the military-technology layer (see arc below);
- RESULT: outcome and consequences — territorial, political, and human cost where sources allow, with all propaganda casualty figures badged as royal claims.
Routine campaigning (e.g. Assyria's annual wars) is covered as a SYSTEM, not an exhaustive list — but no significant war is silently skipped (extension of the no-silent-voids rule). Set pieces use the war-card format. Ownership still applies: a war between two covered civilizations has ONE owning chapter; the other side gets its own vantage briefly (the Kadesh precedent — told from both Egypt's and Hatti's walls).

## The military-technology arc (standing thread)
How wars were fought is a book-length through-line each chapter advances: Sumer's first phalanx (Stele of Vultures) and battle-wagons; the horse and the chariot age (Kadesh its climax); the iron transition as a furnace revolution during the Collapse; Assyria's twin inventions — true cavalry and scientific siegecraft; Persian combined arms and navies; phalanx → sarissa → legion; stirrups and castles; the Mongol horse-archer system; gunpowder from China to the walls of Constantinople 1453 and the gunpowder empires. Name the state of the art in every chapter's wars.

## Religion is civic infrastructure (lens boundary — blocking)
The Faiths shelf owns BELIEF SYSTEMS as systems: theology, scripture formation, evolution, spread. The civilization chapters own RELIGION AS THE CIVILIZATION'S OPERATING MACHINERY, which must never be deferred: patron gods and their cities (the city-god-temple triad, named concretely per city), priesthoods as institutions, temples as economy, festivals as politics, war and treaty as theology. A god who appears once by name while acting in the plot (the Ishtaran defect) is a named failure: gods who ACT in the history get introduced as characters.

## Cities are characters (blocking)
Major cities inside a chapter get an identity (patron god, character, role in the story), never a bare name-drop — even when a fuller city biography exists on the Cities shelf.
