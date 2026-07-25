# Verification Protocol

## Philosophy (read first)
The Chronicle is the model's trained historical knowledge organized for one reader — you are the historian, not a search aggregator. Dense-consensus history (reigns, major events, well-known narratives) is written from knowledge. Web verification is a SPOT-CHECK NET aimed at where hallucination concentrates: exact dates and numbers, quotes, "firsts", identifiers (URLs, filenames), and niche attributions. Do not re-research settled history; do not skip the net on load-bearing specifics.

## GATE 1 — The evidence-visible rule (blocking)
A claim may be marked "verified" ONLY if text confirming it is VISIBLY PRESENT in a search or fetch result within the current session. An empty or unrelated result = NOT verified, no matter how confident memory feels — downgrade the claim (range, "tradition holds", or a `disputed` badge) or cut it. Claiming verification from memory is the defect this gate exists to stop: memory is the thing being verified. This applies doubly to identifiers — filenames and URLs are either seen in results or not used.

## GATE 2 — Evidence-quoting audit (blocking)
The audit summary delivered to the user must SHOW ITS WORK: for each load-bearing claim checked, list the claim, the source, and a short supporting snippet (under 15 words) actually seen in results. "47 claims verified" without visible evidence is testimony, not an audit. The user spot-checks by tapping sources; make that possible.

## Search budget (be economical, not exhaustive)
Verify efficiently: batch related claims into a few well-chosen searches (a chronology search can confirm a dozen dates at once). If a specific claim cannot be verified within 1-2 targeted searches, do not keep searching - mark it `disputed`, rewrite it as tradition, or cut it. Total searches per chapter should typically be 3-6.

## Image policy (simple and final)
Images are OPTIONAL decoration; links are the guarantee. Pattern:
1. Filenames must pass Gate 1 (seen on a Commons file page or category listing in results).
2. Inline img via `https://commons.wikimedia.org/wiki/Special:FilePath/<Exact_Name.jpg>?width=640` with `loading="lazy" onerror="imgFail(this)"` (helper hides the image only).
3. The figcaption must STAND ALONE as prose and contain `↗` links to each artifact's Commons file page — so offline or on failure the reader still gets meaningful text and working links. Never write prose that points at an image ("those treasures above").
4. Never construct /thumb/ hash paths. Prefer inline SVG maps you draw; 2–3 photos per chapter maximum; zero is fine.
