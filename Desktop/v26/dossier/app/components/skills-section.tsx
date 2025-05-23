"use client"

import { useLanguage } from "./language-provider"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Code, Database, Globe, Server, Lightbulb } from "lucide-react"

export function SkillsSection() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const frontendSkills = [
    { name: "HTML/CSS", level: 90 },
    { name: "JavaScript", level: 85 },
    { name: "React", level: 80 },
    { name: "Next.js", level: 75 },
    { name: "Tailwind CSS", level: 85 },
  ]

  const backendSkills = [
    { name: "Node.js", level: 75 },
    { name: "Express", level: 70 },
    { name: "Python", level: 65 },
    { name: "PHP", level: 60 },
    { name: "Java", level: 55 },
  ]

  const databaseSkills = [
    { name: "MySQL", level: 80 },
    { name: "MongoDB", level: 70 },
    { name: "PostgreSQL", level: 65 },
    { name: "Firebase", level: 60 },
  ]

  const otherSkills = [
    { name: "Git", level: 85 },
    { name: "Docker", level: 60 },
    { name: "RESTful API", level: 80 },
    { name: "GraphQL", level: 65 },
    { name: "Agile/Scrum", level: 75 },
  ]

  const softSkills = [
    t("skills.curious"),
    t("skills.creative"),
    t("skills.versatile"),
    "Teamwork",
    "Problem Solving",
    "Communication",
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
    <section id="skills" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-sky-400">{t("skills.title")}</h2>
          <div className="h-1 w-20 bg-sky-400 mx-auto" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {/* Frontend Skills */}
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-gray-800 mr-4">
                <Code className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">{t("skills.frontend")}</h3>
            </div>

            <div className="space-y-4">
              {frontendSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Backend Skills */}
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-gray-800 mr-4">
                <Server className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">{t("skills.backend")}</h3>
            </div>

            <div className="space-y-4">
              {backendSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Database Skills */}
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-gray-800 mr-4">
                <Database className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">{t("skills.database")}</h3>
            </div>

            <div className="space-y-4">
              {databaseSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Other Skills */}
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-gray-800 mr-4">
                <Server className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">{t("skills.other")}</h3>
            </div>

            <div className="space-y-4">
              {otherSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-gray-800 mr-4">
                <Globe className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">{t("skills.languages")}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">{t("skills.french")}</span>
                  <span className="text-gray-400">100%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "100%" } : {}}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">{t("skills.english")}</span>
                  <span className="text-gray-400">80%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "80%" } : {}}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">{t("skills.arabic")}</span>
                  <span className="text-gray-400">100%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "100%" } : {}}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Soft Skills */}
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-gray-800 mr-4">
                <Lightbulb className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">{t("skills.soft")}</h3>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {softSkills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="px-4 py-2 rounded-full bg-gray-800 text-sky-300 border border-gray-700"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
