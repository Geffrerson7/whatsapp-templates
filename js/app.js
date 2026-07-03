const state = { plantillas: [] };
const form = document.getElementById("form-plantilla");
const lista = document.getElementById("listaPlantillas");
const selector = document.getElementById("selector");
const salida = document.getElementById("mensaje-final");

function normalizarHashtag(texto) {
  const limpio = texto.trim().toLowerCase();
  return limpio.startsWith("#") ? limpio : "#" + limpio;
}

function generarMensajeFinal(plantilla, valorNombre) {
  return plantilla.mensaje.replaceAll("{nombre}", valorNombre);
}

function agregarPlantilla(titulo, mensaje, hashtag) {
  const nueva = new Template(titulo, mensaje, hashtag);
  state.plantillas.push(nueva);
}

function renderSelector() {
  selector.innerHTML = state.plantillas
    .map(
      (plantilla, indice) =>
        `<option value="${indice}">${plantilla.titulo}</option>`,
    ) // value = posición en el array
    .join("");
}

function render() {
  lista.innerHTML = "";
  state.plantillas.forEach(function (plantilla) {
    const fechaTexto = plantilla.fecha.toLocaleDateString("es-PE");
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
        <span class="text-xs text-slate-400 shrink-0">${fechaTexto}</span>
      </div>
      <p class="text-sm text-slate-600 mt-1">${mensajeCorto}</p>
      <p class="text-xs text-slate-400 mt-1">
        ${cantidadCaracteres} caracteres
      </p>
      <span class="inline-block text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full mt-2">${plantilla.hashtag}</span>`;
    lista.appendChild(li);
  });

  renderSelector();
}

form.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const tituloTexto = titulo.value.trim();
  const mensajeTexto = mensaje.value.trim();

  if (tituloTexto.length === 0 || mensajeTexto.length === 0) {
    alert("Título y mensaje son obligatorios");
    return;
  }
  agregarPlantilla(tituloTexto, mensajeTexto, normalizarHashtag(hashtag.value));
  render();
  form.reset();
});

document.getElementById("btn-generar").addEventListener("click", function () {
  const plantilla = state.plantillas[Number(selector.value)];
  const nombre = document.getElementById("valorNombre").value.trim();
  salida.textContent = generarMensajeFinal(plantilla, nombre);
});

document.getElementById("btn-copiar").addEventListener("click", function () {
  navigator.clipboard.writeText(salida.textContent);
});
