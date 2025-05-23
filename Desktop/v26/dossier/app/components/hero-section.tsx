"use client"

import { useLanguage } from "./language-provider"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"

export function HeroSection() {
  const { t } = useLanguage()

  const scrollToNext = () => {
    const skillsSection = document.getElementById("skills")
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text"
          >
            Rayane Zangui
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl font-medium mb-6 text-gray-300"
          >
            {t("hero.jobTitle")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg mb-8 text-gray-400 max-w-2xl mx-auto"
          >
            {t("hero.introduction")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              onClick={scrollToNext}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium hover:from-sky-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              {t("hero.exploreButton")}
            </button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToNext}
      >
        <ArrowDown className="w-6 h-6 text-sky-400" />
      </motion.div>
    </section>
  )
}
