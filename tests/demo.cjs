/*
  ISO/IEC 27001:2022 A.8.28 Secure, accessible static profile demo — ALIGNED architecture and reference.
  Alignment references the official ISO/IEC standards published through iso.org. Alignment of this work is self-declared by JelvanR.
  Referenced standards © ISO/IEC; licensed reference copies held by JelvanR remain restricted under their issued terms. No standard text is reproduced here.
  Guideline rules: AGENT-003, REPO-026, REPO-009
*/
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");
const { spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const output = path.join(root, "docs/demo-evidence");
const screens = [
  "overview",
  "profile",
  "projects",
  "badges",
  "account",
  "signin",
];
const results = [];
const check = (name, condition) => {
  assert.ok(condition, name);
  results.push({ name, result: "pass" });
};
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
};
let browser;
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  let file = decodeURIComponent(url.pathname);
  if (file.endsWith("/")) file += "index.html";
  const resolved = path.resolve(root, "." + file);
  if (!resolved.startsWith(root + path.sep))
    return response.writeHead(403).end();
  try {
    const content = await fs.readFile(resolved);
    response
      .writeHead(200, {
        "Content-Type":
          types[path.extname(resolved)] || "application/octet-stream",
      })
      .end(content);
  } catch {
    response.writeHead(404).end();
  }
});
(async () => {
  await fs.mkdir(output, { recursive: true });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {}),
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on("request", (request) =>
    requests.push({ url: request.url(), method: request.method() }),
  );
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(origin + "/demo/");
  await page.waitForFunction(() => document.querySelector("img").complete);
  check(
    "Logo is loaded",
    await page
      .locator(".brand img")
      .evaluate((image) => image.naturalWidth > 0),
  );
  check("No form can be submitted", (await page.locator("form").count()) === 0);
  check(
    "All fields are disabled",
    await page
      .locator("input")
      .evaluateAll((inputs) => inputs.every((input) => input.disabled)),
  );
  check(
    "All non-navigation buttons are disabled",
    await page
      .locator("button:not(#menu-toggle)")
      .evaluateAll((buttons) => buttons.every((button) => button.disabled)),
  );
  check(
    "The confirmed demo email is used",
    (await page.locator("#login-email").inputValue()) ===
      "demo@verifiedprofile.com",
  );
  check(
    "No sample password is stored",
    (await page.locator("#login-password").inputValue()) === "",
  );
  check(
    "No sample OTP is stored",
    (await page.locator("#email-code").inputValue()) === "",
  );
  check(
    "CSP blocks network connections",
    await page
      .locator('meta[http-equiv="Content-Security-Policy"]')
      .getAttribute("content")
      .then(
        (policy) =>
          policy.includes("connect-src 'none'") &&
          policy.includes("form-action 'none'"),
      ),
  );
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    for (const screen of screens) {
      await page.evaluate((name) => {
        location.hash = name;
      }, screen);
      await page.waitForFunction(
        (name) => !document.querySelector(`[data-screen="${name}"]`).hidden,
        screen,
      );
      check(
        `${screen}: no horizontal overflow at ${width}px`,
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      check(
        `${screen}: no clipped text at ${width}px`,
        await page
          .locator(`[data-screen="${screen}"]`)
          .evaluate((panel) =>
            [...panel.querySelectorAll("*")]
              .filter(
                (element) =>
                  element.childElementCount === 0 &&
                  element.textContent.trim() &&
                  element.getBoundingClientRect().width > 0,
              )
              .every(
                (element) =>
                  !element.clientWidth ||
                  element.scrollWidth <= element.clientWidth + 1,
              ),
          ),
      );
      if (width === 1440 || width === 390) {
        await page.screenshot({
          path: path.join(output, `${screen}-${width}.png`),
          fullPage: true,
        });
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => {
    location.hash = "overview";
  });
  await page.locator('[data-screen="overview"]').waitFor({ state: "visible" });
  await page.locator("#menu-toggle").click();
  check(
    "Mobile navigation expands",
    (await page.locator("#menu-toggle").getAttribute("aria-expanded")) ===
      "true",
  );
  await page.screenshot({
    path: path.join(output, "menu-390.png"),
    fullPage: true,
  });
  await page.locator('.sidebar nav a[href="#account"]').click();
  await page.locator('[data-screen="account"]').waitFor({ state: "visible" });
  check(
    "Mobile navigation closes after selecting a screen",
    (await page.locator("#menu-toggle").getAttribute("aria-expanded")) ===
      "false",
  );
  check(
    "Screen heading receives focus",
    await page
      .locator('[data-screen="account"] h1')
      .evaluate((heading) => heading === document.activeElement),
  );
  await page.locator("#menu-toggle").click();
  await page.keyboard.press("Escape");
  check(
    "Escape closes navigation and restores focus",
    (await page.locator("#menu-toggle").getAttribute("aria-expanded")) ===
      "false" &&
      (await page
        .locator("#menu-toggle")
        .evaluate((menu) => menu === document.activeElement)),
  );
  await page.goto(origin + "/demo/#signin");
  check(
    "Sign-in preview supports direct links",
    await page.locator('[data-screen="signin"]').isVisible(),
  );
  await page.evaluate(() => {
    location.hash = "unknown-screen";
  });
  await page.waitForFunction(
    () => !document.querySelector('[data-screen="overview"]').hidden,
  );
  check(
    "Unknown route fails safely to the overview",
    await page.locator('[data-screen="overview"]').isVisible(),
  );
  check(
    "Exactly one screen is visible",
    (await page.locator("[data-screen]:visible").count()) === 1,
  );
  check(
    "Disabled actions never create a session or storage",
    await page.evaluate(
      () =>
        document.cookie === "" &&
        localStorage.length === 0 &&
        sessionStorage.length === 0,
    ),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  check(
    "Reduced-motion scrolling is supported",
    await page.evaluate(
      () => getComputedStyle(document.body).scrollBehavior === "auto",
    ),
  );
  await page.setViewportSize({ width: 844, height: 390 });
  check(
    "Landscape layout has no horizontal overflow",
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const touchPage = await touch.newPage();
  await touchPage.goto(origin + "/demo/");
  await touchPage.locator("#menu-toggle").tap();
  await touchPage.locator('.sidebar nav a[href="#projects"]').tap();
  await touchPage
    .locator('[data-screen="projects"]')
    .waitFor({ state: "visible" });
  check(
    "Touch navigation reaches the Projects screen",
    await touchPage.locator('[data-screen="projects"]').isVisible(),
  );
  await touch.close();
  const noJS = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const noJSPage = await noJS.newPage();
  await noJSPage.goto(origin + "/demo/");
  check(
    "Without JavaScript the overview remains readable",
    await noJSPage.locator('[data-screen="overview"]').isVisible(),
  );
  check(
    "Without JavaScript all write controls remain disabled",
    await noJSPage
      .locator("button:not(#menu-toggle)")
      .evaluateAll((buttons) => buttons.every((button) => button.disabled)),
  );
  await noJS.close();
  check("No browser errors", errors.length === 0);

  const built = spawnSync(process.execPath, ["scripts/build-demo.cjs"], {
    cwd: root,
    encoding: "utf8",
  });
  check("Read-only Pages build succeeds", built.status === 0);
  async function walk(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const item = path.join(directory, entry.name);
      if (entry.isDirectory()) files.push(...(await walk(item)));
      else files.push(path.relative(path.join(root, ".site"), item));
    }
    return files.sort();
  }
  const artifactFiles = await walk(path.join(root, ".site"));
  check(
    "Pages artifact contains only the demo allowlist",
    JSON.stringify(artifactFiles) ===
      JSON.stringify(
        [
          ".nojekyll",
          "demo/assets/vp-logo.svg",
          "demo/demo.js",
          "demo/index.html",
          "demo/styles.css",
          "index.html",
        ].sort(),
      ),
  );
  await page.goto(origin + "/.site/demo/#profile");
  check(
    "Built demo works under a nested project path",
    (await page.locator('[data-screen="profile"]').isVisible()) &&
      (await page
        .locator(".brand img")
        .evaluate((image) => image.naturalWidth > 0)),
  );
  check(
    "Only same-origin static GET requests occur",
    requests.every(
      (request) =>
        request.method === "GET" &&
        (request.url.startsWith(origin + "/demo/") ||
          request.url.startsWith(origin + "/.site/demo/")) &&
        !request.url.includes("/api/"),
    ),
  );
  await fs.writeFile(
    path.join(output, "results.json"),
    JSON.stringify(
      {
        testedAt: new Date().toISOString(),
        browser: await browser.version(),
        results,
        errors,
        requests,
        artifactFiles,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`${results.length} read-only demo checks passed.`);
  await context.close();
  await browser.close();
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    server.close();
    setTimeout(() => process.exit(process.exitCode || 0), 100);
  });
