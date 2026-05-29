// Método para eliminar caracteres especiales y reemplazar los espacios con guiones
const FormatText = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[\s'&/]+/g, "-") // Reemplaza todos los espacios, comillas simples, '&' y '/' por guiones
    .replace(/[^\w-]+/g, "") // Elimina todos los caracteres que no sean palabras o guiones
    .trim()
    .replace(/^-+|-+$/g, ""); // Elimina guiones al inicio o al final del texto
};

export default FormatText;
