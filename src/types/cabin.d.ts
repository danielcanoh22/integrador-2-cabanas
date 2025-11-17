export interface Amenities {
  amenities: string[];
}

export interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  zone: string;
}

export interface Cabin {
  id: number;
  name: string;
  description: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  maxGuests: number;
  active: boolean;
  amenities: string[];
  location: Location;
  createdAt?: string;
  updatedAt?: string;
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
}

export interface RawCabin extends Omit<Cabin, 'amenities' | 'location'> {
  amenities: string;
  location: string;
}

export type CabinFormData = {
  name: string;
  description: string;
  capacity: string;
  bedrooms: string;
  bathrooms: string;
  basePrice: string;
  maxGuests: string;
  // active: boolean;
  locationAddress: string;
  amenities: string;
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
};

// Admin
export interface ApiCabinResponse
  extends Omit<Cabin, 'amenities' | 'location'> {
  amenities: string;
  location: string;
}

export interface CabinPayload {
  name: string;
  description: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  maxGuests: number;
  amenities: string;
  location: string;
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
}

export interface UpdateCabinStatusRequest {
  active: boolean;
}
