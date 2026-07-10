const CLAVE = "whatsapp-templates";

function guardar() {
  localStorage.setItem(CLAVE, JSON.stringify(state.plantillas));
}

function cargar() {
  const guardado = localStorage.getItem(CLAVE);
  if (!guardado) return [];
  try {
    return JSON.parse(guardado);
  } catch (error) {
    console.warn("Datos corruptos, empiezo de cero:", error);
    return [];
  }
}
