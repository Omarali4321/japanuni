import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | JapanUni',
  description: 'JapanUni Terms of Service - Terms and conditions for using our platform.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-sakura-50 dark:bg-ink-950">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-ink-950 dark:text-ink-50 mb-4">Terms of Service</h1>
          <p className="text-lg text-ink-600 dark:text-ink-400">Last updated: November 2024</p>
        </header>

        <div className="prose prose-ink dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">1. Acceptance of Terms</h2>
            <p>By accessing and using JapanUni, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">2. Use of Our Services</h2>
            <p>JapanUni provides information about Japanese universities, scholarships, visa guidance, and student life. You agree to use our services only for lawful purposes and in accordance with these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">3. User Accounts</h2>
            <p>You may create an account to save favorites, track applications, and access personalized features. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">4. Intellectual Property</h2>
            <p>All content on JapanUni, including text, graphics, logos, and software, is our property or licensed to us. You may not reproduce, distribute, or create derivative works without permission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">5. User Content</h2>
            <p>You retain ownership of content you submit (reviews, comments). By submitting, you grant us a worldwide, royalty-free license to use, display, and distribute your content on our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">6. Disclaimers</h2>
            <p>Information on JapanUni is for general guidance only. We do not guarantee the accuracy, completeness, or timeliness of university data, scholarship details, or visa requirements. Always verify with official sources.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, JapanUni shall not be liable for any indirect, incidental, or consequential damages arising from your use of our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">8. Termination</h2>
            <p>We may terminate or suspend your account at our discretion, without notice, for conduct that violates these terms or is harmful to other users.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">9. Governing Law</h2>
            <p>These terms shall be governed by the laws of Japan, without regard to conflict of law principles.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink-950 dark:text-ink-50">10. Contact Us</h2>
            <p>If you have questions about these Terms, please <a href="/contact" className="text-sakura-600 hover:underline">contact us</a>.</p>
          </section>
        </div>
      </div>
    </main>
  )
}