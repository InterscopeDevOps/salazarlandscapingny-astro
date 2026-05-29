import fetch from 'node-fetch';
import type { Service, LandingLocation, LandingsGallery, ApiData } from '../interfaces/dbData';
import { formatDomain } from './formatDomain';
import type { Blogs } from '@/interfaces/dbBlog';

interface SitemapEntry {
  domain: string;
  modifiedDate: string;
  priority: number;
}

export async function fetchApiData(): Promise<SitemapEntry[]> {
  const response = await fetch(
    //isar import.meta.env.API_URL concatenado con API_KEY
    `${import.meta.env.API_URL}/${import.meta.env.API_KEY}`
  );

  const responseBlogs = await fetch(
    `${import.meta.env.API_URL_BLOG}/${import.meta.env.API_KEY}`)


  if (!response.ok) {
    throw new Error('Error al obtener datos de la API');
  }



  const apiResponse = (await response.json()) as ApiData;
  const formattedDomain = formatDomain(apiResponse.domain); // Formatea el dominio
  const currentDateISO = new Date().toISOString(); // Fecha y hora actuales en formato ISO

  // Intenta obtener los blogs
  let apiResponseBlogs: Blogs[] = [];
  if (responseBlogs.ok) {
    const tempBlogs = (await responseBlogs.json()) as Blogs[];
    // Filtra solo los blogs con estado "published"
    apiResponseBlogs = tempBlogs.filter(blog => blog.status === "published");
  } else {
    console.log('No se pudieron obtener datos de blogs o no existen.');
  }

  // Rutas predeterminadas
  const paths = ['/', '/404'];

  // Construye las entradas del sitemap para las rutas predeterminadas
  const sitemapEntries: SitemapEntry[] = paths.map((path, index) => ({
    domain: `${formattedDomain}${path.substring(1)}`, // Asegurarse de no duplicar el /
    modifiedDate: currentDateISO,
    priority: index === 0 ? 1.0 : 0.8, // Asignar prioridad 1.0 al primer elemento (inicio)
  }));


  // Función auxiliar para formatear títulos a URL amigables
  const formatTitleToPathServices = (title: string) =>
    `services/${title.replace(/\s+/g, '-').toLowerCase()}`;

  const formatTitleToPathGallery = (title: string) =>
    `gallery/${title.replace(/\s+/g, '-').toLowerCase()}`;


      //añadir ruta por defecto si no es onePages
  if (!apiResponse.widgets?.onePages) {
    const defaultRoutes = ['/about', '/services', '/gallery', '/contact'];
    defaultRoutes.forEach((route) => {
      sitemapEntries.push({
        domain: `${formattedDomain}${route.substring(1)}`,
        modifiedDate: currentDateISO,
        priority: 0.8,
      });
    });
  }
  // añadir si pages de reviews
  if (apiResponse.reviews?.stateReviews && apiResponse.reviews?.viewAll && !apiResponse.widgets?.onePages) {
    sitemapEntries.push({
      domain: `${formattedDomain}reviews`,
      modifiedDate: currentDateISO,
      priority: 0.8,
    });
  }

  // añadir si pages de videos
  if (apiResponse.widgets?.landingVideos && !apiResponse.widgets?.onePages) {
    sitemapEntries.push({
      domain: `${formattedDomain}videos`,
      modifiedDate: currentDateISO,
      priority: 0.8,
    });
  }

  // Añadir rutas de servicios si landingServices está activo
  if (!apiResponse.widgets?.onePages && apiResponse.widgets?.landingServices) {
    apiResponse.services.forEach((service: Service) => {
      const servicePath = formatTitleToPathServices(service.title);
      sitemapEntries.push({
        domain: `${formattedDomain}${servicePath}`,
        modifiedDate: currentDateISO,
        priority: 0.8,
      });
    });
  }
  


  // Añadir rutas de áreas que sirves si areasWeServe está activo
  if (apiResponse.widgets?.areasweserve && !apiResponse.widgets?.onePages) {
    apiResponse.landingLocations?.forEach((location: LandingLocation) => {
      const locationPath = `areas-we-serve/${location.slug}`;
      sitemapEntries.push({
        domain: `${formattedDomain}${locationPath}`,
        modifiedDate: currentDateISO,
        priority: 0.8,
      });
    });
  }

  // Añadir rutas de la galería de aterrizaje si landingGallery está activo
  if (apiResponse.widgets?.landingGallery && !apiResponse.widgets?.onePages) {
    apiResponse.landingsGallery.forEach((gallery: LandingsGallery) => {
      const galleryPath = formatTitleToPathGallery(gallery.nameLanding);
      sitemapEntries.push({
        domain: `${formattedDomain}${galleryPath}`,
        modifiedDate: currentDateISO,
        priority: 0.8, // Considerar ajustar la prioridad según la importancia de la página
      });
    });
  }

  if (!apiResponse.widgets?.onePages && apiResponse.widgets?.blog && apiResponseBlogs.length > 0) {
    apiResponseBlogs.forEach((blog: any) => {
      const blogPath = `blog/${blog.slug}`;
      sitemapEntries.push({
        domain: `${formattedDomain}${blogPath}`,
        modifiedDate: currentDateISO,
        priority: 0.8, // Considerar ajustar la prioridad según la importancia de la página
      });
    });
  }

  return sitemapEntries;
}
