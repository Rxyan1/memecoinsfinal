"use client"

import { useLanguage } from "./language-provider"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { GraduationCap, Calendar } from "lucide-react"

export function EducationSection() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const education = [
    {
      degree: t("education.bachelor.degree"),
      institution: "EFREI Paris",
      period: "2021 - 2024",
      details: t("education.bachelor.details"),
    },
    {
      degree: t("education.baccalaureate.degree"),
      institution: "Lycée Lyautey",
      period: "2018 - 2021",
      details: t("education.baccalaureate.details"),
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="education" className="py-16 relative" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-sky-400">{t("education.title")}</h2>
          <div className="h-1 w-20 bg-sky-400 mx-auto" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          {education.map((edu, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-900 rounded-xl p-4 border border-gray-800 shadow-lg mb-4"
            >
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-gray-800 mr-3 mt-1">
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-3 h-3 mr-1" />
                      {edu.period}
                    </div>
                  </div>
                  <h4 className="text-base font-medium text-sky-400 mb-2">{edu.institution}</h4>
                  <p className="text-gray-300 text-sm">{edu.details}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
