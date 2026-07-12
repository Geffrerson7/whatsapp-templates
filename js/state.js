export const state = { plantillas: [] };

// ===============================
// Funciones utilitarias
// ===============================

export function normalizarHashtag(texto) {
  const limpio = texto.trim().toLowerCase();
  return limpio.startsWith("#") ? limpio : "#" + limpio;
}

export function generarMensajeFinal(plantilla, nombre, producto) {
  return plantilla.mensaje
    .replaceAll("{nombre}", nombre)
    .replaceAll("{producto}", producto);
}

export function contarPorHashtag(plantillas) {
  const conteo = {};
  plantillas.forEach(function (plantilla) {
    const elHashtag = plantilla.hashtag;
    if (conteo[elHashtag]) {
      conteo[elHashtag] = conteo[elHashtag] + 1;
    } else {
      conteo[elHashtag] = 1;
    }
  });
  return conteo;
}

export function hashtagMasUsado(plantillas) {
  if (plantillas.length === 0) {
    return null;
  }

  const conteo = contarPorHashtag(plantillas);

  let resultado = {
    hashtag: "",
    cantidad: 0,
  };

  for (const [tag, total] of Object.entries(conteo)) {
    if (total > resultado.cantidad) {
      resultado = {
        hashtag: tag,
        cantidad: total,
      };
    }
  }

  return resultado;
}

export function plantillasVisibles() {
  const filtroTexto = (state.filtro ?? "").toLowerCase();
  if (filtroTexto === "") return state.plantillas;
  return state.plantillas.filter((plantilla) =>
    plantilla.hashtag.toLowerCase().includes(filtroTexto),
  );
}
