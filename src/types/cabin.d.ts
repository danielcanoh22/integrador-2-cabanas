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
  amenities: Amenities;
  location: Location;
  createdAt?: string;
  updatedAt?: string;
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
  active: boolean;
  locationAddress: string;
  locationZone: string;
  locationLat: string;
  locationLng: string;
  amenities: string;
};
