import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { seoAlternates } from '@/lib/seo'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

export function generateMetadata({ params: { locale } }: { params: { locale: string } }): Metadata {
  return {
    ...baseMetadata,
    alternates: seoAlternates(locale, '/api-docs'),
  }
}

const baseMetadata: Metadata = {
  title: 'API Documentation',
  description: 'JapanUni public API documentation for developers. Access university data, scholarships, guides, and more.',
}

const endpoints = [
  {
    category: 'Universities',
    items: [
      { method: 'GET', path: '/api/universities', description: 'List universities with pagination, search, and filters', auth: false },
      { method: 'GET', path: '/api/universities/:id', description: 'Get detailed university information', auth: false },
      { method: 'GET', path: '/api/universities/compare', description: 'Compare multiple universities side-by-side', auth: false },
      { method: 'GET', path: '/api/universities/match', description: 'Smart match universities based on preferences', auth: false },
      { method: 'GET', path: '/api/universities/:id/reviews', description: 'Get reviews for a university', auth: false },
      { method: 'POST', path: '/api/universities/:id/reviews', description: 'Submit a review (requires auth)', auth: true },
    ],
  },
  {
    category: 'Scholarships',
    items: [
      { method: 'GET', path: '/api/scholarships', description: 'List scholarships with pagination and filters', auth: false },
      { method: 'GET', path: '/api/scholarships/:id', description: 'Get detailed scholarship information', auth: false },
    ],
  },
  {
    category: 'Guides',
    items: [
      { method: 'GET', path: '/api/guides/admission', description: 'List admission guides', auth: false },
      { method: 'GET', path: '/api/guides/visa', description: 'List visa guides', auth: false },
      { method: 'GET', path: '/api/guides/search', description: 'Search guides by keyword', auth: false },
    ],
  },
  {
    category: 'Favorites (Auth Required)',
    items: [
      { method: 'GET', path: '/api/favorites', description: 'Get current user\'s favorite universities', auth: true },
      { method: 'POST', path: '/api/favorites/:universityId', description: 'Add university to favorites', auth: true },
      { method: 'DELETE', path: '/api/favorites/:universityId', description: 'Remove university from favorites', auth: true },
    ],
  },
  {
    category: 'Reviews (Auth Required)',
    items: [
      { method: 'GET', path: '/api/reviews/:reviewId', description: 'Get a specific review', auth: false },
      { method: 'PATCH', path: '/api/reviews/:reviewId', description: 'Update a review (owner only)', auth: true },
      { method: 'DELETE', path: '/api/reviews/:reviewId', description: 'Delete a review (owner only)', auth: true },
    ],
  },
  {
    category: 'User',
    items: [
      { method: 'GET', path: '/api/users/me', description: 'Get current user profile', auth: true },
    ],
  },
  {
    category: 'Health & Admin',
    items: [
      { method: 'GET', path: '/api/health', description: 'Health check endpoint', auth: false },
      { method: 'GET', path: '/api/admin/stats', description: 'Platform statistics (admin only)', auth: true },
    ],
  },
]

const authInfo = `
### Authentication

JapanUni API uses **cookie-based authentication** with HttpOnly secure cookies. 

To authenticate:
1. User logs in via \`/login\` (sets session cookie)
2. Include \`credentials: 'include'\` in fetch requests
3. Session persists across browser sessions

\`\`\`javascript
// Example authenticated request
const response = await fetch('/api/favorites', {
  credentials: 'include', // Required for cookie auth
})
const favorites = await response.json()
\`\`\`

**Rate Limiting**: 100 requests/minute per IP for public endpoints, 60 requests/minute for authenticated endpoints.

**Error Format**:
\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
\`\`\`
`

export default function APIDocsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">API Documentation</h1>
        <p className="mt-3 max-w-2xl text-ink-800/60 dark:text-ink-50/60">
          JapanUni public API for developers. Access university data, scholarships, guides, and more.
        </p>
      </FadeIn>

      <SlideUp delay={0.1} className="mt-10">
        <div className="glass-card p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold mb-4">Authentication</h2>
          <div className="prose prose-invert max-w-none text-sm">
            {authInfo.split('\n').map((line, i) => (
              <p key={i} className="whitespace-pre-wrap font-mono text-xs">{line}</p>
            ))}
          </div>
        </div>
      </SlideUp>

      <SlideUp delay={0.2} className="mt-10">
        <StaggerContainer staggerDelay={0.1} className="space-y-8">
          {endpoints.map((category, catIndex) => (
            <StaggerItem key={category.category} customDelay={catIndex * 0.05}>
              <div className="glass-card overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="font-display text-xl font-semibold">{category.category}</h2>
                </div>
                <div className="divide-y divide-white/10">
                  {category.items.map((endpoint) => (
                    <div key={endpoint.path} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/5 dark:hover:bg-ink-800/50 transition-colors">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                        endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                        endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                        endpoint.method === 'PATCH' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-sm bg-white/5 dark:bg-ink-800/50 px-3 py-1 rounded flex-1 sm:w-64 truncate">{endpoint.path}</code>
                      <p className="text-sm text-ink-800/70 dark:text-ink-50/70 flex-1">{endpoint.description}</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        endpoint.auth ? 'bg-sakura-500/20 text-sakura-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {endpoint.auth ? 'Auth Required' : 'Public'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </SlideUp>

      <SlideUp delay={0.3} className="mt-10">
        <div className="glass-card p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold mb-4">Example: Search Universities</h2>
          <pre className="bg-ink-950 dark:bg-ink-900 rounded-xl p-4 overflow-x-auto text-sm">
{`// Search universities in Tokyo with English programs
const params = new URLSearchParams({
  search: 'Tokyo',
  language: 'English',
  page: '0',
  size: '10'
})

const response = await fetch(\`/api/universities?\${params}\`, {
  credentials: 'include'
})

const { data, pagination } = await response.json()

// data: University[]
// pagination: { page, size, total, totalPages }`}
          </pre>
        </div>
      </SlideUp>

      <SlideUp delay={0.4} className="mt-10">
        <div className="glass-card p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold mb-4">Example: Add to Favorites</h2>
          <pre className="bg-ink-950 dark:bg-ink-900 rounded-xl p-4 overflow-x-auto text-sm">
{`// Requires authentication (login first)
const universityId = 123

const response = await fetch(\`/api/favorites/\${universityId}\`, {
  method: 'POST',
  credentials: 'include' // Cookie auth required
})

if (response.ok) {
  const { message } = await response.json()
  console.log(message) // "Added to favorites"
}`}
          </pre>
        </div>
      </SlideUp>
    </div>
  )
}