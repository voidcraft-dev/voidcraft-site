import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { FluidBackground } from "@/components/fluid-background";
import {
  fetchHero,
  fetchProductsMatrix,
  fetchFeatures,
  fetchCta,
  type LandingHeroData,
  type ProductsMatrixData,
  type LandingFeaturesData,
  type LandingCtaData,
} from "@/lib/cms";
import {
  fallbackHero,
  fallbackProducts,
  fallbackFeatures,
  fallbackCta,
} from "@/lib/fallback-data";

async function getCmsData() {
  try {
    const [heroPage, productsPage, featuresPage, ctaPage] = await Promise.all([
      fetchHero("voidcraft-site"),
      fetchProductsMatrix("voidcraft-site"),
      fetchFeatures("voidcraft-site"),
      fetchCta("voidcraft-site"),
    ]);
    return {
      hero: heroPage.content.data,
      products: productsPage.content.data,
      features: featuresPage.content.data,
      cta: ctaPage.content.data,
    };
  } catch {
    // TODO: 主人在 admin 录入数据后删除 fallback 逻辑
    console.warn("[CMS] Fetch failed, using fallback data");
    return {
      hero: fallbackHero,
      products: fallbackProducts,
      features: fallbackFeatures,
      cta: fallbackCta,
    };
  }
}

export default async function Home() {
  const { hero, products, features, cta } = await getCmsData();

  return (
    <>
      <ScrollProgress />
      <FluidBackground />
      <Navbar />
      <main id="main-content" className="relative z-10 flex-1">
        <Hero data={hero} />
        <Projects data={products} />
        <Skills data={features} />
        <Contact data={cta} />
      </main>
      <Footer />
    </>
  );
}
