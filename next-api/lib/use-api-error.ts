'use client'

import { useTranslations } from 'next-intl'

/** Maps an API error code (see lib/http.ts jsonError) or a thrown ApiError to a localized message. */
export function useApiError() {
  const t = useTranslations('ApiErrors')
  return (e: unknown): string => {
    const code = typeof e === 'string' ? e : (e as { code?: string } | null)?.code
    if (code && t.has(code)) return t(code)
    if (e instanceof TypeError) return t('NETWORK')
    return t('UNKNOWN')
  }
}
