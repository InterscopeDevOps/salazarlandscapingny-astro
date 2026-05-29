export interface Blogs {
    _id?: string; // MongoDB automatically generates this
    clientId?: string;
    keywords: string;
    seoTitle: string;
    slug: string;
    metadescription: string;
    featureimage: string | any; // Corrected the spelling here
    date: Date | string; // Dates can be strings in some contexts
    publishDate?: Date | string; // This might also be a string depending on how you handle dates
    category: string;
    autor: string;
    status?: "draft" | "published"; // Added the status field with its default value and allowed values
    description: IDescriptionBlock[]; // Use the updated interface here
    __v?: number; // Version key, optional depending on usage
}

interface IDescriptionBlock {
    type: "titleh1" | "titleh2" | "titleh3" | "text" | "img" | "list" | "video";
    value: any; // The type could be more specific depending on the expected values
    alt?: string; // Optional and specifically for 'img' type
}


export interface Description {
    _id?: string;  // De nuevo, puede ser opcional si MongoDB lo genera automáticamente
    type: DescriptionType;  // Podemos usar un tipo de unión para restringir los valores permitidos
    value: string | string[];  // Mantiene flexible la estructura de 'value'
    alt?: string;  // Opcional y específico para el tipo 'img'
}

// Tipo de unión para restricciones adicionales
export type DescriptionType =
    | "titleh1"
    | "titleh2"
    | "titleh3"
    | "text"
    | "img"
    | "list"
    | "video";