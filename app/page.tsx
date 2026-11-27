import fs from "fs";
import path from "path";
import PortfolioFilter from "./PortfolioFilter";
import HomeEffects from "@/components/HomeEffects";
import { site, services } from "@/lib/site-data";

export const metadata = { alternates: { canonical: "/" } };

const siteUrl = "https://www.ilikeinterior.com";

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${siteUrl}/#business`,
  name: site.brand,
  alternateName: ["별내목수", "아이라이크 인테리어", "I LIKE INTERIOR"],
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
  image: `${siteUrl}/image.jpg`,
  description:
    "남양주 별내 중심 아파트 인테리어 목공팀. 비흡연 목수팀, 25년 경력, 30~40대 젊은 팀이 직접 시공하며 실제 시공 금액을 공개합니다.",
  telephone: "+82-10-4551-9870",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+82-10-4551-9870",
    contactType: "customer service",
    availableLanguage: "ko",
  },
  areaServed: [
    { "@type": "Place", name: "남양주 별내" },
    { "@type": "AdministrativeArea", name: "서울" },
    { "@type": "AdministrativeArea", name: "경기" },
  ],
  knowsAbout: [
    "아파트 인테리어 목공",
    "TV 가벽",
    "히든도어",
    "우물천장",
    "9mm 문선",
    "맞춤가구",
    "상업공간 목공",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "목공 서비스",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.desc },
    })),
  },
  sameAs: [site.blog, site.tistory, site.instagram, site.youtube, site.kakao],
};

export default function Home() {
  const html = fs.readFileSync(path.join(process.cwd(), "content", "home.html"), "utf8");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <PortfolioFilter />
      <HomeEffects />
    </>
  );
}
