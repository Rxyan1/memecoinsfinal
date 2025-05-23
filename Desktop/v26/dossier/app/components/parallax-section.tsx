"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxSectionProps {
  children: React.ReactNode
  intensity?: number
}

export function ParallaxSection({ children, intensity = 0.2 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * intensity])

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }} className="relative z-10">
        {children}
      </motion.div>
    </div>
  )
}
