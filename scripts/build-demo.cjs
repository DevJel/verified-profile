/*
  ISO/IEC 27001:2022 A.8.28 Secure, accessible static profile demo — ALIGNED architecture and reference.
  Alignment references the official ISO/IEC standards published through iso.org. Alignment of this work is self-declared by JelvanR.
  Referenced standards © ISO/IEC; licensed reference copies held by JelvanR remain restricted under their issued terms. No standard text is reproduced here.
  Guideline rules: AGENT-003, REPO-026, REPO-009
*/
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const output = path.join(root, ".site");
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(path.join(output, "demo", "assets"), { recursive: true });
// Explicit allowlist: no production code, private configuration, docs, tests,
// databases, or secrets may enter the GitHub Pages artifact.
for (const file of [
  "index.html",
  "styles.css",
  "demo.js",
  "assets/vp-logo.svg",
]) {
  fs.copyFileSync(
    path.join(root, "demo", file),
    path.join(output, "demo", file),
  );
}
fs.writeFileSync(path.join(output, ".nojekyll"), "");
fs.writeFileSync(
  path.join(output, "index.html"),
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; base-uri \'none\'; form-action \'none\'"><meta http-equiv="refresh" content="0;url=./demo/"><title>Verified Profile demo</title></head><body><main><h1>Verified Profile demo</h1><p><a href="./demo/">Open the read-only feature showcase</a></p></main></body></html>',
);
console.log(
  "Built .site/: read-only demo only, with a project-path-safe redirect.",
);
