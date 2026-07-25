# Pre-Delivery Checklist — complete EVERY item before returning the file

## Research & writing
- [ ] Model declared at intake; routing table checked; mismatch flagged to user if applicable
- [ ] User's current chronicle.html uploaded this session and validated at intake (never work from memory)
- [ ] Web research done BEFORE drafting; middle chronology stated once if dates are chronology-sensitive
- [ ] Cold open scene present, with provenance label
- [ ] Region-first chapter? → "Before the Beginning" deep-origins section included
- [ ] Through-line named and revisited across the chapter
- [ ] Political spine present: connected narrative of how power moved, not just king portraits
- [ ] Institutional engine shown: economy/credit, administration, and non-elite life incl. women's status
- [ ] Religion as civic machinery IN the chapter: city-god-temple triad concrete, priesthoods, acting gods introduced as characters
- [ ] Wars as subjects: every significant war accounted — who/where/when/why/how/RESULT; propaganda numbers badged; military technology of the era named; no war silently skipped
- [ ] Cities & gods as subjects: every heartland city / acting cult WITHOUT a Cities-or-Faiths shelf home has portrait-level coverage here; shelf-owned ones have visible-deferral pointers
- [ ] Every ownership deferral visible in prose, not just the Connected panel
- [ ] 2–4 .scene blocks, each ending in a .prov label separating attested from invented
- [ ] Every major ruler written as an arc (rise → aim → deeds → turn → end)
- [ ] Wars in .war cards with external source links
- [ ] Voices from the Time: 2–3 real texts, paraphrased, quotes under 15 words
- [ ] Fall section presents converging causes; debates shown as debates
- [ ] Bridge ending into the next chapter's world

## Depth gate (blocking — run BEFORE verification)
- [ ] Listed the 4-5 most famous/astonishing things about this civilization; each is present or explicitly deferred with a pointer — none silently omitted
- [ ] At least one iconic object/discovery told as a story (with modern reinterpretation if one exists)
- [ ] At least one vivid ritual/custom/institution of the culture
- [ ] Its mythology/theology given real space where it shaped power
- [ ] Named institutions (guards, orders, offices) appear in the events they starred in
- [ ] Compressed eras name their era-defining episodes in brief with pointers
- [ ] At least one word-origin or gift-to-the-present detail
- [ ] Passing terms that assume knowledge (peoples, places, technical words) carry tap hints per the architecture doc — orientation-only, ≤40 words, no new claims
- [ ] JARGON SWEEP done as a separate final read: scan the draft asking of every noun "would a smart reader with no background have to Google this?" — geography (alluvium, steppe), political terms (vassal, tribute, hegemony, regent), material/technical words (stele, diorite, determinative), era names (Bronze Age), peoples and language families. Each gets an inline gloss or a hint

## Verification (blocking)
- [ ] Claim ledger built; every date, number, "first", and quote checked (3–6 searches total)
- [ ] Unverified claims cut or downgraded; numbers as ranges where sources differ
- [ ] Badges applied: attested / inferred-disputed / legend
- [ ] Every citation sup has a matching reference li with a real URL
- [ ] No invented image URLs; new images (if any) flagged unverified with onerror fallback
- [ ] Audit summary prepared for the user (checked / corrected / cut counts)

## Cluster integrity
- [ ] Connected panel present before .refs, listing cluster siblings by lens
- [ ] Any .pl (planned) references to THIS chapter elsewhere in the codex upgraded to live data-goto links
- [ ] Ownership respected: stories owned elsewhere get ≤2 sentences + link here

## Coverage audit (blocking)
- [ ] Every civilization, kingdom, or people NAMED in this chapter's prose, Meanwhile boxes, or World-view lines has a home: a data-goto link to a written chapter, an existing shelf card, or an explicit in-prose pointer ("its own chapter/interlude will tell..."). A named people with no home is a defect — flag it to the user with a proposed card rather than silently omitting.

## THE FIVE QUESTIONS (final gate — blocking)
- [ ] WHO / WHERE / WHEN / WHY / HOW each answerable from the draft alone, for every period the chapter spans — write one sentence per question as proof; any unanswerable question is a defect to fix before delivery

## Injection & integrity
- [ ] scripts/renumber.py run after injection — numbers are derived from shelf position, never hand-assigned
- [ ] View added + registered in views AND titles maps
- [ ] Shelf card flipped to ready with data-ch; timeline bar recolored #c07b52
- [ ] Previous chapter's teaser updated with data-goto link
- [ ] Unique section prefix used everywhere; no manual read-time text added
- [ ] No hardcoded colors in new CSS; grand-timeline text uses currentColor
- [ ] Existing chapters, settings JS, bookmark JS untouched
- [ ] validate_codex.py: ALL CHECKS PASS on the final file
