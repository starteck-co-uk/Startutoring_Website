import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/portal/admin', '/portal/dashboard', '/api/'],
      },
    ],
    sitemap: 'https://startutoring.uk/sitemap.xml',
  };
}
