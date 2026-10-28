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

const root = path.resolve(__dirname, "..");
const evidence = path.join(root, "docs", "evidence");
const results = [];
const check = (name, condition) => {
  assert.ok(condition, name);
  results.push({ name, result: "pass" });
};
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};
const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const target = path.resolve(
    root,
    `.${decodeURIComponent(pathname === "/" ? "/index.html" : pathname)}`,
  );
  if (!target.startsWith(root + path.sep)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const content = await fs.readFile(target);
    response.setHeader(
      "Content-Type",
      types[path.extname(target)] || "application/octet-stream",
    );
    response.end(content);
  } catch {
    response.writeHead(404).end();
  }
});

(async () => {
  await fs.mkdir(evidence, { recursive: true });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
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
  const errors = [];
  const failedRequests = [];
  const externalRequests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("requestfailed", (request) => failedRequests.push(request.url()));
  page.on("request", (request) => {
    if (!request.url().startsWith(origin) && !request.url().startsWith("data:")) externalRequests.push(request.url());
  });
  await page.goto(origin);
  await page.waitForFunction(() => document.querySelector("[data-qr] svg"));
  check(
    "Descriptive page title",
    (await page.title()).includes("Verified Profile"),
  );
  check(
    "All images loaded",
    await page
      .locator("img")
      .evaluateAll((images) =>
        images.every((image) => image.complete && image.naturalWidth > 0),
      ),
  );
  check(
    "All in-page anchors resolve",
    await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links.every(
          (link) =>
            link.hash === "" || !!document.getElementById(link.hash.slice(1)),
        ),
      ),
  );
  await page.screenshot({
    path: path.join(evidence, "after-desktop.png"),
    fullPage: true,
  });
  for (const width of [320, 390, 768, 900, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    check(
      `No horizontal overflow at ${width}px`,
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    check(
      `No overflowing text at ${width}px`,
      await page.evaluate(() =>
        [...document.querySelectorAll("main *")]
          .filter(
            (element) =>
              element.childElementCount === 0 &&
              element.textContent.trim() &&
              getComputedStyle(element).display !== "none" &&
              element.getBoundingClientRect().width > 0,
          )
          .every(
            (element) =>
              element.scrollWidth <= element.clientWidth + 1 ||
              element.clientWidth === 0,
          ),
      ),
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("tab", { name: "Badges", exact: true }).click();
  check(
    "Badges tab displays its panel",
    await page
      .getByRole("tabpanel", { name: "Badges", exact: true })
      .isVisible(),
  );
  await page
    .locator(".workspace")
    .screenshot({ path: path.join(evidence, "badges-desktop.png") });
  await page
    .getByRole("tab", { name: "Badges", exact: true })
    .press("ArrowRight");
  check(
    "Arrow navigation activates xCoder AI",
    (await page
      .getByRole("tab", { name: "xCoder AI", exact: true })
      .getAttribute("aria-selected")) === "true",
  );
  await page
    .locator(".workspace")
    .screenshot({ path: path.join(evidence, "ai-desktop.png") });
  await page.getByRole("tab", { name: "xCoder AI", exact: true }).press("Home");
  check(
    "Home returns to Portfolio",
    (await page
      .getByRole("tab", { name: "Portfolio", exact: true })
      .getAttribute("aria-selected")) === "true",
  );
  await page.locator("#profile-name").fill("   ");
  await page.locator("#profile-form button").click();
  check(
    "Whitespace-only name is rejected",
    !(await page.locator("#profile-dialog").isVisible()) &&
      !(await page
        .locator("#profile-name")
        .evaluate((input) => input.validity.valid)),
  );
  await page.locator("#profile-name").fill('<img src=x onerror="alert(1)">');
  await page.locator("#profile-handle").fill("INVALID!");
  await page.locator("#profile-form button").click();
  check(
    "Invalid handle is rejected",
    !(await page.locator("#profile-dialog").isVisible()),
  );
  await page.locator("#profile-handle").fill("demo-user");
  await page.locator("#profile-form button").click();
  check(
    "User-provided names are rendered only as text",
    (await page.locator("#dialog-title").textContent()) ===
      '<img src=x onerror="alert(1)">' &&
      (await page.locator("#dialog-title img").count()) === 0,
  );
  await page.keyboard.press("Escape");
  check(
    "Escape closes dialog and restores focus",
    await page
      .locator("#profile-form button")
      .evaluate((button) => button === document.activeElement),
  );
  await page.locator("#profile-name").fill("Jelvan Ricolcol");
  await page.locator("#profile-handle").fill("mrjelvan");
  await page.locator("#profile-form button").click();
  await page.screenshot({
    path: path.join(evidence, "profile-dialog-desktop.png"),
  });
  await page
    .locator("#dialog-qr")
    .screenshot({ path: path.join(evidence, "demo-qr.png") });
  await page.evaluate(() => {
    window.testCopiedText = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.testCopiedText = text;
        },
      },
    });
  });
  await page.locator("#copy-profile").click();
  await page.waitForFunction(
    () =>
      document.getElementById("copy-status").textContent ===
      "Demo details copied.",
  );
  check(
    "Clipboard success handling (mocked API)",
    (await page.evaluate(() => window.testCopiedText)).startsWith(
      "DEMO PROFILE — NOT VERIFIED",
    ),
  );
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Permission denied");
        },
      },
    });
  });
  await page.locator("#copy-profile").click();
  await page.waitForFunction(() =>
    document.getElementById("copy-status").textContent.includes("blocked"),
  );
  check(
    "Clipboard denial has an accessible fallback (mocked API)",
    (await page.locator("#copy-status").textContent()).includes(
      "Select and copy",
    ),
  );
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Demo privacy" }).click();
  check(
    "Privacy information opens",
    await page.locator("#privacy-dialog").isVisible(),
  );
  await page.screenshot({ path: path.join(evidence, "privacy-desktop.png") });
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: path.join(evidence, "after-mobile.png"),
    fullPage: true,
  });
  check(
    "Mobile badge preserves the issuer context",
    await page.locator(".pill-issuer").isVisible(),
  );
  await page
    .locator(".badge-stage")
    .screenshot({ path: path.join(evidence, "badge-mobile.png") });
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  check(
    "Mobile menu opens",
    (await menu.getAttribute("aria-expanded")) === "true",
  );
  await page.screenshot({ path: path.join(evidence, "menu-mobile.png") });
  await page
    .locator("#site-nav")
    .getByRole("link", { name: "The badge", exact: true })
    .click();
  check(
    "Mobile menu closes after navigation",
    (await menu.getAttribute("aria-expanded")) === "false",
  );
  await page.locator("#profile-form button").click();
  await page.screenshot({
    path: path.join(evidence, "profile-dialog-mobile.png"),
  });
  await page.keyboard.press("Escape");
  await page.getByRole("tab", { name: "Badges", exact: true }).click();
  await page
    .locator(".workspace")
    .screenshot({ path: path.join(evidence, "badges-mobile.png") });
  await page.getByRole("tab", { name: "xCoder AI", exact: true }).click();
  await page
    .locator(".workspace")
    .screenshot({ path: path.join(evidence, "ai-mobile.png") });
  await page.getByRole("button", { name: "Demo privacy" }).click();
  await page.screenshot({ path: path.join(evidence, "privacy-mobile.png") });
  await page.keyboard.press("Escape");
  await page.emulateMedia({ reducedMotion: "reduce" });
  check(
    "Reduced-motion preference disables smooth scrolling",
    await page.evaluate(
      () =>
        getComputedStyle(document.documentElement).scrollBehavior === "auto",
    ),
  );
  if (errors.length) console.error("Browser errors:", errors);
  check("No browser errors", errors.length === 0);
  check("No failed requests", failedRequests.length === 0);
  check("No external network requests", externalRequests.length === 0);
  check(
    "No browser storage is used",
    await page.evaluate(
      () =>
        localStorage.length === 0 &&
        sessionStorage.length === 0 &&
        document.cookie === "",
    ),
  );
  await fs.writeFile(
    path.join(evidence, "test-results.json"),
    JSON.stringify(
      {
        testedAt: new Date().toISOString(),
        browser: await browser.version(),
        results,
        errors,
        failedRequests,
        externalRequests,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `${results.length} checks passed. Evidence saved to docs/evidence/.`,
  );
  await context.close();
  await browser.close();
})()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    server.close();
    // A failed assertion may leave Chromium connected; terminate after reporting.
    setTimeout(() => process.exit(process.exitCode || 0), 100);
  });
