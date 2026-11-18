'use client'

import { useState } from 'react'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is JapanUni?',
        a: 'JapanUni is a comprehensive platform helping international students discover, compare, and apply to Japanese universities. We provide university listings, scholarship databases, admission guides, visa information, and student life resources—all in one place.',
      },
      {
        q: 'Is JapanUni free to use?',
        a: 'Yes! JapanUni is completely free for students. You can browse universities, compare programs, search scholarships, and access all our guides without any cost. Creating an account lets you save favorites and write reviews.',
      },
      {
        q: 'How do I create an account?',
        a: 'Click "Sign up" in the top navigation. You can register with your email address. Once registered, you can save favorite universities, write reviews, and access your personalized dashboard.',
      },
      {
        q: 'Can I use JapanUni in languages other than English?',
        a: 'We\'re working on adding more languages! Currently the interface is in English, but we plan to add Japanese, Korean, Chinese, and Vietnamese. Use the language selector in the footer to switch (currently UI only).',
      },
    ],
  },
  {
    category: 'Universities & Programs',
    questions: [
      {
        q: 'How many universities are listed on JapanUni?',
        a: 'We currently list 100+ Japanese universities with detailed information including programs, admission requirements, tuition fees, campus facilities, and student reviews.',
      },
      {
        q: 'What\'s the difference between national, public, and private universities?',
        a: 'National universities are funded by the national government (e.g., University of Tokyo). Public universities are funded by local governments (e.g., Osaka Metropolitan University). Private universities are independently funded (e.g., Waseda, Keio). Tuition and admission competitiveness vary by type.',
      },
      {
        q: 'Can I study in English at Japanese universities?',
        a: 'Yes! Many universities offer English-taught programs (G30, SGU, and other international programs). Use our filters to find English-taught degrees. Note that some Japanese language ability is still helpful for daily life.',
      },
      {
        q: 'How does the comparison tool work?',
        a: 'Select up to 4 universities from any listing page, then click "Compare" to see them side-by-side with tuition, rankings, programs, admission requirements, and student reviews in a single view.',
      },
    ],
  },
  {
    category: 'Scholarships',
    questions: [
      {
        q: 'What scholarships are available for international students?',
        a: 'Major options include: MEXT (Japanese Government) Scholarship, JASSO Scholarships, university-specific scholarships, and private foundation scholarships. Our scholarship database lets you filter by eligibility, amount, and deadline.',
      },
      {
        q: 'When should I apply for scholarships?',
        a: 'Most major scholarships (especially MEXT) have application windows 6-12 months before the academic year starts (April). University scholarships often have deadlines closer to admission. Check each scholarship\'s specific timeline.',
      },
      {
        q: 'Can I apply for multiple scholarships?',
        a: 'Yes, you can apply for multiple scholarships simultaneously. However, some scholarships (like MEXT) cannot be combined with other major government scholarships. Check the terms of each scholarship.',
      },
    ],
  },
  {
    category: 'Admissions & Visa',
    questions: [
      {
        q: 'What is the Certificate of Eligibility (COE)?',
        a: 'The COE is a document issued by Japanese immigration confirming you meet visa requirements. Your university applies for it on your behalf after admission. You need the COE to apply for a student visa at the Japanese embassy/consulate in your home country.',
      },
      {
        q: 'What are the typical admission requirements?',
        a: 'Requirements vary by university and program but generally include: completed 12 years of education, academic transcripts, language proficiency proof (JLPT for Japanese programs, TOEFL/IELTS for English programs), statement of purpose, and recommendation letters.',
      },
      {
        q: 'Can I work part-time while studying?',
        a: 'Yes, student visa holders can work up to 28 hours per week during term time and 40 hours during vacations, with permission from immigration. You need to apply for "Permission to Engage in Activity Other Than That Permitted Under the Status of Residence."',
      },
    ],
  },
  {
    category: 'Student Life',
    questions: [
      {
        q: 'How much does it cost to live in Japan as a student?',
        a: 'Monthly costs vary by city: Tokyo ¥120,000-180,000, Osaka ¥100,000-150,000, smaller cities ¥80,000-120,000. This includes rent, food, transport, and utilities. University dormitories are cheaper (¥20,000-50,000/month).',
      },
      {
        q: 'Do I need health insurance?',
        a: 'Yes, all residents (including students) must enroll in Japan\'s National Health Insurance (NHI). It costs about ¥20,000-30,000/year for students and covers 70% of medical costs. Some universities offer additional coverage.',
      },
      {
        q: 'How do I find accommodation?',
        a: 'Options include: university dormitories (apply early!), private apartments (use sites like SUUMO, HOME&rsquo;S), share houses (Sakura House, Oakhouse), and homestays. Start searching 3-6 months before arrival.',
      },
    ],
  },
  {
    category: 'Account & Features',
    questions: [
      {
        q: 'How do I save universities to my favorites?',
        a: 'Click the heart icon (🤍) on any university card or detail page. Saved universities appear in your Favorites page (accessible from your account menu) and on your Dashboard.',
      },
      {
        q: 'Can I write reviews for universities?',
        a: 'Yes! Logged-in users can write reviews on university detail pages. Your review helps other students make informed decisions. Reviews are moderated for quality and authenticity.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to your Dashboard → Profile settings → Delete account. This permanently removes your data. Note: this action cannot be undone.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="section-title">Frequently Asked Questions</h1>
        <p className="mt-3 max-w-2xl text-ink-800/60 dark:text-ink-50/60">
          Quick answers to common questions about studying in Japan and using JapanUni.
        </p>
      </FadeIn>

      <SlideUp delay={0.1} className="mt-10">
        <StaggerContainer staggerDelay={0.1} className="space-y-6">
          {faqs.map((category, catIndex) => (
            <StaggerItem key={category.category} customDelay={catIndex * 0.05}>
              <div className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenCategory(openCategory === category.category ? null : category.category)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 dark:hover:bg-ink-800/50 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950"
                  aria-expanded={openCategory === category.category}
                >
                  <h2 className="font-display text-xl font-semibold">{category.category}</h2>
                  <span className="text-2xl transition-transform duration-200" style={{ transform: openCategory === category.category ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </span>
                </button>
                {openCategory === category.category && (
                  <div className="border-t border-white/10 px-6 pb-6">
                    <StaggerContainer staggerDelay={0.05} className="space-y-4 mt-4">
                      {category.questions.map((faq, qIndex) => (
                        <StaggerItem key={faq.q} customDelay={qIndex * 0.03}>
                          <details className="group">
                            <summary className="flex items-center justify-between cursor-pointer list-none p-3 rounded-lg hover:bg-white/5 dark:hover:bg-ink-800/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sakura-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 dark:focus-visible:ring-offset-ink-950">
                              <p className="font-medium text-ink-800 dark:text-ink-50 pr-8">{faq.q}</p>
                              <span className="text-sakura-500 transition-transform duration-200 group-open:rotate-180">▼</span>
                            </summary>
                            <div className="pt-2 pb-4 px-3 text-ink-800/70 dark:text-ink-50/70 leading-relaxed">
                              {faq.a}
                            </div>
                          </details>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </SlideUp>

      <SlideUp delay={0.2} className="mt-16">
        <div className="glass-card p-8 md:p-12 text-center">
          <h2 className="font-display text-2xl font-semibold mb-3">Still have questions?</h2>
          <p className="text-ink-800/60 dark:text-ink-50/60 mb-6 max-w-xl mx-auto">
            Can't find the answer you're looking for? Our team is here to help.
          </p>
          <a href="/contact" className="btn-primary inline-block">Contact Support</a>
        </div>
      </SlideUp>
    </div>
  )
}