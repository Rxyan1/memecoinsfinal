"use client"

import { useLanguage } from "./language-provider"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Code, Database, BarChart3, Film, Gamepad2 } from "lucide-react"

export function ProjectsSection() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const projects = [
    {
      title: t("projects.festivals.title"),
      description: t("projects.festivals.description"),
      icon: <Code className="w-10 h-10 text-sky-400" />,
      technologies: ["React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    },
    {
      title: t("projects.blackjack.title"),
      description: t("projects.blackjack.description"),
      icon: <Gamepad2 className="w-10 h-10 text-sky-400" />,
      technologies: ["JavaScript", "HTML", "CSS", "LocalStorage"],
    },
    {
      title: t("projects.scraping.title"),
      description: t("projects.scraping.description"),
      icon: <BarChart3 className="w-10 h-10 text-sky-400" />,
      technologies: ["Python", "BeautifulSoup", "Pandas", "Matplotlib"],
    },
    {
      title: t("projects.streaming.title"),
      description: t("projects.streaming.description"),
      icon: <Film className="w-10 h-10 text-sky-400" />,
      technologies: ["React", "Node.js", "MongoDB", "Express", "AWS S3"],
    },
    {
      title: t("projects.gameServer.title"),
      description: t("projects.gameServer.description"),
      icon: <Database className="w-10 h-10 text-sky-400" />,
      technologies: ["Java", "SQL", "Maven", "Spring"],
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
    <section id="projects" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-sky-400">{t("projects.title")}</h2>
          <div className="h-1 w-20 bg-sky-400 mx-auto" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 h-full flex flex-col group p-6"
            >
              <div className="flex justify-center mb-4">{project.icon}</div>

              <div className="text-center flex-grow">
                <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 justify-center">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 text-xs rounded-full bg-gray-800 text-sky-300 border border-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
