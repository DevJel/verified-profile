/*
  ISO/IEC 27001:2022 A.8.28 Secure, accessible static profile demo — ALIGNED architecture and reference.
  Alignment references the official ISO/IEC standards published through iso.org. Alignment of this work is self-declared by JelvanR.
  Referenced standards © ISO/IEC; licensed reference copies held by JelvanR remain restricted under their issued terms. No standard text is reproduced here.
  Guideline rules: AGENT-003, REPO-026, REPO-009
*/
"use strict";

(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.getElementById("site-nav");
  function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(expanded));
    navigation.classList.toggle("is-open", expanded);
  });
  navigation
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menuButton.focus();
    }
  });
  matchMedia("(min-width: 701px)").addEventListener("change", closeMenu);

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden =
        !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft")
        nextIndex = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[nextIndex]);
      tabs[nextIndex].focus();
    });
  });

  function qrText(handle) {
    return `DEMO ONLY | Verified Profile | @${handle} | Not an issued credential. No live verification.`;
  }
  function renderQr(element, handle) {
    if (typeof qrcode !== "function") {
      element.textContent = "QR unavailable";
      return;
    }
    const code = qrcode(0, "M");
    code.addData(qrText(handle));
    code.make();
    const modules = code.getModuleCount();
    const quietZone = 4;
    const size = modules + quietZone * 2;
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("shape-rendering", "crispEdges");
    const background = document.createElementNS(svgNS, "rect");
    background.setAttribute("width", String(size));
    background.setAttribute("height", String(size));
    background.setAttribute("fill", "#fff");
    const path = document.createElementNS(svgNS, "path");
    let drawing = "";
    for (let row = 0; row < modules; row += 1) {
      for (let col = 0; col < modules; col += 1) {
        if (code.isDark(row, col))
          drawing += `M${col + quietZone},${row + quietZone}h1v1h-1z`;
      }
    }
    path.setAttribute("d", drawing);
    path.setAttribute("fill", "#182334");
    svg.append(background, path);
    element.replaceChildren(svg);
  }
  document
    .querySelectorAll("[data-qr]")
    .forEach((element) => renderQr(element, element.dataset.qr));

  const profileDialog = document.getElementById("profile-dialog");
  const privacyDialog = document.getElementById("privacy-dialog");
  const form = document.getElementById("profile-form");
  const nameInput = document.getElementById("profile-name");
  const handleInput = document.getElementById("profile-handle");
  const copyStatus = document.getElementById("copy-status");
  const copyButton = document.getElementById("copy-profile");
  let profile = {
    name: "Jelvan Ricolcol",
    handle: "mrjelvan",
    type: "Individual",
  };
  let dialogOpener = null;

  function openDialog(dialog, opener) {
    dialogOpener = opener;
    dialog.showModal();
    document.documentElement.classList.add("dialog-open");
    dialog.querySelector("[data-close-dialog]").focus();
  }
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.querySelectorAll("[data-close-dialog]").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });
    dialog.addEventListener("click", (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom)
      )
        dialog.close();
    });
    dialog.addEventListener("close", () => {
      document.documentElement.classList.remove("dialog-open");
      dialogOpener?.focus();
    });
  });
  function showProfile(opener) {
    document.getElementById("dialog-title").textContent = profile.name;
    document.getElementById("dialog-handle").textContent =
      `@${profile.handle} · ${profile.type}`;
    renderQr(document.getElementById("dialog-qr"), profile.handle);
    copyStatus.textContent = "";
    copyButton.disabled = false;
    openDialog(profileDialog, opener);
  }
  document
    .querySelector("[data-open-sample]")
    .addEventListener("click", (event) => {
      profile = {
        name: "Jelvan Ricolcol",
        handle: "mrjelvan",
        type: "Individual",
      };
      showProfile(event.currentTarget);
    });
  document
    .querySelector("[data-open-privacy]")
    .addEventListener("click", (event) => {
      openDialog(privacyDialog, event.currentTarget);
    });
  handleInput.addEventListener("input", () => {
    handleInput.setCustomValidity("");
  });
  nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const handle = handleInput.value.trim();
    nameInput.setCustomValidity(name ? "" : "Enter a display name.");
    handleInput.setCustomValidity(
      /^[a-z0-9_-]{3,30}$/.test(handle)
        ? ""
        : "Use 3–30 lowercase letters, numbers, underscores, or hyphens.",
    );
    if (!form.reportValidity()) return;
    profile = {
      name,
      handle,
      type: document.getElementById("profile-type").value,
    };
    showProfile(event.submitter);
  });
  copyButton.addEventListener("click", async () => {
    const text = `DEMO PROFILE — NOT VERIFIED\n${profile.name}\n@${profile.handle} · ${profile.type}\nNo account created. No handle reserved. No credential issued.`;
    if (!navigator.clipboard?.writeText) {
      copyStatus.textContent =
        "Clipboard unavailable. Select and copy the displayed name and handle instead.";
      return;
    }
    copyButton.disabled = true;
    try {
      await navigator.clipboard.writeText(text);
      copyStatus.textContent = "Demo details copied.";
    } catch {
      copyStatus.textContent =
        "Copy was blocked by your browser. Select and copy the displayed name and handle instead.";
    } finally {
      copyButton.disabled = false;
    }
  });
})();
