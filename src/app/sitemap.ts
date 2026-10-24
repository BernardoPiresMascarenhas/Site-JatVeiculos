import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { vehicles } from "@/data/vehicles";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/estoque", "/empresa", "/contato", "/ficha-cadastral"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const cars = vehicles.map((v) => ({
    url: `${site.url}/estoque/${v.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  return [...pages, ...cars];
}
