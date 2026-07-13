export function initTheme() {
  const guardado = localStorage.getItem("theme");
  const prefiereOscuro = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  if (guardado === "dark" || (!guardado && prefiereOscuro)) {
    document.documentElement.classList.add("dark");
  }
}
