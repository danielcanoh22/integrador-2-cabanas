export interface JWTPayload {
  sub: string;
  userId: number;
  roles: string[];
  iat: number;
  exp: number;
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function getUserRoles(token: string): string[] {
  const payload = decodeJWT(token);
  return payload?.roles || [];
}

export function hasRole(token: string, role: string): boolean {
  const roles = getUserRoles(token);
  return roles.includes(role);
}

export function isAdmin(token: string): boolean {
  return hasRole(token, 'ADMIN');
}

export function getUserId(token: string): number | null {
  const payload = decodeJWT(token);
  return payload?.userId || null;
}
