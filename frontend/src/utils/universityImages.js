const DEFAULT_IMAGE =
  'https://source.unsplash.com/1200x800/?japan,university,campus'

export const UNIVERSITY_IMAGE_FALLBACKS = {
  'University of Tokyo':
    'https://source.unsplash.com/1200x800/?tokyo,university,campus',
  'Kyoto University':
    'https://source.unsplash.com/1200x800/?kyoto,university,campus',
  'Osaka University':
    'https://source.unsplash.com/1200x800/?osaka,university,campus',
  'Waseda University':
    'https://source.unsplash.com/1200x800/?waseda,university,campus',
  'Keio University':
    'https://source.unsplash.com/1200x800/?keio,university,campus',
  'Tokyo Institute of Technology':
    'https://source.unsplash.com/1200x800/?technology,university,laboratory',
}

export function getUniversityImage(university) {
  return UNIVERSITY_IMAGE_FALLBACKS[university?.name] || DEFAULT_IMAGE
}

export function getUniversityImageFallback(name) {
  return UNIVERSITY_IMAGE_FALLBACKS[name] || DEFAULT_IMAGE
}
