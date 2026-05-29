


//metodo para eliminar caracteres especiales y remplazar los espacio con guiones
const EliminarCaracteresEspeciales = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[\s']+/, "-") // Asegura reemplazar todos los espacios y comillas simples por guiones
        .replace(/[^\w-]+/g, "") // Elimina todos los caracteres que no sean palabras o guiones
        .trim();
};

export default EliminarCaracteresEspeciales;