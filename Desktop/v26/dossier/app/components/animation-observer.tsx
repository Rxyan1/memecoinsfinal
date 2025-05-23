"use client"

import { useEffect } from "react"

export default function AnimationObserver() {
  useEffect(() => {
    // Observer pour les animations au défilement
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Si l'élément est visible
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.1, // 10% de l'élément doit être visible
      },
    )

    // Observer tous les éléments avec la classe animate-on-scroll
    const animatedElements = document.querySelectorAll(".animate-on-scroll")
    animatedElements.forEach((element) => {
      observer.observe(element)
    })

    // Observer les barres de compétences
    const skillBars = document.querySelectorAll(".animate-width")
    skillBars.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      // Nettoyer l'observer
      animatedElements.forEach((element) => {
        observer.unobserve(element)
      })
      skillBars.forEach((element) => {
        observer.unobserve(element)
      })
    }
  }, [])

  return null
}
