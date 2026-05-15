const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80'

/** Reliable fallbacks when API/DB image URLs fail to load */
export const UNIVERSITY_IMAGE_FALLBACKS = {
  'University of Tokyo':
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
  'Kyoto University':
    'https://images.unsplash.com/photo-1493976040374-85c8e712f0f1?auto=format&fit=crop&w=1200&q=80',
  'Osaka University':
    'https://images.unsplash.com/photo-1590559899732-03242af379ca?auto=format&fit=crop&w=1200&q=80',
  'Waseda University':
    'https://images.unsplash.com/photo-1523580494876-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
  'Keio University':
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
  'Tokyo Institute of Technology':
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
}

export function getUniversityImage(university) {
  const fromApi = university?.images?.[0]
  if (fromApi) return fromApi
  return UNIVERSITY_IMAGE_FALLBACKS[university?.name] || DEFAULT_IMAGE
}

export function getUniversityImageFallback(name) {
  return UNIVERSITY_IMAGE_FALLBACKS[name] || DEFAULT_IMAGE
}
