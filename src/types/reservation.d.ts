export interface Reservation {
  id: number;
  cabinName: string;
  cabinLocation: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: string;
  total: number;
  createdAt: Date;
}
