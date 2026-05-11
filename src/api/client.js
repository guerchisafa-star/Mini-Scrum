//tous les url commence par tous les endpoints du backend commence par  /api
const BASE = '/api';
//recuperation de token
function getToken() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token || null;
}
//fonction principale utiliser 
//construction de url compléte
async function request(method, path, body, params) {
  const url = new URL(BASE + path, window.location.origin);
  //ajout de parametre dans la base
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, v);
    });
  }
//headers http : indique que les donnes envoyer sous format json
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
//gestion des erreurs
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erreur réseau' }));
    throw new Error(err.message || `Erreur ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// AUTH
export const auth = {
  login: (data) => request('POST', '/auth/login', data),
  register: (data) => request('POST', '/auth/register', data),
};

// PROJECTS
export const projects = {
  getAll: () => request('GET', '/projects'),
  getById: (id) => request('GET', `/projects/${id}`),
  create: (ownerId, data) => request('POST', '/projects', data, { ownerId }),
  update: (id, data) => request('PUT', `/projects/${id}`, data),
  delete: (id) => request('DELETE', `/projects/${id}`),
};

// MEMBERS
export const members = {
  getByProject: (projectId) => request('GET', `/projects/${projectId}/members`),
  add: (projectId, data) => request('POST', `/projects/${projectId}/members`, data),
  remove: (projectId, memberId) => request('DELETE', `/projects/${projectId}/members/${memberId}`),
};

// SPRINTS
export const sprints = {
  getByProject: (projectId) => request('GET', `/projects/${projectId}/sprints`),
  create: (projectId, data) => request('POST', `/projects/${projectId}/sprints`, data),
  start: (projectId, sprintId) => request('PATCH', `/projects/${projectId}/sprints/${sprintId}/start`),
  complete: (projectId, sprintId) => request('PATCH', `/projects/${projectId}/sprints/${sprintId}/complete`),
  delete: (projectId, sprintId) => request('DELETE', `/projects/${projectId}/sprints/${sprintId}`),
};

// USER STORIES
export const stories = {
  getByProject: (projectId) => request('GET', `/projects/${projectId}/stories`),
  getBacklog: (projectId) => request('GET', `/projects/${projectId}/stories/backlog`),
  create: (projectId, data) => request('POST', `/projects/${projectId}/stories`, data),
  update: (projectId, storyId, data) => request('PUT', `/projects/${projectId}/stories/${storyId}`, data),
  assignToSprint: (projectId, storyId, sprintId) =>
    request('PATCH', `/projects/${projectId}/stories/${storyId}/assign-sprint`, null, { sprintId }),
  delete: (projectId, storyId) => request('DELETE', `/projects/${projectId}/stories/${storyId}`),
};

// TASKS
export const tasks = {
  getByStory: (storyId) => request('GET', `/stories/${storyId}/tasks`),
  getBySprint: (sprintId) => request('GET', `/sprints/${sprintId}/tasks`),
  getByUser: (userId) => request('GET', `/users/${userId}/tasks`),
  getById: (id) => request('GET', `/tasks/${id}`),
  create: (storyId, data) => request('POST', `/stories/${storyId}/tasks`, data),
  update: (id, data) => request('PUT', `/tasks/${id}`, data),
  updateStatus: (id, status) => request('PATCH', `/tasks/${id}/status`, null, { status }),
  delete: (id) => request('DELETE', `/tasks/${id}`),
};

// DASHBOARD
export const dashboard = {
  get: (userId, role) => request('GET', '/dashboard', null, { userId, role }),
};

// USERS
export const users = {
  getAll: () => request('GET', '/users'),
};
