import api from './client'

const apiMode = import.meta.env.VITE_API_MODE || 'next'

const unwrapData = (res) => ({
  ...res,
  data: res.data?.data ?? res.data,
})

const unwrapPage = (res) => {
  if (apiMode === 'spring') return res
  return {
    ...res,
    data: {
      content: res.data.data,
      page: res.data.meta.page,
      size: res.data.meta.size,
      totalElements: res.data.meta.totalElements,
      totalPages: res.data.meta.totalPages,
    },
  }
}

export const authApi = {
  login: (data) => api.post('/auth/login', data).then(unwrapData),
  register: (data) => api.post('/auth/register', data).then(unwrapData),
  logout: () => api.post('/auth/logout').then(unwrapData),
}

export const userApi = {
  getProfile: () => api.get('/users/me').then(unwrapData),
  updateProfile: (data) => api.put('/users/me', data).then(unwrapData),
}

export const universityApi = {
  search: (params) => api.get('/universities', { params }).then(unwrapPage),
  getById: (id) => api.get(`/universities/${id}`).then(unwrapData),
  compare: (universityIds) => api.post('/universities/compare', { universityIds }).then(unwrapData),
  match: (data) => api.post('/universities/match', data).then(unwrapData),
  getReviews: (id) => api.get(`/universities/${id}/reviews`).then(unwrapData),
  addReview: (id, data) => api.post(`/universities/${id}/reviews`, data).then(unwrapData),
}

export const scholarshipApi = {
  search: (params) => api.get('/scholarships', { params }).then(unwrapPage),
  getById: (id) => api.get(`/scholarships/${id}`).then(unwrapData),
}

export const favoriteApi = {
  list: () => api.get('/favorites').then(unwrapData),
  add: (universityId) => api.post(`/favorites/${universityId}`).then(unwrapData),
  remove: (universityId) => api.delete(`/favorites/${universityId}`).then(unwrapData),
}

export const guideApi = {
  admission: () => api.get('/guides/admission').then(unwrapData),
  visa: () => api.get('/guides/visa').then(unwrapData),
  studentLife: () => api.get('/guides/student-life').then(unwrapData),
}

export const cityApi = {
  list: () => api.get('/cities').then(unwrapData),
}

export const adminApi = {
  stats: () => api.get('/admin/stats').then(unwrapData),
}
