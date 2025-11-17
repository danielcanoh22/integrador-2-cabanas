export interface LoginCredentials {
  documentNumber: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  documentNumber: string;
  email: string;
  name: string;
  phone: string;
  pin: string;
  role: 'PROFESSOR' | 'RETIREE';
}

export type RegisterResponse = unknown;
