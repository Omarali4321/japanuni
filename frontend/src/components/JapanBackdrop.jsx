import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const pageBackdrops = [
  { match: '/universities', image: '/japan-backdrop-fuji.jpg', position: 'center' },
  { match: '/match', image: '/japan-backdrop-kyoto.jpg', position: 'center' },
  { match: '/scholarships', image: '/japan-backdrop-sakura.jpg', position: 'center' },
  { match: '/admission', image: '/japan-backdrop-fushimi.jpg', position: 'center' },
  { match: '/visa', image: '/japan-backdrop-shibuya.jpg', position: 'center' },
  { match: '/student-life', image: '/japan-backdrop-life.jpg', position: 'center' },
  { match: '/compare', image: '/japan-backdrop-tokyo.jpg', position: 'center' },
  { match: '/dashboard', image: '/japan-backdrop-kyoto.jpg', position: 'center' },
  { match: '/login', image: '/japan-backdrop-shibuya.jpg', position: 'center' },
  { match: '/register', image: '/japan-backdrop-sakura.jpg', position: 'center' },
  { match: '/', image: '/japan-backdrop-fuji.jpg', position: 'center' },
]

function getBackdrop(pathname) {
  return pageBackdrops.find((item) => pathname === item.match || pathname.startsWith(`${item.match}/`)) || pageBackdrops.at(-1)
}

export default function JapanBackdrop() {
  const [progress, setProgress] = useState(0)
  const { pathname } = useLocation()
  const backdrop = getBackdrop(pathname)

  if (pathname.startsWith('/universities/')) {
    return null
  }

  useEffect(() => {
    let frame = 0

    const updateProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const next = scrollable > 0 ? window.scrollY / scrollable : 0
        setProgress(Math.min(1, Math.max(0, next)))
      })
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <img
        key={backdrop.image}
        src={backdrop.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-x-[-4%] top-[-7%] h-[114%] w-[108%] object-cover will-change-transform transition-[filter,opacity,transform] duration-500 ease-out"
        style={{
          filter: `blur(${progress * 10}px) saturate(${1.08 - progress * 0.22})`,
          objectPosition: backdrop.position,
          opacity: 1,
          transform: `translate3d(0, ${progress * -56}px, 0) scale(${1.05 + progress * 0.05})`,
        }}
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,16,0.18),rgba(5,7,16,0.34)_46%,rgba(5,7,16,0.78)_100%),linear-gradient(90deg,rgba(5,7,16,0.26),rgba(5,7,16,0.06)_42%,rgba(5,7,16,0.28))]"
        style={{ opacity: 0.92 + progress * 0.22 }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.14),transparent_22%),radial-gradient(circle_at_74%_10%,rgba(224,75,111,0.12),transparent_34%)]" />
    </div>
  )
}
