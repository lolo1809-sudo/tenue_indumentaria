export const procesarLinkMaps = (input) => {
  if (!input || typeof input !== "string") return "";

  const limpio = input.trim();

  // Caso 1: El usuario pegó todo el código <iframe> completo
  // Ejemplo: <iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>
  const matchIframe = limpio.match(/src=["'](https:\/\/www\.google\.com\/maps\/embed[^"']+)["']/i);
  if (matchIframe && matchIframe[1]) {
    return matchIframe[1];
  }

  // Caso 2: El usuario pegó directamente la URL limpia del embed
  // Ejemplo: https://www.google.com/maps/embed?pb=...
  if (limpio.startsWith("https://www.google.com/maps/embed")) {
    return limpio;
  }

  // Si no cumple ninguna, es inválido (ej: pegó un link normal de Maps o texto cualquiera)
  return null;
};
