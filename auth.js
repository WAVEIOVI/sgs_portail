// Static authentication — client-side demo credentials only

const SESSION_KEY = 'wavevi_session';

export const CREDENTIALS = {
  wavevi: {
    password: 'waveiovi',
    role: 'admin',
    displayName: 'WAVE VI',
    roleLabel: 'Administrator',
    initials: 'WV'
  },
  sgs: {
    password: 'sgs',
    role: 'supplier',
    displayName: 'SGS Printing Services',
    roleLabel: 'Supplier',
    initials: 'SG'
  }
};

export function login(username, password) {
  const user = CREDENTIALS[username.trim().toLowerCase()];
  if (!user || user.password !== password) return null;

  const session = {
    username: username.trim().toLowerCase(),
    role: user.role,
    displayName: user.displayName,
    roleLabel: user.roleLabel,
    initials: user.initials,
    loggedInAt: new Date().toISOString()
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getSession();
}

export function isAdmin() {
  return getSession()?.role === 'admin';
}

export function canWrite() {
  return isAdmin();
}

export function canAccessPage(page) {
  if (page === 'settings' && !isAdmin()) return false;
  return true;
}
