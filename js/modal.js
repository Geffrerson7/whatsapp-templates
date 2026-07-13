// ===============================
// Modal de confirmación
// ===============================

let accionPendiente = null;

const modal = document.getElementById("modal");

export function pedirConfirmacion(mensaje, accion) {
  document.getElementById("modal-texto").textContent = mensaje;

  accionPendiente = accion;
  modal.classList.remove("hidden");
}

export function cancelarConfirmacion() {
  modal.classList.add("hidden");
  accionPendiente = null;
}

export function confirmarAccion() {
  if (accionPendiente) {
    accionPendiente();
  }

  modal.classList.add("hidden");
  accionPendiente = null;
}

modal.addEventListener("click", function (evento) {
  if (evento.target === modal) {
    cancelarConfirmacion();
  }
});

// ===============================
// Modal de información
// ===============================

const modalInfo = document.getElementById("modal-info");
const modalInfoTexto = document.getElementById("modal-info-texto");

export function mostrarMensaje(mensaje) {
  modalInfoTexto.textContent = mensaje;
  modalInfo.classList.remove("hidden");
}

export function cerrarMensaje() {
  modalInfo.classList.add("hidden");
}

document
  .getElementById("modal-info-cerrar")
  .addEventListener("click", cerrarMensaje);

modalInfo.addEventListener("click", function (evento) {
  if (evento.target === modalInfo) {
    cerrarMensaje();
  }
});

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && !modalInfo.classList.contains("hidden")) {
    cerrarMensaje();
  }
});
