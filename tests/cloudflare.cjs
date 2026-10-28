/*
  ISO/IEC 27001:2022 A.8.28 Secure, accessible static profile demo — ALIGNED architecture and reference.
  Alignment references the official ISO/IEC standards published through iso.org. Alignment of this work is self-declared by JelvanR.
  Referenced standards © ISO/IEC; licensed reference copies held by JelvanR remain restricted under their issued terms. No standard text is reproduced here.
  Guideline rules: AGENT-003, REPO-026, REPO-009
*/
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
require("../scripts/build-cloudflare.cjs");
(async () => {
  const worker = (
    await import(
      pathToFileURL(path.resolve(__dirname, "../.cloudflare/worker.mjs"))
    )
  ).default;
  let passed = 0;
  const check = (value) => {
    assert.ok(value);
    passed++;
  };
  const request = (route, method = "GET") =>
    worker.fetch(new Request("https://showcase.example" + route, { method }));
  for (const route of ["/", "/demo"]) {
    const r = await request(route);
    check(r.status === 302);
    check(r.headers.get("location") === "/demo/");
  }
  for (const file of [
    "index.html",
    "styles.css",
    "demo.js",
    "assets/vp-logo.svg",
  ]) {
    const r = await request("/demo/" + file);
    check(r.status === 200);
    check(
      (await r.text()) ===
        fs.readFileSync(path.resolve(__dirname, "../demo", file), "utf8"),
    );
    check(r.headers.get("x-content-type-options") === "nosniff");
    check(
      r.headers.get("content-security-policy").includes("connect-src 'none'"),
    );
    check(
      r.headers
        .get("content-security-policy")
        .includes("frame-ancestors 'none'"),
    );
    check(r.headers.get("cache-control") === "no-store");
    check(!r.headers.has("set-cookie"));
  }
  check((await request("/demo/?ignored=1")).status === 200);
  const head = await request("/demo/", "HEAD");
  check(head.status === 200);
  check((await head.text()) === "");
  for (const route of [
    "/api/profile",
    "/login",
    "/.env",
    "/docs/AUTHENTICATION.md",
    "/demo/unknown",
    "/demo/%00",
    "/__proto__",
  ])
    check((await request(route)).status === 404);
  for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
    const r = await request("/api/auth", method);
    check(r.status === 405);
    check(r.headers.get("allow") === "GET, HEAD");
  }
  const health = await (await request("/healthz")).json();
  check(
    health.mode === "read-only-demo" &&
      health.authentication === false &&
      health.persistence === false,
  );
  check((await (await request("/robots.txt")).text()).includes("Disallow: /"));
  console.log(
    JSON.stringify({ suite: "cloudflare-static-worker", passed, failed: 0 }),
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
