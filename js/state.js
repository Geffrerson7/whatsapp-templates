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

export function ordenar(plantillas) {
  const copia = [...plantillas];

  if (state.orden === "antiguas") {
    return copia.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  } else if (state.orden === "alfabetico") {
    return copia.sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
  } else {
    return copia.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }
}

export function plantillasVisibles() {
  const filtroTexto = (state.filtro ?? "").toLowerCase();
  const filtradas =
    filtroTexto === ""
      ? state.plantillas
      : state.plantillas.filter((plantilla) =>
          plantilla.hashtag.toLowerCase().includes(filtroTexto),
        );
  return ordenar(filtradas);
}
