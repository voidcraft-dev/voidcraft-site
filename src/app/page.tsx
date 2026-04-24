import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { FluidBackground } from "@/components/fluid-background";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <FluidBackground />
      <Navbar />
      <main id="main-content" className="relative z-10 flex-1">
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
