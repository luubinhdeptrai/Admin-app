// src/types/index.ts (FIXED)

export type CinemaStatus = 'ACTIVE' | 'MAINTENANCE' | 'CLOSED';
export type HallType = 'STANDARD' | 'VIP' | 'IMAX' | 'FOUR_DX' | 'PREMIUM';
export type SeatType = 'STANDARD' | 'VIP' | 'COUPLE' | 'PREMIUM' | 'WHEELCHAIR';
export type ShowtimeStatus = 'SCHEDULED' | 'SELLING' | 'SOLD_OUT' | 'CANCELLED' | 'COMPLETED';

// Thay thế `any` bằng kiểu Object cụ thể hơn
type GenericObject = Record<string, unknown>;

export interface Cinema {
  id: string;
  name: string;
  address: string;
  city: string;
  district?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  amenities: string[];
  facilities?: GenericObject; // Sửa lỗi any
  images: string[];
  virtual_tour_360_url?: string;
  rating?: number;
  total_reviews: number;
  operating_hours?: GenericObject; // Sửa lỗi any
  social_media?: GenericObject; // Sửa lỗi any
  status: CinemaStatus;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Hall {
  id: string;
  cinema_id: string;
  name: string;
  type: HallType;
  capacity: number;
  rows: number;
  screen_type?: string;
  sound_system?: string;
  features: string[];
  layout_data?: GenericObject; // Sửa lỗi any
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: string;
  title: string;
  description?: string;
  posterUrl?: string;
  trailerUrl?: string;
  genres: string[];
  durationMinutes: number;
  ageRating?: string;
  releaseDate: string;
  status: string;
}

export interface Showtime {
  id: string;
  movie_id: string;
  cinema_id: string;
  hall_id: string;
  start_time: string;
  end_time: string;
  format: string;
  language: string;
  subtitles: string[];
  base_price: number;
  available_seats: number;
  total_seats: number;
  status: ShowtimeStatus;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  hiredAt: string;
  status: string;
  locationId: string;
}