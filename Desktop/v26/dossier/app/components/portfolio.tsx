"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { SkillsSection } from "./skills-section"
import { ProjectsSection } from "./projects-section"
import { LanguageProvider, useLanguage } from "./language-provider"
import { Navbar } from "./navbar"
import { HeroSection } from "./hero-section"
import { ExperienceSection } from "./experience-section"
import { EducationSection } from "./education-section"
import { ContactSection } from "./contact-section"
import { Footer } from "./footer"
import { MouseTrail } from "./mouse-trail"
import { ThemeProvider } from "@/components/theme-provider"

// Composant interne qui utilise useLanguage
function PortfolioContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const aboutRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  // Effet pour suivre le défilement et mettre à jour la section active
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Déterminer quelle section est actuellement visible
      const sections = [
        { ref: aboutRef, id: "about" },
        { ref: skillsRef, id: "skills" },
        { ref: experienceRef, id: "experience" },
        { ref: projectsRef, id: "projects" },
        { ref: contactRef, id: "contact" },
      ]

      // Trouver la section la plus proche du haut de l'écran
      const currentSection = sections.reduce((closest, section) => {
        if (!section.ref.current) return closest

        const sectionTop = section.ref.current.getBoundingClientRect().top
        const closestTop = closest?.ref.current?.getBoundingClientRect().top || Number.POSITIVE_INFINITY

        // Si la section est au-dessus du milieu de l'écran et plus proche que la section actuelle
        if (sectionTop < window.innerHeight / 2 && (Math.abs(sectionTop) < Math.abs(closestTop) || closestTop > 0)) {
          return section
        }

        return closest
      }, sections[0])

      setActiveSection(currentSection.id)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Appel initial

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Effet pour s'assurer que le composant est correctement monté
  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Fonction pour changer de langue
  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr")
  }

  // Hide loading indicator after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="portfolio-container">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-container">
      <MouseTrail />
      <Navbar />

      <main>
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <EducationSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  )
}

// Composant principal qui fournit les providers
export default function Portfolio() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <PortfolioContent />
      </LanguageProvider>
    </ThemeProvider>
  )
}
