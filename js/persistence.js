const CLAVE = "whatsapp-templates";

function guardar() {
  localStorage.setItem(CLAVE, JSON.stringify(state.plantillas));
}

function cargar() {
  const guardado = localStorage.getItem(CLAVE);
  return guardado ? JSON.parse(guardado) : [];
}