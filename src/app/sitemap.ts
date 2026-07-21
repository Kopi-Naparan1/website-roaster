import { MetadataRoute } from "next";
import { redis } from "@/app/lib/redis";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://website-roaster-weld.vercel.app/";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const shareIds: string[] = await redis.smembers("all-share-ids");

  const shareRoutes: MetadataRoute.Sitemap = shareIds.map((id) => ({
    url: `${baseUrl}/r/${id}`,
    lastModified: new Date(),
    changeFrequency: "never",
    priority: 0.7,
  }));

  return [...staticRoutes, ...shareRoutes];
}
