"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "./language-provider"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Send,
  Camera,
  ShoppingBasketIcon as Basketball,
  Book,
  Wind,
  Compass,
  History,
} from "lucide-react"
import { sendEmail } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export function ContactSection() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await sendEmail(formData)
      if (result.success) {
        toast({
          title: t("contact.successMessage"),
          description: new Date().toLocaleTimeString(),
        })
        setFormData({ name: "", email: "", message: "" })
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error) {
      toast({
        title: t("contact.errorMessage"),
        description: new Date().toLocaleTimeString(),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const hobbies = [
    { name: t("hobbies.videoEditing"), icon: <Camera className="w-4 h-4" /> },
    { name: t("hobbies.basketball"), icon: <Basketball className="w-4 h-4" /> },
    { name: t("hobbies.reading"), icon: <Book className="w-4 h-4" /> },
    { name: t("hobbies.kiteSurfing"), icon: <Wind className="w-4 h-4" /> },
    { name: t("hobbies.urbex"), icon: <Compass className="w-4 h-4" /> },
    { name: t("hobbies.history"), icon: <History className="w-4 h-4" /> },
  ]

  return (
    <section id="contact" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-sky-400">{t("contact.title")}</h2>
          <div className="h-1 w-20 bg-sky-400 mx-auto" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {/* Contact Form */}
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-6">{t("contact.formTitle")}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2">
                  {t("contact.nameLabel")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t("contact.namePlaceholder")}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  {t("contact.emailLabel")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t("contact.emailPlaceholder")}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">
                  {t("contact.messageLabel")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder={t("contact.messagePlaceholder")}
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium hover:from-sky-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {t("contact.submitButton")}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-6">{t("contact.infoTitle")}</h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-gray-800 mr-4">
                  <Mail className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h4 className="text-gray-300 font-medium">{t("contact.email")}</h4>
                  <a
                    href="mailto:rayane.zangui@efrei.net"
                    className="text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    rayane.zangui@efrei.net
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-gray-800 mr-4">
                  <Phone className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h4 className="text-gray-300 font-medium">{t("contact.phone")}</h4>
                  <a href="tel:+33612345678" className="text-sky-400 hover:text-sky-300 transition-colors">
                    +33 7 87 79 00 46
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-gray-800 mr-4">
                  <MapPin className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h4 className="text-gray-300 font-medium">{t("contact.location")}</h4>
                  <p className="text-white">Bordeaux Métropole, France</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-gray-800 mr-4">
                  <Linkedin className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h4 className="text-gray-300 font-medium">{t("contact.linkedin")}</h4>
                  <a
                    href="https://linkedin.com/in/rayane-zangui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    linkedin.com/in/rayane-zangui
                  </a>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-4">{t("contact.hobbiesTitle")}</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {hobbies.map((hobby, index) => (
                <div
                  key={index}
                  className="flex items-center px-3 py-2 rounded-full bg-gray-800 text-sky-300 border border-gray-700"
                >
                  <span className="mr-2">{hobby.icon}</span>
                  {hobby.name}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
