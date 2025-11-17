type UserRole = 'ADMIN' | 'PROFESSOR' | 'RETIREE';

export interface User {
  id: number;
  email: string;
  documentNumber: string;
  fullName: string;
  role: UserRole;
  active: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
