// Tipos TypeScript para el modelo de blogs (sin Mongoose)
// Estas interfaces reflejan la estructura documentada en el antiguo schema.

export type DescriptionBlockType =
  | "titleh1"
  | "titleh2"
  | "titleh3"
  | "titleh4"
  | "text"
  | "img"
  | "list"
  | "video";

export interface DescriptionBlock {
  type: DescriptionBlockType;
  // El contenido puede ser string, array, objeto, etc. Mantenerlo flexible.
  value: unknown;
  // Solo necesario para imágenes; opcional en la interfaz.
  alt?: string;
}

export type BlogStatus = "draft" | "published";

export interface Blog {
  // Campos básicos
  _id?: string; // id retornado por la API
  clientId?: string;
  keywords?: string;
  seoTitle?: string;
  slug?: string;
  metadescription?: string;
  featureimage?: string;
  date?: string | Date;
  publishDate?: string | Date;
  category?: string;
  autor?: string;
  status?: BlogStatus;
  // Contenido estructurado compuesto por bloques
  description?: DescriptionBlock[];
}

// Respuesta de la API pública: lista de blogs con paginación
export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface BlogsListResponse {
  data: Blog[];
  pagination: Pagination;
}

export interface SingleBlogResponse extends Blog {}

// Utilidad: función de parseo/normalización opcional (no obligatoria)
export function normalizeBlog(raw: any): Blog {
  if (!raw || typeof raw !== "object") return {} as Blog;
  return {
    _id: raw._id || raw.id || undefined,
    clientId: raw.clientId,
    keywords: raw.keywords,
    seoTitle: raw.seoTitle,
    slug: raw.slug,
    metadescription: raw.metadescription,
    featureimage: raw.featureimage,
    date: raw.date,
    publishDate: raw.publishDate,
    category: raw.category,
    autor: raw.autor,
    status: raw.status,
    description: Array.isArray(raw.description) ? raw.description : undefined,
  };
}
