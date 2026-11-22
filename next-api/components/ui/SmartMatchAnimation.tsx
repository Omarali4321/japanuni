'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface FloatingItem {
  id: number
  type: 'document' | 'ielts' | 'money' | 'graduation' | 'visa' | 'passport'
  x: number
  y: number
  size: number
  rotation: number
  delay: number
  duration: number
}

const itemConfigs = [
  { type: 'document' as const, emoji: '📄', label: 'Transcript' },
  { type: 'ielts' as const, emoji: '📝', label: 'IELTS 6.5+' },
  { type: 'money' as const, emoji: '💰', label: '¥800,000' },
  { type: 'graduation' as const, emoji: '🎓', label: 'Bachelor\'s' },
  { type: 'visa' as const, emoji: '🛂', label: 'Student Visa' },
  { type: 'passport' as const, emoji: '📘', label: 'Passport' },
  { type: 'document' as const, emoji: '📋', label: 'Research Plan' },
  { type: 'money' as const, emoji: '💴', label: 'Scholarship' },
  { type: 'ielts' as const, emoji: '🇬🇧', label: 'TOEFL 80+' },
  { type: 'graduation' as const, emoji: '🏫', label: 'Graduate' },
]

export function SmartMatchAnimation() {
  const [items, setItems] = useState<FloatingItem[]>([])
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      setContainerSize({ width: rect.width, height: rect.height })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return

    const generateItems = (): FloatingItem[] =>
      itemConfigs.map((config, index) => ({
        id: index,
        type: config.type,
        x: Math.random() * (containerSize.width - 80) + 40,
        y: Math.random() * (containerSize.height - 80) + 40,
        size: Math.random() * 20 + 50,
        rotation: Math.random() * 360 - 180,
        delay: Math.random() * 2,
        duration: Math.random() * 10 + 15,
      }))

    // Use requestAnimationFrame to defer state update and avoid cascading renders
    const rafId = requestAnimationFrame(() => {
      setItems(generateItems())
    })

    return () => cancelAnimationFrame(rafId)
  }, [containerSize.width, containerSize.height])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sakura-500/5 via-transparent to-indigo-500/5" />
      {items.map((item) => (
        <FloatingItemComponent
          key={item.id}
          item={item}
          containerSize={containerSize}
          emoji={itemConfigs[item.id % itemConfigs.length].emoji}
          label={itemConfigs[item.id % itemConfigs.length].label}
        />
      ))}
    </div>
  )
}

function FloatingItemComponent({
  item,
  containerSize,
  emoji,
  label,
}: {
  item: FloatingItem
  containerSize: { width: number; height: number }
  emoji: string
  label: string
}) {
  const [position, setPosition] = useState({ x: item.x, y: item.y })
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    // Initial fade in
    const fadeIn = setTimeout(() => {
      setOpacity(1)
    }, item.delay * 1000)

    // Continuous floating animation
    const animate = () => {
      const startTime = Date.now() + item.delay * 1000

      const frame = () => {
        const elapsed = (Date.now() - startTime) / 1000
        const cycle = (elapsed % item.duration) / item.duration

        // Smooth floating using sine waves
        const floatX = Math.sin(cycle * Math.PI * 2 + item.rotation * Math.PI / 180) * 30
        const floatY = Math.cos(cycle * Math.PI * 2 + item.rotation * Math.PI / 180) * 25
        const driftX = Math.sin(elapsed * 0.3) * 15
        const driftY = Math.cos(elapsed * 0.2) * 10

        const newX = Math.max(30, Math.min(containerSize.width - 30, item.x + floatX + driftX))
        const newY = Math.max(30, Math.min(containerSize.height - 30, item.y + floatY + driftY))

        setPosition({ x: newX, y: newY })
        requestAnimationFrame(frame)
      }

      frame()
    }

    const animId = requestAnimationFrame(animate)

    return () => {
      clearTimeout(fadeIn)
      cancelAnimationFrame(animId)
    }
  }, [item, containerSize])

  return (
    <motion.div
      style={{
        left: position.x,
        top: position.y,
        opacity,
      }}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000"
      animate={{ rotate: [item.rotation, item.rotation + 360] }}
      transition={{ duration: item.duration * 2, repeat: Infinity, ease: 'linear' }}
    >
      <div className="flex flex-col items-center group">
        <div
          className="flex items-center justify-center rounded-2xl shadow-lg backdrop-blur-sm border
            bg-white/80 dark:bg-ink-900/80
            border-ink-200/50 dark:border-ink-700/50
            p-3 group-hover:scale-110 transition-all duration-300
            group-hover:shadow-xl group-hover:border-sakura-500/30"
          style={{ width: item.size, height: item.size }}
        >
          <span className="text-2xl select-none" aria-hidden="true">{emoji}</span>
        </div>
        <motion.span
          className="mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium
            bg-white/90 dark:bg-ink-900/90
            border border-ink-200/50 dark:border-ink-700/50
            text-ink-800 dark:text-ink-200
            shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100
            transition-opacity duration-200 pointer-events-none"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {label}
        </motion.span>
      </div>
    </motion.div>
  )
}

export function SmartMatchAmbientGlow() {
  return (
    <div className="absolute inset-0 -z-20 pointer-events-none" aria-hidden="true">
      <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-sakura-500/10 blur-[200px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[200px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] rounded-full bg-emerald-500/5 blur-[150px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
    </div>
  )
}