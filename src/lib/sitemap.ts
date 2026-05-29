import { fetchApiData } from "./api";


export async function generateSitemapXml() {

    //posts me sale undefined
    const posts = await fetchApiData();
 


    const urls = posts?.map((post) => {
        return `
            <url>
            <loc>${post.domain}</loc>
            <lastmod>${post.modifiedDate}</lastmod>
            <priority>${post.priority}</priority>
            </url>
        `;
        }
    ).join('');
  

  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>
  `.trim();
}
