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
const modal = document.getElementById("modal");
const btnVaciar = document.getElementById("btn-vaciar");

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
        `<span class="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full">${hashtag} · ${cantidad}</span>`,
    )
    .join("");
  document.getElementById("panel-stats").innerHTML = `
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-sm font-semibold text-slate-700">
          ${total} plantilla(s)
        </span>

        ${etiquetas}
      </div>

      ${
        masUsado
          ? `<p class="text-sm text-slate-600">
              Hashtag más usado:
              <strong>${masUsado.hashtag}</strong>
              (${masUsado.cantidad})
            </p>`
          : `<p class="text-sm text-slate-500">
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
      <li class="sm:col-span-2 text-center text-slate-400 py-10">
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
      li.className = "bg-white p-4 rounded-lg shadow";
      li.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <strong class="text-slate-800">${plantilla.titulo}</strong>

        <div class="text-right">
          <p class="text-xs text-slate-400">
            Creada: ${fechaTexto}
          </p>

          <p class="text-xs text-slate-400">
            ${fechaEdicionTexto}
          </p>
        </div>
      </div>
      <p class="text-sm text-slate-600 mt-1">${mensajeCorto}</p>
      <p class="text-xs text-slate-400 mt-1">
        ${cantidadCaracteres} caracteres
      </p>
      <span class="inline-block text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full mt-2">${plantilla.hashtag}</span>
      <button class="btn-editar text-xs px-2.5 py-1 rounded-md bg-blue-500 text-[#ffffff] hover:bg-blue-700 transition" data-id="${plantilla.id}">Editar</button>
      <button class="btn-eliminar bg-red-500 hover:bg-red-700 text-xs text-[#ffffff] border border-red rounded px-2 py-1" data-id="${plantilla.id}">Eliminar</button>
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
});

document.getElementById("btn-copiar").addEventListener("click", function () {
  navigator.clipboard.writeText(salida.textContent);
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

document
  .getElementById("modal-cancelar")
  .addEventListener("click", cancelarConfirmacion);

document
  .getElementById("modal-confirmar")
  .addEventListener("click", confirmarAccion);
