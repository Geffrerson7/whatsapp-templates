# Generador de Plantillas para WhatsApp

Una aplicación web sencilla desarrollada con JavaScript para crear, administrar y utilizar plantillas reutilizables de mensajes para WhatsApp.

## Características

- Crear plantillas de mensajes reutilizables.
- Almacenar las plantillas en un estado centralizado de la aplicación.
- Mostrar las plantillas como tarjetas.
- Generar mensajes personalizados reemplazando las variables de la plantilla.
- Copiar los mensajes generados al portapapeles.

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
  "#ventas"
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
mensaje
  .replaceAll("{nombre}", nombre)
  .replaceAll("{producto}", producto);
```

Se utiliza para generar mensajes personalizados reemplazando las variables de la plantilla con los valores proporcionados por el usuario.

## Tecnologías

- HTML
- Tailwind CSS
- JavaScript (ES6)
```