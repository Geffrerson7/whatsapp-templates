const CLAVE = "whatsapp-templates";

function guardar() {
  localStorage.setItem(CLAVE, JSON.stringify(state.plantillas));
}
