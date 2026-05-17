import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 glass mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-xl font-bold text-sakura-500">JapanUni</Link>
            <p className="mt-3 text-sm text-ink-800/60 dark:text-ink-50/60 max-w-md">
              Your gateway to studying in Japan. Explore universities, scholarships, visa guides, and student life.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-ink-800/60 dark:text-ink-50/60">
              <li><Link to="/universities" className="hover:text-sakura-500">Universities</Link></li>
              <li><Link to="/match" className="hover:text-sakura-500">Smart Match</Link></li>
              <li><Link to="/scholarships" className="hover:text-sakura-500">Scholarships</Link></li>
              <li><Link to="/admission" className="hover:text-sakura-500">Admission Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-ink-800/60 dark:text-ink-50/60">
              <li><Link to="/visa" className="hover:text-sakura-500">Visa Guide</Link></li>
              <li><Link to="/student-life" className="hover:text-sakura-500">Student Life</Link></li>
              <li><Link to="/dashboard" className="hover:text-sakura-500">Dashboard</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-ink-800/40 dark:text-ink-50/40">
          © {new Date().getFullYear()} JapanUni. Built for students dreaming of Japan.
        </p>
      </div>
    </footer>
  )
}
