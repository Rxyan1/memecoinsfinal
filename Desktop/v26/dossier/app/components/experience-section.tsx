"use client"

import { useLanguage } from "./language-provider"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Calendar, MapPin, Briefcase } from "lucide-react"

export function ExperienceSection() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const experiences = [
    {
      company: "Ultima",
      position: "Développeur Web",
      period: "2022 - 2023",
      location: "Bordeaux & Lyon, France",
      responsibilities: [
        t("experience.ultima.resp1"),
        t("experience.ultima.resp2"),
        t("experience.ultima.resp3"),
        t("experience.ultima.resp4"),
        t("experience.ultima.resp5"),
        t("experience.ultima.resp6"),
      ],
    },
    {
      company: "Hackademic",
      position: "Développeur Full Stack",
      period: "2021 - 2022",
      location: "Bordeaux, France",
      responsibilities: [
        t("experience.hackademic.resp1"),
        t("experience.hackademic.resp2"),
        t("experience.hackademic.resp3"),
        t("experience.hackademic.resp4"),
        t("experience.hackademic.resp5"),
        t("experience.hackademic.resp6"),
        t("experience.hackademic.resp7"),
        t("experience.hackademic.resp8"),
      ],
    },
    {
      company: "Hsabati",
      position: "Développeur Front-end",
      period: "2020 - 2021",
      location: "Casablanca, Maroc",
      responsibilities: [
        t("experience.hsabati.resp1"),
        t("experience.hsabati.resp2"),
        t("experience.hsabati.resp3"),
        t("experience.hsabati.resp4"),
        t("experience.hsabati.resp5"),
        t("experience.hsabati.resp6"),
        t("experience.hsabati.resp7"),
      ],
    },
    {
      company: "Lycée Lyautey",
      position: "Gestion d'événementielle associative",
      period: "2019 - 2020",
      location: "Casablanca, Maroc",
      responsibilities: [t("experience.lyautey.resp1"), t("experience.lyautey.resp2"), t("experience.lyautey.resp3")],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="experience" className="py-16 relative" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-sky-400">{t("experience.title")}</h2>
          <div className="h-1 w-20 bg-sky-400 mx-auto" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto relative"
        >
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-400 via-sky-500 to-blue-600 z-0" />

          {experiences.map((exp, index) => (
            <motion.div key={index} variants={itemVariants} className="relative z-10 mb-8" custom={index}>
              {/* Timeline dot */}
              <div className="absolute left-4 top-7 w-4 h-4 rounded-full bg-sky-400 transform -translate-x-1/2 z-10 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />

              <div className="ml-10 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-sky-900/20 hover:border-sky-500/30">
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 mr-3">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{exp.company}</h3>
                        <p className="text-sky-400 font-medium">{exp.position}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end">
                      <div className="flex items-center text-gray-300 text-sm mb-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {exp.period}
                      </div>
                      <div className="flex items-center text-gray-400 text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {exp.location}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-sky-300 mb-3">Responsabilités:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      {exp.responsibilities.map((resp, respIndex) => (
                        <li key={respIndex} className="flex items-start text-sm">
                          <span className="text-sky-400 mr-2 mt-0.5">▹</span>
                          <span className="text-gray-300">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
