import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | JapanUni',
  description: 'JapanUni Cookie Policy - How we use cookies and similar technologies.',
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-sakura-50 dark:bg-ink-950">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-ink-950 dark:text-ink-50 mb-4">Cookie Policy</h1>
          <p className="text-lg text-ink-600 dark:text-ink-400">Last updated: November 2024</p>
        </header>

        <div className="prose prose-ink dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">1. What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve your experience.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">2. Types of Cookies We Use</h2>
            <h3 className="text-xl font-medium text-ink-950 dark:text-ink-50 mt-4 mb-2">Essential Cookies</h3>
            <p>Required for the website to function properly. These enable core functionality like security, authentication, and accessibility.</p>
            <h3 className="text-xl font-medium text-ink-950 dark:text-ink-50 mt-4 mb-2">Analytics Cookies</h3>
            <p>Help us understand how visitors interact with our site by collecting anonymous usage data. We use this to improve our content and user experience.</p>
            <h3 className="text-xl font-medium text-ink-950 dark:text-ink-50 mt-4 mb-2">Preference Cookies</h3>
            <p>Remember your settings like language preference, theme (light/dark mode), and region to provide a personalized experience.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">3. Specific Cookies</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-ink-200 dark:border-ink-700">
                  <th className="text-left p-3 font-semibold">Cookie Name</th>
                  <th className="text-left p-3 font-semibold">Purpose</th>
                  <th className="text-left p-3 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-100 dark:border-ink-800">
                  <td className="p-3 font-mono text-sm">next-auth.callback-url</td>
                  <td className="p-3">Authentication redirect</td>
                  <td className="p-3">Session</td>
                </tr>
                <tr className="border-b border-ink-100 dark:border-ink-800">
                  <td className="p-3 font-mono text-sm">next-auth.csrf-token</td>
                  <td className="p-3">CSRF protection</td>
                  <td className="p-3">Session</td>
                </tr>
                <tr className="border-b border-ink-100 dark:border-ink-800">
                  <td className="p-3 font-mono text-sm">theme</td>
                  <td className="p-3">Dark/light mode preference</td>
                  <td className="p-3">1 year</td>
                </tr>
                <tr className="border-b border-ink-100 dark:border-ink-800">
                  <td className="p-3 font-mono text-sm">locale</td>
                  <td className="p-3">Language preference</td>
                  <td className="p-3">1 year</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">4. Third-Party Cookies</h2>
            <p>We may use third-party services (e.g., analytics providers) that set their own cookies. These are governed by their respective privacy policies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">5. Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that disabling essential cookies may break site functionality.</p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-sakura-600 hover:underline">Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies" target="_blank" rel="noopener noreferrer" className="text-sakura-600 hover:underline">Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-sakura-600 hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-sakura-600 hover:underline">Edge</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">6. Your Consent</h2>
            <p>By continuing to use JapanUni, you consent to our use of cookies as described in this policy. You can withdraw consent by adjusting your browser settings.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">7. Changes to This Policy</h2>
            <p>We may update this Cookie Policy to reflect changes in our practices. We will post any changes on this page with an updated date.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">8. Contact Us</h2>
            <p>If you have questions about our use of cookies, please <a href="/contact" className="text-sakura-600 hover:underline">contact us</a>.</p>
          </section>
        </div>
      </div>
    </main>
  )
}