'use client'

export default function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Cosmic Atlas',
    'description': 'Your premium gateway to the cosmos. Real-time space news, astronomical events, interactive sky maps, and AI astronomy assistant.',
    'url': 'https://cosmic-atlas.vercel.app',
    'applicationCategory': 'EducationalApplication',
    'operatingSystem': 'Any',
    'author': {
      '@type': 'Organization',
      'name': 'Cosmic Atlas Team'
    },
    'featureList': [
      'Real-time Space News',
      'Mars Weather & Imagery',
      'ISS Tracking',
      'Interactive Planetarium',
      'AI Astronomy Assistant'
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
