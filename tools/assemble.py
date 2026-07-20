#!/usr/bin/env python3
"""Assemble the master folder into one chronicle.html. Usage: assemble.py <master-dir> <out.html>"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import codexfs
s = codexfs.assemble(sys.argv[1])
open(sys.argv[2],'w',encoding='utf-8').write(s)
print(f'assembled {len(s):,} chars -> {sys.argv[2]}')
