import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description }) {
  const fullTitle = title ? `${title} | JapanUni` : 'JapanUni — Study in Japan'
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  )
}
