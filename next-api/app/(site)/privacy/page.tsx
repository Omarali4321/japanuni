import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | JapanUni',
  description: 'JapanUni Privacy Policy - How we collect, use, and protect your personal data.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-sakura-50 dark:bg-ink-950">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-ink-950 dark:text-ink-50 mb-4">Privacy Policy</h1>
          <p className="text-lg text-ink-600 dark:text-ink-400">Last updated: November 2024</p>
        </header>

        <div className="prose prose-ink dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, save favorites, or contact us. This may include your name, email address, and preferences.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, personalize your experience, and communicate with you about universities, scholarships, and visa guidance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">3. Data Sharing</h2>
            <p>We do not sell your personal data. We may share information with trusted service providers who help us operate our platform, and when required by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or disclosure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. You can manage your account settings or contact us to exercise these rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">6. Cookies</h2>
            <p>We use cookies and similar technologies to enhance your experience. See our <a href="/cookies" className="text-sakura-600 hover:underline">Cookie Policy</a> for details.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">7. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">8. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please <a href="/contact" className="text-sakura-600 hover:underline">contact us</a>.</p>
          </section>
        </div>
      </div>
    </main>
  )
}