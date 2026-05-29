import { generateSitemapXml } from '../lib/sitemap';

export const GET = async () => {
  const sitemap = await generateSitemapXml();
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
