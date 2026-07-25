# OUTPUT CONTRACT — fragments, never whole files

You are writing INSIDE an existing 1.6 MB book. You must NOT return a rewritten
chunk or view — a whole-file answer will be rejected unread. Return only
fragments in this exact envelope, one per change, in document order:

```
<<<CHRONICLE-FRAGMENT>>>
mode: insert-after | replace-section | append-refs
anchor: <exact string copied verbatim from the current file>
---
<html payload>
<<<END>>>
```

Rules the injector enforces (violations abort the cycle):

- **anchor** must occur EXACTLY ONCE in the target chunk file. Copy it
  character-for-character from the "current target chapter HTML" you were
  given — including entities like `&amp;` and typographic dashes. Pick a
  distinctive line (a section opening tag, a unique sentence ending).
- **insert-after**: payload is spliced immediately after the anchor string.
- **replace-section**: anchor must be a `<section ...>` OPENING TAG line; the
  entire section through its matching `</section>` is replaced by the payload
  (which must itself be one well-formed `<section>…</section>`).
- **append-refs**: anchor must be the refs section's opening tag
  (`<section class="refs" id="…-refs">`); payload is one or more `<li id="…">`
  items appended to the END of that section's `<ol>`. Continue the existing
  numbering: new ids are last-ref+1 onward.
- Payload must be balanced HTML, contain NO `<script>`, and introduce no `id`
  that already exists in the chunk (you were given the full id inventory).
- Use straight ASCII where the book does; typographic characters the book
  already uses (— – ’ ‘ “ ” · é ā ī š ū etc.) are fine. Never emit U+FFFD,
  control characters, or emoji.

Anything you need to say ABOUT the work (decisions, deferrals, sources) goes
AFTER all fragments under a final line `=== WRITER NOTES ===`. Notes are read
by the referee, not injected.
