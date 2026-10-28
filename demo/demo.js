/*
  ISO/IEC 27001:2022 A.8.28 Secure, accessible static profile demo — ALIGNED architecture and reference.
  Alignment references the official ISO/IEC standards published through iso.org. Alignment of this work is self-declared by JelvanR.
  Referenced standards © ISO/IEC; licensed reference copies held by JelvanR remain restricted under their issued terms. No standard text is reproduced here.
  Guideline rules: AGENT-003, REPO-026, REPO-009
*/
"use strict";

(() => {
  // Presentation-only navigation. Deliberately no authentication, fetch, storage,
  // clipboard, forms, mutation handlers, service workers, or sample credentials.
  const screens = [...document.querySelectorAll("[data-screen]")];
  const navigation = [...document.querySelectorAll(".sidebar nav a")];
  const sidebar = document.getElementById("sidebar");
  const menu = document.getElementById("menu-toggle");
  const titles = {
    overview: "Overview",
    profile: "My profile",
    projects: "Projects",
    badges: "Credentials",
    account: "Account & security",
    signin: "Sign-in preview",
  };
  function closeMenu() {
    sidebar.classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
  }
  function showScreen(moveFocus = false) {
    const requested = location.hash.slice(1);
    const selected = Object.hasOwn(titles, requested) ? requested : "overview";
    screens.forEach((screen) => {
      screen.hidden = screen.dataset.screen !== selected;
    });
    navigation.forEach((link) => {
      if (link.hash === `#${selected}`)
        link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.title = `${titles[selected]} · Verified Profile demo`;
    closeMenu();
    if (moveFocus) {
      document
        .querySelector(`[data-screen="${selected}"] h1`)
        .focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    sidebar.classList.toggle("is-open", open);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menu.focus();
    }
  });
  matchMedia("(min-width: 701px)").addEventListener("change", closeMenu);
  window.addEventListener("hashchange", () => showScreen(true));
  navigation.forEach((link) =>
    link.addEventListener("click", () => {
      if (link.hash === location.hash) closeMenu();
    }),
  );
  showScreen();
})();
