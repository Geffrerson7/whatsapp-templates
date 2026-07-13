import { state } from "./state.js";
import { cargar, CLAVE_FILTRO } from "./storage.js";
import { render } from "./ui.js";
import { initTheme } from "./darkMode.js";

// ===============================
// Inicialización de la aplicación
// ===============================

initTheme();
state.plantillas = cargar();
state.filtro = localStorage.getItem(CLAVE_FILTRO) ?? "";
document.getElementById("buscador").value = state.filtro;
render();
