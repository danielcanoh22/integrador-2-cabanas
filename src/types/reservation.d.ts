import { Cabin } from './cabin';
import { User } from './user';

type ReservationStatus =
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'PENDING'
  | 'IN_USE'
  | 'CANCELLED';

export interface BasicReservation {
  id: number;
  userId: number;
  cabinId: number;
  startDate: string;
  endDate: string;
  guests: number;
  status: ReservationStatus;
  checkInTime: string | null;
  checkOutTime: string | null;
  total?: number;
  basePrice?: number;
  finalPrice?: number;
}

export interface EnrichedReservation extends BasicReservation {
  user: User;
  cabin: Cabin;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export interface CreateReservationRequest {
  userId: number;
  cabinId: number;
  startDate: string;
  endDate: string;
  guests: number;
}

export interface UpdateReservationStatusRequest {
  status: ReservationStatus;
}
