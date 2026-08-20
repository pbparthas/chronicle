**Referee model: claude-opus-4-8** (Opus 4.8; serving model may differ per harness).

Cycle: I·4 Assyria — Phase 2 retrofit completion (name-drop upgrades).
Master audited live from the repo folder (`master/shell.html` + `master/content/*.html`), not a remembered copy.

=== VERDICT ===
**Pass-with-patches.**

The cycle did exactly what the brief scoped — upgraded the load-bearing name-drops in place, inside the acts that already own each topic — with no new sections, no shelf/timeline/map work, and honest badging throughout. One minor citation-precision defect found and patched below (a wrong Amarna-letter number in a reference label; the prose claim itself is correct). Nothing else rose above noise.

**Mechanical (re-run this session, not trusted from the gate log):**
- `validate_codex.py master` → **ALL CHECKS PASS** (1,624,064 chars, 1,314 ids, 762 citations), round-trip stable.
- `assemble.py master` → 1,624,064 chars, byte-consistent with the folder.
- Regression: only `master/content/era-1.html` changed in the writer commit (b440a4b); `shell.html` and all six other content files **unchanged** — confirmed by `git show --stat` and by diffing. No stale-load rollback.
- Ref continuity: `as-r*` ids run **1–40 contiguous**, and every id 1–40 is referenced by at least one `<sup>` cite (no orphan refs, no dangling cites). New refs `as-r31–as-r40` are a clean last-ref+1 append from the prior top (`as-r30`).
- Scene/prov parity 29/29; **no `<h2>` inside `.scene`**; encoding sweep clean (the non-ASCII in the fragments is normal typographic UTF-8 — em-dashes, the `î` in Gurdî — not mojibake).
- `absence_hunt.py master … assyria` reproduces the AFTER state: **0 ABSENT · 6 NAME-DROP · 54 COVERED.**

**Honeypots (built for Assyria before reading the diff; probed raw HTML):**
1. *Royal-boast numbers* — 69,574 banquet guests, Tiglath-Pileser's 920 lions, the Shamash-shum-ukin famine/cannibalism claim: **all three badged `b-leg`** as claims of the king's own inscription, not audited fact. Correctly calibrated.
2. *Sargon II's lost body → theological crisis* — attested death and lost corpse kept as fact; the "divine punishment" reading badged `b-inf` as the Assyrians' own inference. The "Sin of Sargon" text named correctly (a real composition; Sennacherib-era). Calibrated.
3. *Scythians at the fall of Nineveh* — the diff's own added passage flags that **Herodotus is the sole source** for direct Scythian participation and that the contemporary Babylonian Chronicle names only Medes and Babylonians; badged `b-inf` disputed. This is the textbook-correct handling and a strong catch by the writer.
4. *Substitute-king ritual (Damqi)* — framed as "the clearest surviving case," not as the norm; matches the SAA 10 Mar-Issar correspondence. Calibrated.
5. *Ishtar-of-Arbela oracle* — the "fear not" formula and the named prophetess Sinqiša-amur match the SAA 9 prophecy corpus; the "most identifiable prophets were women" claim is sound. Calibrated.
6. *Deuteronomy 28 / Succession-Treaty parallel* (pre-existing, re-checked) — still badged `b-inf` as a minority position, not consensus. Held.

**Gate-1 spot-check (riskiest claims · source · why verified).**
Constraint declared plainly: this referee session had **only Bash/Read/Write/Edit — no WebFetch or WebSearch**, and the writer's own ledger reports WebFetch was egress-blocked for the whole writing session too. So neither of us could re-fetch the cited pages live this session. I therefore verified the riskiest claims against my own knowledge of the primary corpora and flag that the URL bodies remain unfetched by any pipeline stage — the owner (or a session with working egress) should spot-open `as-r31`–`as-r40` as a final layer.

- **Ashur-uballit I: "gold in your land is as plentiful as dust"** · Amarna EA 16 (Ashur-uballit to the Egyptian king) · the "gold is dust in your country" line is the signature phrase of EA 16 and the shared Amarna gold-request trope — verified against the letter's known content. ✔
- **Damqi, son of a Babylonian official, enthroned and killed as Esarhaddon's substitute** · SAA 10 (Mar-Issar's letters to Esarhaddon) · the single securely-documented instance of the šar pūhi rite run to its lethal end, including a substitute queen — matches the letters. ✔
- **Tiglath-Pileser I: 920 lions, sailing from Arvad, cedar from Lebanon** · his prism annals · the 920-lion boast (on foot + from chariot) and the Arvad sea-voyage/nāhiru episode are the standard content of the annals — verified. ✔
- **Shamash-shum-ukin's revolt 652–648, coalition, death in the burning palace** · Ashurbanipal's annals + Babylonian Chronicle · dates, the Elam/Chaldean/Aramean/Arab coalition, the two-year siege and the burning-palace death are the received account; the cannibalism line is correctly marked as the victor's own propaganda. ✔

**One finding → patched (see PATCHES):** reference `as-r31`'s third link labels Burnaburiash II's protest as **Amarna letter EA 7**. EA 7 is Burnaburiash's letter complaining he was not visited during his illness; the protest that Assyrian envoys — his own vassals — had no business negotiating with Egypt is **EA 9**. The prose claim is correct and the other two links in the ref (EA 15, EA 16) correctly support the Ashur-uballit content; only the parenthetical letter-number and its target URL are misattributed. Retargeted to the Wikipedia EA 9 article (same naming scheme as the EA 16 link already in the line). Confidence is from my own knowledge of the Amarna corpus, not a live fetch — noted so the owner can confirm the page resolves.

**Ownership / deferral check (D1-class watch):** the new Brothers'-War `.war` card gives Assyria a full imperial-strategic treatment of 652–648, which is exactly what the brief mandated ("must be treated, not named"). It does **not** collide with Babylonia I·3 the way D1 did: the Assyria card carries a **visible in-prose deferral** — "told in fuller, harder detail from Babylon's own side … Babylonia (I·3)" — with a live `data-goto="babylonia"`, and Babylonia I·3 owns the street-level account (`bb-assyrian`, "Burned by Brothers"). Clean owner/non-owner split (imperial frame here, city's-own-side there). One soft note for the owner, not a defect: the back-link is one-directional in prose — Babylonia I·3's `bb-assyrian` section does not carry a forward `data-goto="assyria"`. Since this cycle did not touch Babylonia and the Connected side-panels already pair the two, I did not patch it; worth a link-add whenever Babylonia is next opened.

**Writer-ledger note (cosmetic, no action):** the writer's summary self-counts "10 fragments (9 in-place + 1 append-refs)"; the actual envelope count is **10 in-place content fragments + 1 append-refs = 11**, and 10 name-drops were upgraded + 4 defended = 14. The delivered codex is correct; only the notes' arithmetic is off.

**Defended name-drops re-verified (writer declined to expand — I confirmed the defense holds):**
- *LAND rain-fed north vs irrigated south* and *no natural frontiers* — `as-land` ¶2 ("The first fact is water…") and ¶3 ("The second fact is geography…") are each a full, cited, thesis-scale paragraph. The hunt tool's keyword counts (2 and 1) undercount real coverage. Expanding would have been padding under the anti-invention gate. Correct call.
- *women's letters from Ashur* — `as-lived` names Lamassi and Ahaha with specific cited detail. Developed, not a name-drop. Confirmed present.
- *'Nineveh and Its Remains' as bestseller* — writer could find no Gate-1-passing sales figure and refused to invent one, leaving the existing correct sentence. Right under the gate.

Two AFTER-hunt "name-drops" — *Sargon II killed in battle* and *the lion hunt reliefs* — are keyword-count artifacts: both now carry a full new paragraph in the diff. They are covered in fact; the tool simply did not re-classify them.

=== PATCHES ===

One bounded patch (cross-link retarget of a reference label — within referee authority). Applies to `master/content/era-1.html`.

<<<CHRONICLE-FRAGMENT>>>
mode: replace
find: <li id="as-r31"><a href="https://en.wikipedia.org/wiki/Amarna_letter_EA_16">Amarna letter EA 16 (Ashur-uballit I to Akhenaten)</a>; <a href="https://ancientegyptonline.co.uk/ea15/">Amarna letter EA 15</a>; <a href="https://ancientegyptonline.co.uk/EA7/">Burnaburiash II's protest to Akhenaten (EA 7)</a></li>
---
<li id="as-r31"><a href="https://en.wikipedia.org/wiki/Amarna_letter_EA_16">Amarna letter EA 16 (Ashur-uballit I to Akhenaten)</a>; <a href="https://ancientegyptonline.co.uk/ea15/">Amarna letter EA 15</a>; <a href="https://en.wikipedia.org/wiki/Amarna_letter_EA_9">Burnaburiash II's protest against Assyria negotiating with Egypt (EA 9)</a></li>
<<<END>>>

Note: prose text is unchanged; the fix touches only the parenthetical letter number and its URL inside `as-r31`. Re-run `validate_codex.py` after applying (ref id and cite resolution are unaffected — same id, same count).

=== ESCALATIONS ===

(none that halt this cycle.) One documentation discrepancy to surface, already resolved by the newer owner ruling — recorded here, not a halt:

- **Stale sequence text in `briefs/next.md`.** The Assyria brief body (dated 2026-07) says the queue is "Assyria completion … then the queued Caral brief … then Era 2 opens." The newer launch note (`pipeline/prompts/launch-notes.md`, note 6, commit `71e3bb1`, 2026-08) **supersedes** it: the owner's explicit queue is **Assyria completion → Persia II·5 rewrite (Era 2, writer opus-4.8) → Caral completion (sonnet) → Greece & Alexander II·11 (opus-4.8).** I have followed the newer launch note and written the NEXT BRIEF for **Persia II·5**, not Caral. The owner should delete or update the stale sentence in the brief body at the next repack so the two documents stop disagreeing.

Shelf lock, timeline lanes, maps doctrine, renumbering: none triggered this cycle (no card, lane, map-geometry, or numbering work was done or is needed).

=== NEXT BRIEF ===

slug: persia
chunk: era-2
phase: 2
model: opus-4.8
status: ready
new-chapter: no
shell-work: no
---
# CYCLE BRIEF — II·5 PERSIA (Achaemenid) — flagship-standard rewrite / retrofit completion

Owner-sequenced (launch-notes.md note 6, 2026-08): **Persia II·5 rewrite comes
next, before Caral.** Era 2 is opened by owner ruling for this entry only;
Caral (briefs/queue/caral.md, sonnet) follows, then Greece & Alexander II·11
(opus-4.8). This is a *rewrite to the Sumer/Assyria flagship standard*, not a
name-drop touch-up: Persia is a first-tier empire currently carried at roughly
half the depth of Assyria, and the work order (§6.3) already measured
`pe-persepolis` at ~350 words with major voids. Route: **opus-4.8** per the
owner ruling and the skill's own reservation of Opus for the imperial capstones.

## How to open the cycle
1. This brief's target list was built by the referee from research, NOT by
   reading `era-2.html`. **Before writing, add a `persia` entry to
   `master/absence-targets.json`** carrying the target list below, then run
   `absence_hunt.py master master/absence-targets.json persia` against the
   current master to classify each target ABSENT / NAME-DROP / COVERED. Commit
   the JSON in the same cycle (Launch Note 5). The referee could not write the
   JSON this cycle (mandate limited to the verdict + costs files).
2. Distinguish **ABSENT (write new)** from **THIN (expand in place)** from
   **COVERED**. Work-order §9.6 warning applies directly here: Behistun and
   Rawlinson's decipherment are **already present** in Persia — they are THIN,
   to be raised into a named act, **not** re-written as if absent. Duplication
   is the failure mode this rewrite must avoid.

## Current structure (12 acts, refs pe-r1..pe-r24)
Prologue · The People (pe-origins) · Cyrus · Death of the Founder · Cambyses ·
Darius · The Machine · Persepolis · The Wars with the Greeks · Voices from the
Time · The Fall (Alexander) · Legacy. Witness act present (pe-fall). People act
present (pe-origins).

## Named-act gaps to close (the flagship five, per §5.1 logic applied to Era 2)
- **THE LAND — missing as a named act.** `pe-origins` fuses land and people
  ("Out of the Highlands"). Give the Iranian plateau its own act: the highland
  Persis vs the lowland satrapies; the Zagros; **the qanat** (underground
  irrigation) as the signature Persian technology that made an arid plateau
  bear an empire; why the four capitals (Pasargadae, Persepolis, Susa,
  Ecbatana) sit where they do — seasonal court migration across climate zones.
- **A named HOW-WE-KNOW / REDISCOVERY act.** Currently the decipherment story
  is scattered through `pe-darius`/`pe-machine`. Gather it: **Behistun and
  Rawlinson** (THIN → promote, do not duplicate); **the Persepolis excavations
  — Ernst Herzfeld (1931–34) and Erich Schmidt** for the Oriental Institute,
  Chicago [verify dig years]; **the Persepolis Fortification Archive** (tens of
  thousands of tablets; Cameron and Hallock's editions) and its extraordinary
  modern legal afterlife — the *Rubin v. Islamic Republic of Iran* attempt to
  seize the Chicago tablets to satisfy a terror judgment, decided for Iran/the
  museum by the U.S. Supreme Court in 2018 [verify holding and year]; **the
  Cyrus Cylinder's modern life** — its 1971 Shah-era and UN reinvention as "the
  first charter of human rights," which must be badged as a **modern political
  myth, not what the cuneiform says** (calibration honeypot; the text is a
  conventional Mesopotamian royal building/restoration inscription).
- **THE LIVED DAY — absent, and the most obvious one in the empire.** Build it
  from the **Persepolis Fortification tablets**: real named and unnamed workers
  (kurtaš), grain/wine/beer ration lists, **women in the workforce drawing
  rations**, and **higher rations for new mothers** (larger for a boy than a
  girl in the tablets — state it honestly), travel-ration "Q texts" for
  officials moving along the roads. Fully attested, materials-and-documents
  based — the natural Lived Day the entry never wrote. §6.3 already flags this.
- **Deferral to the Zoroastrianism cluster entry.** Persia's religion material
  (Ahura Mazda, the magi, Xerxes' "daiva" inscription) must carry a **visible
  in-prose deferral + live `data-goto` to the existing Zoroastrianism entry**,
  which owns the faith. Do not re-narrate the religion; frame the *royal* use
  of it (kingship, arta/"the Lie," Ahura Mazda on the reliefs).

## Target list — build the hunt from THESE (research-built; classify live)
Rulers/politics: Cyrus II · Cambyses II · **Bardiya / Gaumata and the
usurpation debate** (was the "impostor" real, or did Darius murder the true
Bardiya and invent him? Behistun is Darius's own propaganda — badge) · Darius I
· Xerxes I and **his assassination** · Artaxerxes I · Darius II · Artaxerxes II
(King's Peace — present) · **Artaxerxes III and the brutal reconquest of Egypt
343 BCE** · Darius III · **Atossa, Amestris, Parysatis** (the Achaemenid royal
women and court power). Institutions: the satrapy system · the King's Eye /
inspectors · Royal Road & angarium (present) · the daric · **Aramaic as the
imperial chancery language** (likely THIN — load-bearing) · the tribute system
and the **Apadana delegation reliefs** · Darius's **Susa foundation charter**
(the "cedar from Lebanon, gold from Sardis and Bactria, lapis from Sogdiana,
ivory from Kush" inscription — a superb attested materials text). Sites/objects:
Pasargadae & Cyrus's tomb (present) · **Naqsh-e Rustam** royal tombs and the
Sasanian overcarvings (likely ABSENT/THIN) · Persepolis Apadana & Gate of All
Nations (present, THIN) · the **Oxus Treasure** · Ecbatana · Susa. Debates/
honeypots: **Cyrus Cylinder = "human rights charter"** (modern myth — badge) ·
**Cambyses' "madness" and the Apis bull** (Herodotus's hostile Egyptian-priest
tradition vs Cambyses' actual dedication to the Apis — reassess, badge) · **the
lost army of Cambyses** (Herodotus's 50,000 in the sandstorm; the 2009 "found
it" claim is rejected — badge) · **Xerxes' army in the millions** (Herodotus;
universally read as propaganda inflation — badge) · Zoroaster's wildly disputed
dates (badge) · the burning of Persepolis 330 accident-vs-reprisal (present) ·
"Immortals" as a possible Greek mistranslation of *anušiya* (present).
Afterlife/reception: Persepolis as **Takht-e Jamshid** in Persian memory; the
1971 imperial celebration at the ruins; the site today.

Every `[verify]` lead above is a floor to investigate under Gate 1, not a
licence to assert — anything research contradicts goes back as unsubstantiated,
not written anyway. Cite generously; badge every disputed point; any dramatized
scene carries its `.prov` note (G6/G7 enforced).

## Flag list (escalate, do not do)
Shelf cards, renumbering, timeline bars/lanes, maps beyond colour, and anything
the work order reserves. No new Cities cards (Persepolis-as-city is Phase 3, NOT
authorized) — Persepolis stays inside the Persia entry this cycle. Surface in
the verdict's NEXT BRIEF that **Caral (briefs/queue/caral.md, sonnet)** is the
cycle after Persia.

=== DEPTH JUDGMENT ===

**This cycle: complete against its scope; accept.** The brief was a name-drop
upgrade over a chapter already at 0 ABSENT, and it upgraded all ten load-bearing
name-drops (Ashur-uballit/Amarna, Bronze-Age-collapse continuity thesis,
Tiglath-Pileser I, the banquet stele's provisioning, Sargon's death & the Sin of
Sargon, the Damqi substitute-king case, the Sinqiša-amur oracle, the Brothers'
War card, the lion-hunt/Dying-Lioness reliefs, the Herodotus/Scythian dispute)
while correctly **declining to pad four already-covered items**. Depth is not
measured here in words; measured in named absences, the chapter has none
outstanding from its own 60-target list.

**Named-absence list for a future deeper Assyria pass (NOT blockers — genuine,
attested, vivid material a longer treatment would eventually add; none is a
silent void, each is legitimately deferrable):**
- **Sargon II's "Letter to the God Aššur"** — the eighth-campaign account of the
  704-line march against Urartu, one of the great pieces of Assyrian literary
  prose; the chapter has the terror inscriptions but not this set-piece.
- **The Urartu wars** as a named theatre — Assyria's most persistent northern
  rival, currently only glancing.
- **Naqia / Zakutu** — Sennacherib's queen and the most powerful woman of the
  late empire (the "Zakutu Treaty" securing Ashurbanipal's succession); the
  chapter has Sammu-ramat but not Naqia.
- **The ša rēši (eunuch) administrative corps** and the turtānu hierarchy as a
  governing class, beyond the single mention.
- **The akītu New Year festival** and the Aššur temple's ritual year — the
  religious spine under the war calendar.
- **Sennacherib's "Palace Without Rival" garden and the screw-lifting-device /
  "Hanging Gardens of Nineveh" attribution argument** (Dalley) — currently the
  canals and aqueduct are in, but the gardens attribution debate is not; note
  this partly overlaps future Nineveh-city work (Phase 3), so defer rather than
  duplicate.

Recommend to the owner: none of the above changes this verdict. If a defect
*class* is worth mechanizing, it is the recurring **hunt-tool keyword
undercount** (Sargon's death and the lion reliefs both read as "name-drop"
after a full paragraph was written) — a note in the hunt output that a target's
count reflects a fixed keyword, not semantic coverage, would stop future cycles
from chasing phantom name-drops.
