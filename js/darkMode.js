const THEME_KEY = "theme";

export function initTheme() {
  const guardado = localStorage.getItem(THEME_KEY);

  const prefiereOscuro = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  if (guardado === "dark" || (!guardado && prefiereOscuro)) {
    document.documentElement.classList.add("dark");
  }
}
