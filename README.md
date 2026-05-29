# Template SEO De Landscaping or Tree Services

La plantilla está diseñada con toda la funcionalidad de ReaKtorX. La plantilla es para un diseño de árboles, paisajes, jardinería, corte de hierba, etc. 

![Logo Intersope Media](https://firebasestorage.googleapis.com/v0/b/videostock-8dab7.appspot.com/o/int%2Finterscope%20logo%20horizontal.png?alt=media&token=fa408fc8-485b-45a9-bd01-1c97fa1fa026)

<!-- ```sh
npm create astro@latest -- --template basics
``` -->
## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto, desde un terminal:

| Command                   | Action                                                         |
| :------------------------ | :------------------------------------------------------------- |
| `npm install`             | Instala las dependencias                                       |
| `npm run dev`             | Inicia el servidor de desarrollo local en`localhost:4321`      |
| `npm run build`           | Cree su sitio de producción para `./dist/`                     |



## 🚀 Estructura del proyecto

Dentro de tu proyecto, verás las siguientes carpetas y archivos:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Blocks/
│   │   ├── button/
│   │   ├── footers/
│   │   ├── header/
│   │   ├── Sliders/
│   │   ├── TransparentHeader/
│   │   └── LazyImage.tsx
│   │   └── ScrollToTopButton.tsx
│   │   └── RedesIcons.tsx
│   │   └── FixedButtonsContent.tsx
│   │   └── SiteDown.astro
│   │   └── UnderConstruction.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── hook/
│   ├── interfaces/
│   └── pages/
│       └── index.astro
│       └── about.astro
│       ├── services/
│       │   └── index.astro
│       │   └── [slug].astro
│       ├── gallery/
│       │   └── index.astro
│       │   └── [slug].astro
│       └── videos.astro
│       └── reviews.astro
│       └── contact.astro
│       └── colorpalette.astro
└── package.json
```

Astro busca archivos `.astro` o `.md` en el directorio `src/pages/`. Cada página se expone como una ruta basada en su nombre de archivo.

No hay nada especial en `src/components/`, pero es donde nos gusta poner cualquier componente Astro/React/Vue/Svelte/Preact.

Cualquier activo estático, como imágenes, puede colocarse en el directorio `public/`.



## 👀 Requisito de tomar en cuenta en ReaKtorX

### Home & About

1.1. **Primer Bloque Home:**
- Título
- Párrafo
- Dos imágenes

1.2. **Segundo Bloque Home:**
    - Título
    - Párrafo
    - Cuatro imágenes

1.3. **Bloque de Servicios Generales:**
- Título
- Párrafo

### Bloques en la sección About:

2.1. **Primer Bloque About:**
- Título
- Párrafo
- Una imagen
- Items: Professionalism, Sustainability, Security, Integrity

2.2. **Segundo Bloque About:**
- Título
- Párrafo
- Una imagen
- Items: Professionalism, Sustainability, Security, Integrity

### Bloques en la sección Blocks:

3.1. **Primer Bloque SlidesShow:**
- Título
- Párrafo
- Cantidad de imágenes deseada

3.2. **TransparenHeader - About:**
- Título
- Imagen
- Párrafo

3.3. **TransparenHeader - Services:**
- Título
- Imagen
- Párrafo

3.4. **TransparenHeader - Gallery:**
- Título
- Imagen
- Párrafo

3.5. **TransparenHeader - Contact:**
- Título
- Imagen
- Párrafo

3.6. **TransparenHeader - Videos:**
- Título
- Imagen
- Párrafo

3.7. **TransparenHeader - Reviews:**
- Título
- Imagen
- Párrafo
### Slogan
Agregar entre 6 a  10 slogan

### Imágenes Para Formulario y Contacto:
La imagen que se muestra en el formulario en la sección Home es la primera imagen de la galería.
La imagen que se muestra en la sección Contacto es la segunda imagen de la galería.
