import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/history', '/assessment', '/profile'],
    },
    sitemap: 'https://mindcare.vercel.app/sitemap.xml',
  };
}
