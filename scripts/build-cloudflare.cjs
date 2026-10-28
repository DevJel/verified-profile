/*
  ISO/IEC 27001:2022 A.8.28 Secure, accessible static profile demo — ALIGNED architecture and reference.
  Alignment references the official ISO/IEC standards published through iso.org. Alignment of this work is self-declared by JelvanR.
  Referenced standards © ISO/IEC; licensed reference copies held by JelvanR remain restricted under their issued terms. No standard text is reproduced here.
  Guideline rules: AGENT-003, REPO-026, REPO-009
*/
"use strict";
const fs = require("node:fs");
const path = require("node:path");
require("./build-demo.cjs");
const root = path.resolve(__dirname, "..");
const out = path.join(root, ".cloudflare");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};
const assets = {};
for (const file of [
  "index.html",
  "styles.css",
  "demo.js",
  "assets/vp-logo.svg",
]) {
  assets["/demo/" + file] = [
    types[path.extname(file)],
    fs.readFileSync(path.join(root, ".site/demo", file), "utf8"),
  ];
}
const handler = `
const security = {
  "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), publickey-credentials-get=(), publickey-credentials-create=()",
  "Strict-Transport-Security": "max-age=31536000",
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store"
};
export default {
  async fetch(request) {
    const respond = (body, status = 200, extra = {}) => new Response(request.method === "HEAD" ? null : body, {status, headers: {...security, "Content-Type": "text/plain; charset=utf-8", ...extra}});
    if (!["GET", "HEAD"].includes(request.method)) return respond("Read-only showcase: writes are unavailable.", 405, {Allow: "GET, HEAD"});
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/demo") return respond(null, 302, {Location: "/demo/"});
    if (url.pathname === "/healthz") return respond(JSON.stringify({status: "ok", mode: "read-only-demo", authentication: false, persistence: false}), 200, {"Content-Type": "application/json; charset=utf-8"});
    if (url.pathname === "/robots.txt") return respond("User-agent: *\\nDisallow: /\\n");
    const key = url.pathname === "/demo/" ? "/demo/index.html" : url.pathname;
    if (!Object.hasOwn(assets, key)) return respond("Not found. This deployment serves only the read-only showcase at /demo/.", 404);
    const [type, body] = assets[key];
    return respond(body, 200, {"Content-Type": type});
  }
};
`;
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(
  path.join(out, "worker.mjs"),
  "// Generated from the explicit demo allowlist; no backend or credentials.\nconst assets = " +
    JSON.stringify(assets) +
    ";\n" +
    handler,
);
console.log(
  "Built .cloudflare/worker.mjs: static read-only showcase, no bindings or external calls.",
);
