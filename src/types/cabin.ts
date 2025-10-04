export interface Amenities {
  wifi?: boolean;
  parking?: boolean;
  kitchen?: boolean;
  lake_view?: boolean;
  terrace?: boolean;
}

export interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Cabin {
  id: number;
  name: string;
  description: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  maxGusts: number;
  active: boolean;
  amenities: Amenities;
  location: Location;
  createdAt: string;
  updatedAt: string;
}

export interface RawCabin extends Omit<Cabin, 'amenities' | 'location'> {
  amenities: string;
  location: string;
}
