const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80'

export const UNIVERSITY_IMAGE_FALLBACKS = {
  'University of Tokyo':
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
  'Kyoto University':
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
  'Osaka University':
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
  'Waseda University':
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
  'Keio University':
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
  'Tokyo Institute of Technology':
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
}

export function getUniversityImage(university) {
  return UNIVERSITY_IMAGE_FALLBACKS[university?.name] || DEFAULT_IMAGE
}

export function getUniversityImageFallback(name) {
  return UNIVERSITY_IMAGE_FALLBACKS[name] || DEFAULT_IMAGE
}
