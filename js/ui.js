import { guardar } from "./storage.js";
import {
  state,
  contarPorHashtag,
  hashtagMasUsado,
  plantillasVisibles,
  normalizarHashtag,
  generarMensajeFinal,
} from "./state.js";

import {
  pedirConfirmacion,
  cancelarConfirmacion,
  confirmarAccion,
} from "./modal.js";

// ===============================
// Referencias al DOM
// ===============================

const form = document.getElementById("form-plantilla");
const lista = document.getElementById("listaPlantillas");
const selector = document.getElementById("selector");
const salida = document.getElementById("mensaje-final");
const botonCancelarEdicion = document.getElementById("btn-cancelar");
const btnVaciar = document.getElementById("btn-vaciar");
const btnLimpiarFiltro = document.getElementById("btn-limpiar-filtro");
const btnCopiar = document.getElementById("btn-copiar");
const btnCopiarTexto = document.getElementById("btn-copiar-texto");
const btnCopiarCheck = document.getElementById("btn-copiar-check");

// ===============================
// Funciones CRUD
// ===============================

function agregarPlantilla(titulo, mensaje, hashtag) {
  const nueva = new Template(titulo, mensaje, hashtag);
  state.plantillas.push(nueva);
}

function cargarEnFormulario(id) {
  const plantilla = state.plantillas.find((plantilla) => plantilla.id === id);
  titulo.value = plantilla.titulo;
  mensaje.value = plantilla.mensaje;
  hashtag.value = plantilla.hashtag;
  state.editandoId = id;

  botonCancelarEdicion.classList.remove("hidden");
}

function cancelarEdicion() {
  state.editandoId = null;
  form.reset();

  botonCancelarEdicion.classList.add("hidden");
}

function eliminarPlantilla(id) {
  pedirConfirmacion("¿Eliminar esta plantilla?", function () {
    state.plantillas = state.plantillas.filter(
      (plantilla) => plantilla.id !== id,
    );
    render();
  });
}

// ===============================
// Renderizado
// ===============================

function renderStats() {
  const total = state.plantillas.length;
  const porTag = contarPorHashtag(state.plantillas);
  const masUsado = hashtagMasUsado(state.plantillas);
  const etiquetas = Object.entries(porTag)
    .map(
      ([hashtag, cantidad]) =>
        `<span class="text-xs font-mono bg-paper border border-thread px-2 py-0.5 rounded-full">${hashtag} · ${cantidad}</span>`,
    )
    .join("");
  document.getElementById("panel-stats").innerHTML = `
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="font-display text-sm font-semibold text-ink">
          ${total} plantilla(s)
        </span>

        ${etiquetas}
      </div>

      ${
        masUsado
          ? `<p class="text-sm text-ink/70">
              Hashtag más usado:
              <strong class="font-mono text-ink">${masUsado.hashtag}</strong>
              (${masUsado.cantidad})
            </p>`
          : `<p class="text-sm text-ink/50">
              Aún no hay plantillas.
            </p>`
      }
      
    </div>
  `;
}

function renderSelector() {
  selector.innerHTML = state.plantillas
    .map(
      (plantilla, indice) =>
        `<option value="${indice}">${plantilla.titulo}</option>`,
    )
    .join("");
}

export function render() {
  const visibles = plantillasVisibles();
  lista.innerHTML = "";

  if (visibles.length === 0) {
    const vacio =
      state.plantillas.length === 0
        ? "Aún no tienes plantillas. ¡Crea la primera!"
        : "No se encontraron plantillas con ese filtro.";
    lista.innerHTML = `
      <li class="sm:col-span-2 text-center text-ink/40 py-10">
        <div class="text-4xl mb-2">📭</div>
        ${vacio}
      </li>`;
  } else {
    visibles.forEach(function (plantilla) {
      const fechaTexto = new Date(plantilla.fecha).toLocaleDateString("es-PE");
      const fechaEdicionTexto = plantilla.editadaEl
        ? `Editada: ${new Date(plantilla.editadaEl).toLocaleDateString("es-PE")}`
        : "Sin editar";
      const li = document.createElement("li");
      const cantidadCaracteres = plantilla.mensaje.length;
      const mensajeCorto =
        plantilla.mensaje.length > 60
          ? plantilla.mensaje.slice(0, 60) + "…"
          : plantilla.mensaje;
      li.className =
        "burbuja bg-white border border-thread p-4 ml-1 hover:border-ink/30 transition-colors";
      li.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <strong class="font-display text-ink">${plantilla.titulo}</strong>

        <div class="text-right">
          <p class="text-[11px] font-mono text-ink/40">
            ${fechaTexto}
          </p>

          <p class="text-[11px] font-mono text-ink/40">
            ${fechaEdicionTexto}
          </p>
        </div>
      </div>
      <p class="text-sm text-ink/80 mt-1">${mensajeCorto}</p>
      <p class="text-[11px] font-mono text-ink/40 mt-1">
        ${cantidadCaracteres} caracteres
      </p>
      <span class="inline-block text-xs font-mono bg-paper border border-thread text-ink/70 px-2 py-0.5 rounded-full mt-2">${plantilla.hashtag}</span>
      <div class="flex gap-2 mt-3">
        <button class="btn-editar text-xs px-2.5 py-1 rounded-full border border-ink/20 text-ink hover:bg-ink hover:text-paper transition" data-id="${plantilla.id}">Editar</button>
        <button class="btn-eliminar text-xs px-2.5 py-1 rounded-full border border-brick text-brick hover:bg-brick hover:text-white transition" data-id="${plantilla.id}">Eliminar</button>
      </div>
      `;
      lista.appendChild(li);
    });
  }

  renderSelector();
  renderStats();
  guardar();
}

// ===============================
// Eventos
// ===============================

form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const tituloTexto = titulo.value.trim();
  const mensajeTexto = mensaje.value.trim();

  if (tituloTexto.length === 0 || mensajeTexto.length === 0) {
    alert("Título y mensaje son obligatorios");
    return;
  }

  if (state.editandoId) {
    state.plantillas = state.plantillas.map((plantilla) =>
      plantilla.id === state.editandoId
        ? {
            ...plantilla,
            titulo: tituloTexto,
            mensaje: mensajeTexto,
            hashtag: normalizarHashtag(hashtag.value),
            editadaEl: new Date(),
          }
        : plantilla,
    );
    state.editandoId = null;

    botonCancelarEdicion.classList.add("hidden");
  } else {
    agregarPlantilla(
      tituloTexto,
      mensajeTexto,
      normalizarHashtag(hashtag.value),
    );
  }

  render();
  form.reset();
});

document.getElementById("btn-generar").addEventListener("click", function () {
  const plantilla = state.plantillas[Number(selector.value)];

  const nombre = document.getElementById("valorNombre").value.trim();
  const producto = document.getElementById("valorProducto").value.trim();

  salida.textContent = generarMensajeFinal(plantilla, nombre, producto);

  // Reinicia el estado del botón copiar cada vez que se genera un mensaje nuevo
  btnCopiarTexto.textContent = "Copiar";
  btnCopiar.classList.remove("text-tick");
  btnCopiar.classList.add("text-tick");
  btnCopiarCheck.classList.remove("tick-animado");
  btnCopiarCheck.style.color = "";
});

btnCopiar.addEventListener("click", function () {
  if (!salida.textContent) return;

  navigator.clipboard.writeText(salida.textContent);

  btnCopiarTexto.textContent = "Copiado";
  btnCopiarCheck.style.color = "#00A884";
  btnCopiarCheck.classList.remove("tick-animado");
  // Forzar reflow para poder re-disparar la animación
  void btnCopiarCheck.offsetWidth;
  btnCopiarCheck.classList.add("tick-animado");

  setTimeout(function () {
    btnCopiarTexto.textContent = "Copiar";
    btnCopiarCheck.style.color = "";
  }, 2000);
});

btnVaciar.addEventListener("click", function () {
  pedirConfirmacion(
    "Esto borrará TODAS tus plantillas. ¿Continuar?",
    function () {
      state.plantillas = [];
      render();
    },
  );
});

botonCancelarEdicion.addEventListener("click", cancelarEdicion);

lista.addEventListener("click", function (evento) {
  const id = evento.target.dataset.id;
  if (evento.target.classList.contains("btn-eliminar")) eliminarPlantilla(id);
  if (evento.target.classList.contains("btn-editar")) cargarEnFormulario(id);
});

document
  .getElementById("buscador")
  .addEventListener("input", function (evento) {
    state.filtro = evento.target.value;
    render();
  });

btnLimpiarFiltro.addEventListener("click", function () {
  state.filtro = "";
  document.getElementById("buscador").value = "";
  render();
});

document
  .getElementById("modal-cancelar")
  .addEventListener("click", cancelarConfirmacion);

document
  .getElementById("modal-confirmar")
  .addEventListener("click", confirmarAccion);

document.getElementById("orden").addEventListener("change", function (evento) {
  state.orden = evento.target.value;
  render();
});
