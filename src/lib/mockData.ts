import { Cinema, Hall, Movie, Showtime, Staff } from '@/types/index';

export const mockCinemas: Cinema[] = [
  {
    id: 'c_hcm_001',
    name: 'CGV Vincom Landmark 81',
    address: 'Tầng 5, TTTM Vincom Center Landmark 81, 720A Điện Biên Phủ',
    city: 'Hồ Chí Minh City',
    district: 'Quận Bình Thạnh',
    phone: '028 3933 1111',
    email: 'landmark81@cgv.vn',
    website: 'https://www.cgv.vn',
    latitude: 10.7937,
    longitude: 106.721,
    description: 'Rạp chiếu phim cao cấp với công nghệ IMAX lớn nhất Việt Nam.',
    amenities: ['IMAX', 'Lounge', '4DX', 'SweetBox'],
    facilities: { parking: 'Basement B2-B4', wifi: true },
    images: ['url_to_landmark81_img1.jpg', 'url_to_landmark81_img2.jpg'],
    virtual_tour_360_url: 'url_360_landmark81',
    rating: 4.8,
    total_reviews: 3500,
    operating_hours: { mon_sun: '9:00 - 24:00' },
    social_media: { facebook: 'cgvlandmark81' },
    status: 'ACTIVE',
    timezone: 'Asia/Ho_Chi_Minh',
    created_at: '2018-01-15T10:00:00Z',
    updated_at: '2025-07-01T14:30:00Z',
  },
  {
    id: 'c_hn_002',
    name: 'Lotte Cinema Cầu Giấy',
    address: 'Tầng 6, Lotte Mart, 241 Xuân Thủy',
    city: 'Hà Nội',
    district: 'Quận Cầu Giấy',
    phone: '024 3788 2222',
    email: 'caugiau@lottecinema.vn',
    website: 'https://www.lottecinema.vn',
    latitude: 21.037,
    longitude: 105.78,
    description: 'Rạp chiếu phim lớn, tiện lợi cho khu vực phía Tây Hà Nội.',
    amenities: ['Standard', 'CineComfort'],
    facilities: { parking: 'Basement B1', wifi: true },
    images: ['url_to_caugiau_img1.jpg'],
    rating: 4.1,
    total_reviews: 1800,
    operating_hours: { mon_sun: '9:30 - 23:30' },
    social_media: {},
    status: 'ACTIVE',
    timezone: 'Asia/Ho_Chi_Minh',
    created_at: '2015-05-20T09:00:00Z',
    updated_at: '2025-06-28T10:00:00Z',
  },
  {
    id: 'c_dn_003',
    name: 'Galaxy Cinema Đà Nẵng',
    address: '46 Trần Phú, Phường Hải Châu 1',
    city: 'Đà Nẵng',
    district: 'Quận Hải Châu',
    phone: '0236 389 7777',
    email: 'danang@galaxycine.vn',
    description: 'Rạp chiếu phim đang trong giai đoạn bảo trì.',
    amenities: ['Standard'],
    facilities: {},
    images: [],
    rating: 3.5,
    total_reviews: 50,
    operating_hours: { mon_fri: 'Tạm dừng', sat_sun: 'Tạm dừng' },
    social_media: {},
    status: 'MAINTENANCE',
    timezone: 'Asia/Ho_Chi_Minh',
    created_at: '2019-11-01T11:00:00Z',
    updated_at: '2025-07-05T08:00:00Z',
  },
];


export const mockHalls: Hall[] = [
  {
    id: 'h_lm81_imax',
    cinema_id: 'c_hcm_001',
    name: 'Hall 1 - IMAX Laser',
    type: 'IMAX',
    capacity: 350,
    rows: 15,
    screen_type: 'Giant Screen',
    sound_system: '12-Channel Sound',
    features: ['3D capable', 'Wheelchair access'],
    layout_data: { type: 'stadium', seat_map_url: 'url_to_seatmap_imax' },
    status: 'Operational',
    created_at: '2018-01-15T11:00:00Z',
    updated_at: '2025-06-01T10:00:00Z',
  },
  {
    id: 'h_lm81_vip',
    cinema_id: 'c_hcm_001',
    name: 'Hall 5 - L\'amour VIP',
    type: 'VIP',
    capacity: 50,
    rows: 5,
    screen_type: 'Standard',
    sound_system: 'Dolby 7.1',
    features: ['Recliner Seats', 'Blankets'],
    layout_data: { type: 'lounge', seat_map_url: 'url_to_seatmap_vip' },
    status: 'Operational',
    created_at: '2018-01-15T11:00:00Z',
    updated_at: '2025-06-01T10:00:00Z',
  },
  {
    id: 'h_caugiau_std',
    cinema_id: 'c_hn_002',
    name: 'Hall 3 - Standard',
    type: 'STANDARD',
    capacity: 180,
    rows: 12,
    screen_type: 'Standard',
    sound_system: 'Dolby Digital',
    features: ['Popcorn & Drink holders'],
    layout_data: { type: 'standard', seat_map_url: 'url_to_seatmap_std' },
    status: 'Operational',
    created_at: '2015-05-20T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z',
  },
];


export const mockMovies: Movie[] = [
  {
    id: 'm_001',
    title: 'Mission: Impossible - Dead Reckoning Part One',
    description: 'Ethan Hunt và nhóm IMF đối mặt với một vũ khí nguy hiểm mới.',
    posterUrl: 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/3/image/1800x/71252117777b696995f01934522c402d/7/0/700x1000_7_.jpg',
    trailerUrl: 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/3/image/1800x/71252117777b696995f01934522c402d/7/0/700x1000_7_.jpg',
    genres: ['Action', 'Thriller'],
    durationMinutes: 163,
    ageRating: 'P13',
    releaseDate: '2023-07-12',
    status: 'Showing',
  },
  {
    id: 'm_002',
    title: 'Oppenheimer',
    description: 'Câu chuyện về nhà vật lý J. Robert Oppenheimer và vai trò của ông trong việc phát triển bom nguyên tử.',
    posterUrl: 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/7/0/700x1000-oppen.jpg',
    trailerUrl: 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/7/0/700x1000-oppen.jpg',
    genres: ['Biography', 'Drama', 'History'],
    durationMinutes: 180,
    ageRating: 'C16',
    releaseDate: '2023-07-21',
    status: 'Showing',
  },
  {
    id: 'm_003',
    title: 'Dune: Part Two',
    description: 'Paul Atreides hợp lực với Chani và Fremen để trả thù những kẻ đã hủy hoại gia đình mình.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_.jpg',
    trailerUrl: 'https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_.jpg',
    genres: ['Sci-Fi', 'Adventure'],
    durationMinutes: 166,
    ageRating: 'P13',
    releaseDate: '2024-03-01',
    status: 'Upcoming',
  },
];



const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const tomorrowISO = tomorrow.toISOString().split('T')[0];

export const mockShowtimes: Showtime[] = [
  {
    id: 'st_001',
    movie_id: 'm_001',
    cinema_id: 'c_hcm_001', // CGV Landmark 81
    hall_id: 'h_lm81_imax', // IMAX Hall
    start_time: `${tomorrowISO}T19:00:00+07:00`,
    end_time: `${tomorrowISO}T21:43:00+07:00`,
    format: 'IMAX 3D',
    language: 'English',
    subtitles: ['Vietnamese'],
    base_price: 180000,
    available_seats: 150,
    total_seats: 350,
    status: 'SELLING',
  },
  {
    id: 'st_002',
    movie_id: 'm_002',
    cinema_id: 'c_hcm_001', // CGV Landmark 81
    hall_id: 'h_lm81_vip', // VIP Hall
    start_time: `${tomorrowISO}T20:30:00+07:00`,
    end_time: `${tomorrowISO}T23:30:00+07:00`,
    format: '2D Digital',
    language: 'English',
    subtitles: ['Vietnamese'],
    base_price: 150000,
    available_seats: 0,
    total_seats: 50,
    status: 'SOLD_OUT',
  },
  {
    id: 'st_003',
    movie_id: 'm_002',
    cinema_id: 'c_hn_002', // Lotte Cinema Cầu Giấy
    hall_id: 'h_caugiau_std', // Standard Hall
    start_time: `${tomorrowISO}T17:00:00+07:00`,
    end_time: `${tomorrowISO}T20:00:00+07:00`,
    format: '2D Digital',
    language: 'Korean',
    subtitles: ['Vietnamese', 'English'],
    base_price: 90000,
    available_seats: 175,
    total_seats: 180,
    status: 'SCHEDULED',
  },
];


export const mockStaff: Staff[] = [
  {
    id: 's_001',
    name: 'Nguyễn Văn A',
    role: 'Cinema Manager',
    email: 'anv@cinema.com',
    phone: '0901234567',
    hiredAt: '2020-03-01',
    status: 'Active',
    locationId: 'c_hcm_001', // CGV Landmark 81
  },
  {
    id: 's_002',
    name: 'Trần Thị B',
    role: 'Ticketing Staff',
    email: 'btt@cinema.com',
    phone: '0907654321',
    hiredAt: '2022-08-15',
    status: 'Active',
    locationId: 'c_hn_002', // Lotte Cinema Cầu Giấy
  },
  {
    id: 's_003',
    name: 'Lê Văn C',
    role: 'Maintenance Technician',
    email: 'clv@cinema.com',
    phone: '0912345678',
    hiredAt: '2019-01-20',
    status: 'Inactive',
    locationId: 'c_dn_003', // Galaxy Cinema Đà Nẵng (Maintenance)
  },
];