export interface LoginCredentials {
  documentNumber: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
