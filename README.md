# WhatsApp Template Generator

A simple web application built with JavaScript to create, manage, and use reusable WhatsApp message templates.

## Features

* Create reusable message templates.
* Store templates in a centralized application state.
* Display templates as cards.
* Generate personalized messages by replacing template variables.
* Copy generated messages to the clipboard.

## `Template` Class

The `Template` class represents a single WhatsApp message template.

Each instance stores:

* **`titulo`**: The template title.
* **`mensaje`**: The message content, which may contain variables such as `{nombre}` and `{producto}`.
* **`hashtag`**: The associated hashtag.
* **`fecha`**: The creation date, automatically assigned when the template is created.

Example:

```javascript
const plantilla = new Template(
  "Welcome",
  "Hello {nombre}, thanks for purchasing {producto}.",
  "#sales"
);
```

## JavaScript String Methods Used

### `trim()`

Removes leading and trailing whitespace from user input.

Example:

```javascript
titulo.value.trim();
```

Used to:

* Clean the title.
* Clean the message.
* Clean the hashtag.
* Clean the values entered for template variables.

---

### `toLowerCase()`

Converts the hashtag to lowercase.

Example:

```javascript
texto.toLowerCase();
```

Used to ensure hashtags always have a consistent format.

---

### `startsWith()`

Checks whether the hashtag already starts with `#`.

Example:

```javascript
texto.startsWith("#");
```

Used to avoid adding multiple `#` symbols.

---

### `length`

Returns the number of characters in a string.

Example:

```javascript
mensaje.length;
```

Used to display the character count for each template.

---

### `slice()`

Extracts part of a string.

Example:

```javascript
mensaje.slice(0, 60);
```

Used to truncate long messages so template cards remain compact.

---

### `replaceAll()`

Replaces every occurrence of a substring.

Example:

```javascript
mensaje
  .replaceAll("{nombre}", nombre)
  .replaceAll("{producto}", producto);
```

Used to generate personalized messages by replacing template variables with user-provided values.

## Technologies

* HTML5
* Tailwind CSS
* JavaScript (ES6)
