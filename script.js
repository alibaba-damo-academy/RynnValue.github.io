const header = document.querySelector(".site-header");
const replayButton = document.getElementById("replayChart");
const chart = document.getElementById("rlChart");
const year = document.getElementById("year");
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

if (year) {
  year.textContent = new Date().getFullYear();
}

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 10);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const themeModes = ["auto", "light", "dark"];
const themeNames = {
  auto: "Auto",
  light: "Light",
  dark: "Night",
};

function readTheme() {
  try {
    const saved = window.localStorage.getItem("rynnvalue-theme");
    return themeModes.includes(saved) ? saved : "auto";
  } catch {
    return "auto";
  }
}

let activeTheme = readTheme();

function effectiveTheme() {
  if (activeTheme === "auto") {
    return systemTheme.matches ? "dark" : "light";
  }
  return activeTheme;
}

function sendChartTheme() {
  chart?.contentWindow?.postMessage(
    { type: "rynnvalue-theme", theme: effectiveTheme() },
    "*",
  );
}

function applyTheme(mode, persist = true) {
  activeTheme = themeModes.includes(mode) ? mode : "auto";

  if (activeTheme === "auto") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = activeTheme;
  }

  if (themeLabel) {
    themeLabel.textContent = themeNames[activeTheme];
  }

  themeToggle?.setAttribute(
    "aria-label",
    `Color theme: ${themeNames[activeTheme]}. Activate to switch.`,
  );

  if (persist) {
    try {
      window.localStorage.setItem("rynnvalue-theme", activeTheme);
    } catch {
      // The page still works when storage is unavailable.
    }
  }

  sendChartTheme();
}

applyTheme(activeTheme, false);

themeToggle?.addEventListener("click", () => {
  const currentIndex = themeModes.indexOf(activeTheme);
  applyTheme(themeModes[(currentIndex + 1) % themeModes.length]);
});

systemTheme.addEventListener?.("change", () => {
  if (activeTheme === "auto") {
    sendChartTheme();
  }
});

chart?.addEventListener("load", sendChartTheme);

replayButton?.addEventListener("click", () => {
  if (!chart) return;

  const source = chart.getAttribute("src");
  chart.setAttribute("src", "");
  window.requestAnimationFrame(() => {
    chart.setAttribute("src", source || "assets/rl-results-bars.html");
  });
});


