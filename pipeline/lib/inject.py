#!/usr/bin/env python3
"""inject.py — deterministic fragment splicing (spec §5).

Fragments, never whole files: a model asked to return a 540 KB chunk will
silently truncate it. Every rule here ABORTS loudly instead of guessing.

Usage:
    python pipeline/lib/inject.py <fragments-file> <target-chunk-path>

Exit 0 = all fragments applied and re-read confirmed. Anything else = abort.
"""
import re
import sys

ENVELOPE = re.compile(
    r"<<<CHRONICLE-FRAGMENT>>>\s*\n"
    r"mode:\s*(insert-after|replace-section|append-refs)\s*\n"
    r"anchor:\s*(.+?)\s*\n"
    r"---\n"
    r"(.*?)"
    r"\n?<<<END>>>",
    re.S,
)

# Definite corruption — never legitimate in the book. (The book itself is full
# of legitimate non-ASCII: — · ’ ā š …; those are allowed.)
FORBIDDEN = re.compile("[\x00-\x08\x0b\x0c\x0e-\x1f\ufffd]")
EMOJI = re.compile("[\U0001F000-\U0001FAFF\u2600-\u27BF\uFE0F]")


def die(msg):
    print(f"INJECT ABORT: {msg}", file=sys.stderr)
    sys.exit(2)


def balanced(payload):
    """Cheap tag-balance check for the payload (void elements exempt)."""
    VOID = {"br", "hr", "img", "meta", "link", "input", "source", "wbr", "col", "area", "base"}
    stack = []
    for m in re.finditer(r"<(/?)([a-zA-Z][a-zA-Z0-9-]*)[^>]*?(/?)>", payload):
        close, tag, selfclose = m.group(1) == "/", m.group(2).lower(), m.group(3) == "/"
        if tag in VOID or selfclose or payload[m.start():m.end()].startswith("<!--"):
            continue
        if close:
            if not stack or stack[-1] != tag:
                return False, f"unbalanced </{tag}> (stack: {stack[-5:]})"
            stack.pop()
        else:
            stack.append(tag)
    return (not stack), (f"unclosed tags: {stack}" if stack else "ok")


def section_span(text, open_tag_pos):
    """Span of <section …>…</section> starting at open_tag_pos, nesting-aware."""
    depth, i = 0, open_tag_pos
    for m in re.finditer(r"<section\b[^>]*>|</section>", text[open_tag_pos:]):
        if m.group(0).startswith("</"):
            depth -= 1
            if depth == 0:
                return (open_tag_pos, open_tag_pos + m.end())
        else:
            depth += 1
    return None


def parse_fragments(raw):
    frags = [{"mode": m.group(1), "anchor": m.group(2), "payload": m.group(3)}
             for m in ENVELOPE.finditer(raw)]
    if not frags:
        die("no CHRONICLE-FRAGMENT envelopes found in the writer output")
    tail = raw[raw.rfind("<<<END>>>") + len("<<<END>>>"):]
    if "<<<CHRONICLE-FRAGMENT>>>" in tail:
        die("malformed envelope after the last <<<END>>>")
    return frags


def apply(fragments_file, chunk_path):
    raw = open(fragments_file, encoding="utf-8").read()
    frags = parse_fragments(raw)
    text = open(chunk_path, encoding="utf-8").read()
    existing_ids = set(re.findall(r'\sid="([^"]+)"', text))

    for i, f in enumerate(frags, 1):
        tag = f"fragment {i} ({f['mode']})"
        payload = f["payload"]
        if "<script" in payload.lower():
            die(f"{tag}: payload contains <script>")
        if FORBIDDEN.search(payload):
            die(f"{tag}: payload contains control/replacement characters")
        if EMOJI.search(payload):
            die(f"{tag}: payload contains emoji/symbol characters foreign to the book")
        ok, why = balanced(payload)
        if not ok:
            die(f"{tag}: payload not well-formed — {why}")
        new_ids = set(re.findall(r'\sid="([^"]+)"', payload))
        if f["mode"] != "replace-section":
            clash = new_ids & existing_ids
            if clash:
                die(f"{tag}: id collision with existing ids: {sorted(clash)[:5]}")

        n = text.count(f["anchor"])
        if n != 1:
            die(f"{tag}: anchor matches {n} times (must be exactly 1): {f['anchor'][:90]!r}")
        pos = text.index(f["anchor"])

        if f["mode"] == "insert-after":
            at = pos + len(f["anchor"])
            text = text[:at] + "\n" + payload + text[at:]
        elif f["mode"] == "replace-section":
            if not re.match(r"<section\b", f["anchor"]):
                die(f"{tag}: replace-section anchor must be a <section …> opening tag")
            if not re.match(r"\s*<section\b", payload) or not payload.rstrip().endswith("</section>"):
                die(f"{tag}: replace-section payload must be one <section>…</section>")
            span = section_span(text, pos)
            if not span:
                die(f"{tag}: could not find the section's closing tag")
            old_ids = set(re.findall(r'\sid="([^"]+)"', text[span[0]:span[1]]))
            clash = (new_ids - old_ids) & (existing_ids - old_ids)
            if clash:
                die(f"{tag}: id collision outside the replaced section: {sorted(clash)[:5]}")
            text = text[:span[0]] + payload + text[span[1]:]
        elif f["mode"] == "append-refs":
            if 'class="refs"' not in f["anchor"]:
                die(f"{tag}: append-refs anchor must be the refs <section> opening tag")
            span = section_span(text, pos)
            if not span:
                die(f"{tag}: refs section closing tag not found")
            seg = text[span[0]:span[1]]
            close = seg.rfind("</ol>")
            if close == -1:
                die(f"{tag}: refs section has no </ol>")
            seg = seg[:close] + payload + "\n" + seg[close:]
            text = text[:span[0]] + seg + text[span[1]:]

        existing_ids |= new_ids

    open(chunk_path, "w", encoding="utf-8").write(text)
    # immediate re-read + presence confirmation of every payload
    confirm = open(chunk_path, encoding="utf-8").read()
    for i, f in enumerate(frags, 1):
        probe = f["payload"].strip()[:200]
        if probe and probe not in confirm:
            die(f"fragment {i}: payload not present after write — refusing to continue")
    print(f"injected {len(frags)} fragment(s) into {chunk_path}")
    return len(frags)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        die("usage: inject.py <fragments-file> <target-chunk-path>")
    apply(sys.argv[1], sys.argv[2])
