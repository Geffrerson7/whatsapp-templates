# Generador de Plantillas para WhatsApp

Una aplicación web sencilla desarrollada con JavaScript para crear, administrar y utilizar plantillas reutilizables de mensajes para WhatsApp.

La aplicación permite crear, editar, eliminar, filtrar y ordenar plantillas de mensajes. Además, toda la información se guarda automáticamente en el navegador mediante **Local Storage**, por lo que las plantillas y el filtro permanecen disponibles incluso después de recargar la página.

## Demo

🌐 **Aplicación desplegada:** [Ver aplicación](https://geffrerson7.github.io/whatsapp-templates/)

## Características

- Crear plantillas de mensajes reutilizables.
- Almacenar las plantillas en un estado centralizado de la aplicación.
- Mostrar las plantillas como tarjetas.
- Generar mensajes personalizados reemplazando las variables de la plantilla.
- Copiar los mensajes generados al portapapeles.

## Arquitectura modular (ES Modules)

La aplicación está organizada utilizando **ES Modules (ESM)**, separando las responsabilidades en distintos archivos para facilitar el mantenimiento y la reutilización del código.

- **`app.js`**: punto de entrada de la aplicación. Inicializa el estado, recupera la información almacenada y realiza el primer renderizado.
- **`state.js`**: almacena el estado global de la aplicación y contiene funciones puras relacionadas con las plantillas, como el filtrado, ordenamiento y generación de estadísticas.
- **`storage.js`**: administra la persistencia de datos mediante Local Storage, encargándose de guardar y recuperar las plantillas y el filtro.
- **`ui.js`**: contiene el renderizado de la interfaz y los eventos que permiten interactuar con la aplicación.
- **`modal.js`**: administra la lógica del modal de confirmación, incluyendo su apertura, cierre y la ejecución de acciones que requieren la confirmación del usuario.

## Persistencia de datos

La aplicación guarda automáticamente la información utilizando **Local Storage** del navegador.

- Las plantillas se almacenan utilizando `JSON.stringify()` y se recuperan con `JSON.parse()`.
- El filtro de búsqueda se guarda directamente como texto, ya que Local Storage almacena cadenas de texto.
- Si los datos almacenados están corruptos, la aplicación utiliza `try/catch` al ejecutar `JSON.parse()` para evitar errores y comenzar con una lista vacía, manteniendo la aplicación funcional.

## Clase `Template`

La clase `Template` representa una plantilla individual de mensaje para WhatsApp.

Cada instancia almacena:

- **`titulo`**: El título de la plantilla.
- **`mensaje`**: El contenido del mensaje, que puede contener variables como `{nombre}` y `{producto}`.
- **`hashtag`**: El hashtag asociado.
- **`fecha`**: La fecha de creación, asignada automáticamente cuando se crea la plantilla.

Ejemplo:

```javascript
const plantilla = new Template(
  "Bienvenida",
  "Hola {nombre}, gracias por comprar {producto}.",
  "#ventas",
);
```

## Métodos de String de JavaScript utilizados

### `trim()`

Elimina los espacios en blanco al inicio y al final de la entrada del usuario.

Ejemplo:

```javascript
titulo.value.trim();
```

Se utiliza para:

- Limpiar el título.
- Limpiar el mensaje.
- Limpiar el hashtag.
- Limpiar los valores ingresados para las variables de la plantilla.

---

### `toLowerCase()`

Convierte el hashtag a minúsculas.

Ejemplo:

```javascript
texto.toLowerCase();
```

Se utiliza para garantizar que los hashtags siempre tengan un formato consistente.

---

### `startsWith()`

Verifica si el hashtag ya comienza con `#`.

Ejemplo:

```javascript
texto.startsWith("#");
```

Se utiliza para evitar agregar múltiples símbolos `#`.

---

### `length`

Devuelve la cantidad de caracteres de una cadena de texto.

Ejemplo:

```javascript
mensaje.length;
```

Se utiliza para mostrar el número de caracteres de cada plantilla.

---

### `slice()`

Extrae una parte de una cadena de texto.

Ejemplo:

```javascript
mensaje.slice(0, 60);
```

Se utiliza para truncar mensajes largos y mantener las tarjetas de las plantillas compactas.

---

### `replaceAll()`

Reemplaza todas las apariciones de una subcadena.

Ejemplo:

```javascript
mensaje.replaceAll("{nombre}", nombre).replaceAll("{producto}", producto);
```

Se utiliza para generar mensajes personalizados reemplazando las variables de la plantilla con los valores proporcionados por el usuario.

## Delegación de eventos

La aplicación utiliza **delegación de eventos** para gestionar las acciones de **editar** y **eliminar** plantillas sin asignar un evento a cada botón individualmente.

En lugar de registrar un `addEventListener()` para cada botón creado dinámicamente, se registra un único listener sobre el elemento `<ul>` que contiene todas las plantillas.

Ejemplo:

```javascript
lista.addEventListener("click", function (evento) {
  const id = evento.target.dataset.id;

  if (evento.target.classList.contains("btn-eliminar")) {
    eliminarPlantilla(id);
  }

  if (evento.target.classList.contains("btn-editar")) {
    cargarEnFormulario(id);
  }
});
```

Cuando el usuario hace clic sobre un botón, el evento se propaga hasta la lista (`lista`). A partir del elemento que originó el clic (`evento.target`), la aplicación identifica qué acción ejecutar.

Este enfoque permite:

- Reducir la cantidad de listeners registrados.
- Hacer que los botones de plantillas agregadas dinámicamente funcionen automáticamente.
- Mantener el código más simple y fácil de mantener.

## Función `contarPorHashtag()`

La función `contarPorHashtag()` es una **función pura** que recibe un arreglo de plantillas y devuelve un objeto con la cantidad de plantillas asociadas a cada hashtag.

Ejemplo:

```javascript
contarPorHashtag([
  { hashtag: "#ventas" },
  { hashtag: "#ventas" },
  { hashtag: "#soporte" },
]);
```

Resultado:

```javascript
{
  "#ventas": 2,
  "#soporte": 1
}
```

Esta función no modifica el estado de la aplicación ni produce efectos secundarios. Su único propósito es calcular estadísticas a partir de los datos recibidos.

Se utiliza para:

- Mostrar el número total de plantillas por hashtag en el panel de estadísticas.
- Calcular cuál es el hashtag más utilizado mediante la función `hashtagMasUsado()`.

## Persistencia del estado

La aplicación guarda automáticamente el estado utilizando **Local Storage**, lo que permite conservar las plantillas y el filtro de búsqueda incluso después de recargar la página.

La función `guardar()` se ejecuta cada vez que se renderiza la interfaz. Si existen plantillas, las convierte a formato JSON mediante `JSON.stringify()` y las almacena en `localStorage`. Si la colección está vacía, elimina la clave utilizando `removeItem()` para mantener el almacenamiento limpio.

Al iniciar la aplicación, la función `cargar()` recupera la información almacenada mediante `localStorage.getItem()`. Si existen datos, los reconstruye con `JSON.parse()`; de lo contrario, devuelve un arreglo vacío para que la aplicación comience sin errores.

### ¿Por qué se utiliza `try/catch`?

La función `JSON.parse()` lanza una excepción cuando el contenido almacenado no es un JSON válido. Esto puede ocurrir si los datos fueron modificados manualmente o quedaron corruptos.

Para evitar que la aplicación falle al iniciarse, `JSON.parse()` se ejecuta dentro de un bloque `try/catch`. Si ocurre un error, se muestra una advertencia en la consola con `console.warn()` y la función devuelve un arreglo vacío, permitiendo que la aplicación continúe funcionando normalmente.

Este enfoque hace que la aplicación sea más robusta y tolerante a datos inválidos almacenados en el navegador.

## Tecnologías

- HTML
- Tailwind CSS
- JavaScript (ES6)
