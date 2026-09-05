#!/usr/bin/env python3
"""Assemble <Name>.dc.html from <Name>.body.html + _style.css."""
import sys, pathlib
FONTS = ("https://fonts.googleapis.com/css2?family=Young+Serif"
         "&family=Albert+Sans:wght@400;500;600;700"
         "&family=Noto+Sans+TC:wght@400;500;700&display=swap")
TPL = """<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="{fonts}">
  <style>
{css}  </style>
</helmet>
{body}</x-dc>
</body>
</html>
"""
css = pathlib.Path('_style.css').read_text()
for frag in sorted(pathlib.Path('.').glob('*.body.html')):
    name = frag.name.replace('.body.html', '')
    out = pathlib.Path(f'{name}.dc.html')
    out.write_text(TPL.format(fonts=FONTS, css=css, body=frag.read_text()))
    print(f"  {out.name:26s} {out.stat().st_size:>7,} bytes")
