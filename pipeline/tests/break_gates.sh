#!/usr/bin/env bash
# break_gates.sh — deliberately break things and confirm every rail aborts
# (pipeline spec §12 step 3). Run from the repo root on a CLEAN tree; it
# restores master/ via git when done. Exit 0 = every abort fired.
set -u
cd "$(dirname "$0")/../.."
PASS=0; FAIL=0
ck(){ if [ "$1" = "$2" ]; then PASS=$((PASS+1)); echo "ok   $3"; else FAIL=$((FAIL+1)); echo "FAIL $3 (exit $1, wanted $2)"; fi }
T=/tmp/break-gates; rm -rf $T; mkdir -p $T
CHUNK=master/content/era-1.html
BASE=$T/baseline; cp -r master $BASE

# --- injector rails ------------------------------------------------------
cat > $T/f-noenv.md <<'EOF'
<section id="zz-test"><p>whole file pretending</p></section>
EOF
python3 pipeline/lib/inject.py $T/f-noenv.md $CHUNK >/dev/null 2>&1; ck $? 2 "inject: refuses output without envelopes"

cat > $T/f-badanchor.md <<'EOF'
<<<CHRONICLE-FRAGMENT>>>
mode: insert-after
anchor: </p>
---
<p id="zz-a">x</p>
<<<END>>>
EOF
python3 pipeline/lib/inject.py $T/f-badanchor.md $CHUNK >/dev/null 2>&1; ck $? 2 "inject: refuses ambiguous anchor"

cat > $T/f-script.md <<'EOF'
<<<CHRONICLE-FRAGMENT>>>
mode: insert-after
anchor: <article id="ch-sumer"
---
<p id="zz-b">x</p><script>alert(1)</script>
<<<END>>>
EOF
python3 pipeline/lib/inject.py $T/f-script.md $CHUNK >/dev/null 2>&1; ck $? 2 "inject: refuses <script>"

cat > $T/f-collide.md <<'EOF'
<<<CHRONICLE-FRAGMENT>>>
mode: insert-after
anchor: <article id="ch-sumer"
---
<p id="su-open">collides</p>
<<<END>>>
EOF
python3 pipeline/lib/inject.py $T/f-collide.md $CHUNK >/dev/null 2>&1; ck $? 2 "inject: refuses id collision"

printf '<<<CHRONICLE-FRAGMENT>>>\nmode: insert-after\nanchor: <article id="ch-sumer"\n---\n<p id="zz-c">bad \xef\xbf\xbd char</p>\n<<<END>>>\n' > $T/f-corrupt.md
python3 pipeline/lib/inject.py $T/f-corrupt.md $CHUNK >/dev/null 2>&1; ck $? 2 "inject: refuses replacement character"

cat > $T/f-unbal.md <<'EOF'
<<<CHRONICLE-FRAGMENT>>>
mode: insert-after
anchor: <article id="ch-sumer"
---
<div id="zz-d"><p>never closed</div>
<<<END>>>
EOF
python3 pipeline/lib/inject.py $T/f-unbal.md $CHUNK >/dev/null 2>&1; ck $? 2 "inject: refuses unbalanced payload"

# --- a GOOD fragment must apply, then gates must pass --------------------
cat > $T/f-good.md <<'EOF'
<<<CHRONICLE-FRAGMENT>>>
mode: insert-after
anchor: <article id="ch-sumer" data-title="Chapter I·1 — Sumer"
---
<!-- zz-test-marker --><span id="zz-good" hidden>gate-test</span>
<<<END>>>
EOF
python3 pipeline/lib/inject.py $T/f-good.md $CHUNK >/dev/null 2>&1; ck $? 0 "inject: applies a valid fragment"
grep -q "zz-good" $CHUNK; ck $? 0 "inject: payload really present"
python3 pipeline/lib/gates.py --baseline $BASE --chunk era-1 >/dev/null 2>&1; ck $? 0 "gates: pass on a legal era-1 change"

# --- G2 rails ------------------------------------------------------------
echo "<!-- rogue -->" >> master/content/era-2.html
python3 pipeline/lib/gates.py --baseline $BASE --chunk era-1 >/dev/null 2>&1; ck $? 1 "G2: refuses change in a non-target chunk"
git checkout -q -- master/content/era-2.html

echo "<!-- rogue -->" >> master/shell.html
python3 pipeline/lib/gates.py --baseline $BASE --chunk era-1 >/dev/null 2>&1; ck $? 1 "G2: refuses shell change without shell-work"
python3 pipeline/lib/gates.py --baseline $BASE --chunk era-1 --shell-work >/dev/null 2>&1; ck $? 0 "G2: allows shell change WITH shell-work"
git checkout -q -- master/shell.html

python3 - <<'EOF'
s = open('master/content/era-1.html', encoding='utf-8').read()
open('master/content/era-1.html','w',encoding='utf-8').write(s.replace('<li id="su-r1">','<li id="su-r1-gone">',1))
EOF
python3 pipeline/lib/gates.py --baseline $BASE --chunk era-1 >/dev/null 2>&1; ck $? 1 "G1/G2: refuses citation-breaking edit"
git checkout -q -- master/content/era-1.html

# restore the good-fragment state? no — clean everything
git checkout -q -- master/
python3 pipeline/lib/gates.py --baseline $BASE --chunk era-1 >/dev/null 2>&1; ck $? 0 "clean tree: gates green again"

echo; echo "$PASS passed, $FAIL failed"
[ $FAIL -eq 0 ]
