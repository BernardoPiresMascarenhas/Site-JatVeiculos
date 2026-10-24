import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** Conceito de portfólio: bloqueia indexação enquanto não for o site oficial. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: site.concept.enabled ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
