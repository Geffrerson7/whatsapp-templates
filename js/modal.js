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
    modal.classList.add("hidden");
    accionPendiente = null;
  }
});
