import api from './client'

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
}

export const universityApi = {
  search: (params) => api.get('/universities', { params }),
  getById: (id) => api.get(`/universities/${id}`),
  compare: (universityIds) => api.post('/universities/compare', { universityIds }),
  match: (data) => api.post('/universities/match', data),
  getReviews: (id) => api.get(`/universities/${id}/reviews`),
  addReview: (id, data) => api.post(`/universities/${id}/reviews`, data),
}

export const scholarshipApi = {
  search: (params) => api.get('/scholarships', { params }),
  getById: (id) => api.get(`/scholarships/${id}`),
}

export const favoriteApi = {
  list: () => api.get('/favorites'),
  add: (universityId) => api.post(`/favorites/${universityId}`),
  remove: (universityId) => api.delete(`/favorites/${universityId}`),
}

export const guideApi = {
  admission: () => api.get('/guides/admission'),
  visa: () => api.get('/guides/visa'),
  studentLife: () => api.get('/guides/student-life'),
}

export const cityApi = {
  list: () => api.get('/cities'),
}

export const adminApi = {
  stats: () => api.get('/admin/stats'),
}
