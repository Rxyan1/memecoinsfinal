"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function MouseTrail() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", mouseMove)

    return () => {
      window.removeEventListener("mousemove", mouseMove)
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
    },
    text: {
      height: 150,
      width: 150,
      x: mousePosition.x - 75,
      y: mousePosition.y - 75,
      backgroundColor: "rgba(56, 189, 248, 0.1)",
      mixBlendMode: "difference",
    },
  }

  return (
    <>
      <motion.div
        className="cursor-dot"
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 700,
          mass: 0.5,
        }}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "rgba(56, 189, 248, 0.6)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      <motion.div
        className="cursor-ring"
        animate={{
          x: mousePosition.x - 32,
          y: mousePosition.y - 32,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.8,
        }}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "2px solid rgba(56, 189, 248, 0.3)",
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />
    </>
  )
}
