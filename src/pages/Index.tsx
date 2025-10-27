import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { BasicsSection } from "@/components/BasicsSection";
import { SimulationsSection } from "@/components/SimulationsSection";
import { BackpropagationSection } from "@/components/BackpropagationSection";
import { LearnMoreSection } from "@/components/LearnMoreSection";
import { AboutAISection } from "@/components/AboutAISection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "basics", "simulations", "learn", "about"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation activeSection={activeSection} onNavigate={handleNavigate} />
      <Hero onExplore={() => handleNavigate("basics")} />
      <BasicsSection />
      <SimulationsSection />
      <BackpropagationSection />
      <LearnMoreSection />
      <AboutAISection />
      
      <footer className="py-8 px-4 border-t border-border bg-card/30">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Built with curiosity and code • Explore, learn, experiment 🧠✨</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
