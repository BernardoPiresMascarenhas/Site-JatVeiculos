import { ContactSection } from "@/components/home/ContactSection";
import { BrandShowcase } from "@/components/home/BrandShowcase";
import { FeaturedVehicles } from "@/components/home/FeaturedVehicles";
import { GoogleReviews } from "@/components/home/GoogleReviews";
import { Heritage } from "@/components/home/Heritage";
import { Hero } from "@/components/home/Hero";
import { InstagramStrip } from "@/components/home/InstagramStrip";
import { QuickSearch } from "@/components/home/QuickSearch";
import { Services } from "@/components/home/Services";
import { Showroom } from "@/components/home/Showroom";
import { site } from "@/config/site";
import { resolveMedia } from "@/lib/media";

// Dados estruturados apenas com informações verificadas no site oficial.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: site.name,
  foundingDate: "1995-05",
  telephone: "+55-31-3286-6769",
  email: site.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    addressCountry: "BR",
  },
  openingHours: "Mo-Sa 08:00-18:00",
  sameAs: [site.social.instagram, site.social.facebook],
};

export default function HomePage() {
  const hero = resolveMedia("hero");
  const heroImage = hero.status === "pending" ? null : { src: hero.src, alt: hero.alt };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {heroImage && <Hero image={heroImage} caption={hero.status === "fallback" ? hero.caption : "Estoque JAT Veículos"} />}
      <QuickSearch />
      <BrandShowcase />
      <FeaturedVehicles />
      <Showroom />
      <Heritage />
      <Services />
      <InstagramStrip />
      <GoogleReviews />
      <ContactSection />
    </>
  );
}
