# 📋 API INTEGRATION BREAKDOWN - By Screen

**Document Version:** 1.0  
**Created:** 2025-12-17  
**Purpose:** Detailed API requirements for each admin dashboard screen with feasibility assessment  
**Basis:** API_ALIGNMENT_GUIDE.md + Page structure analysis

---

## 📊 Quick Summary

| Tính Trạng | Module | Số Trang | Ghi Chú |
|-----------|--------|---------|---------|
| ✅ Đủ API 100% | 8 | Movies, Genres, Cinemas, Halls, Seat-Status, Movie-Releases, Ticket-Pricing, Batch-Showtimes | Có thể integrate ngay |
| ⚠️ Cần Workaround | 3 | Halls-List, Showtimes, Showtime-Seats | API có nhưng cần combine hoặc request khác |
| ❌ Thiếu API | 3 | Reviews, Staff, Reports, Settings | Cần backend bổ sung hoặc workaround |

---

## 🎬 MOVIES PAGE
**Route:** `/dashboard/movies`

### Current Functionality
- [x] List all movies (paginated)
- [x] Search by title
- [x] Create new movie
- [x] Edit movie
- [x] Delete movie
- [x] View movie details

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú |
|--------|---------|---------|--------|--------|--------|---------|
| 1 | Load all movies | `GET /api/v1/movies?page=1&limit=20&status=now_showing` | 1.1 | ✅ Có | Ready | Direct use |
| 2 | Search movies | Filter locally or use query param | 1.1 | ✅ Có | Ready | GET /api/v1/movies?search=xyz (if supported) |
| 3 | Get movie detail | `GET /api/v1/movies/:id` | 1.1 | ✅ Có | Ready | Assumed included in 1.1 |
| 4 | Create movie | `POST /api/v1/movies` | 1.2 | ✅ Có | Ready | Requires: name, description, duration, genres, etc |
| 5 | Update movie | `PUT /api/v1/movies/:id` | 1.3 | ✅ Có | Ready | Partial update support |
| 6 | Delete movie | `DELETE /api/v1/movies/:id` | 1.4 | ✅ Có | Ready | Soft or hard delete |

### Dropdowns/Selects Needed
- **Genres:** Use `GET /api/v1/genres` (ID 2.1) ✅ Ready

### Implementation Notes
- ✅ **ALL APIs are ready** - No backend changes needed
- Currently using mock data from `mockData.ts`, switch to real API calls
- Recommend pagination: implement `page` & `limit` query params

### Type Definitions to Update
```typescript
// Ensure Movie type includes all fields from backend response
type Movie = {
  id: string;
  name: string;
  description: string;
  duration: number;
  releaseDate: string;
  genres: Genre[];
  rating: number;
  posterUrl: string;
  // ... other fields
}
```

---

## 🎭 GENRES PAGE
**Route:** `/dashboard/genres`

### Current Functionality
- [x] List all genres
- [x] Create genre
- [x] Edit genre
- [x] Delete genre

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú |
|--------|---------|---------|--------|--------|--------|---------|
| 1 | Load all genres | `GET /api/v1/genres` | 2.1 | ✅ Có | Ready | Direct use, no pagination needed |
| 2 | Create genre | `POST /api/v1/genres` | 2.2 | ✅ Có | Ready | Body: { name: string } |
| 3 | Update genre | `PUT /api/v1/genres/:id` | 2.3 | ✅ Có | Ready | Body: { name: string } |
| 4 | Delete genre | `DELETE /api/v1/genres/:id` | 2.4 | ✅ Có | Ready | Simple ID-based delete |

### Implementation Notes
- ✅ **ALL APIs are ready** - No backend changes needed
- Simple CRUD module - straightforward implementation
- No external dependencies

---

## 🏢 CINEMAS PAGE
**Route:** `/dashboard/cinemas`

### Current Functionality
- [x] List all cinemas
- [x] Search by name/city
- [x] Create cinema
- [x] Edit cinema
- [x] Delete cinema
- [x] View cinema details

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú |
|--------|---------|---------|--------|--------|--------|---------|
| 1 | Load all cinemas | `GET /api/v1/cinemas/filters` | 3.1 | ✅ Có | Ready | Pass empty params to get all |
| 2 | Search/filter cinemas | Use filters in GET query | 3.1 | ✅ Có | Ready | Supports: name, city, district filters |
| 3 | Get cinema detail | `GET /api/v1/cinemas/:id` | 3.1 | ✅ Có | Ready | Assumed in response |
| 4 | Create cinema | `POST /api/v1/cinemas/cinema` | 3.2 | ✅ Có | Ready | Body: { name, address, city, district, phone, email, amenities[] } |
| 5 | Update cinema | `PATCH /api/v1/cinemas/cinema/:cinemaId` | 3.3 | ✅ Có | Ready | Partial update |
| 6 | Delete cinema | `DELETE /api/v1/cinemas/cinema/:cinemaId` | 3.4 | ✅ Có | Ready | Soft or hard delete |

### Dropdown Dependencies
- None required

### Implementation Notes
- ✅ **ALL APIs are ready** - No backend changes needed
- Note the endpoint pattern: `/cinema` vs `/cinemas/cinema/:id`
- Search: Filter locally from GET response or use query params if backend supports

---

## 🚪 HALLS PAGE  
**Route:** `/dashboard/halls`

### Current Functionality
- [x] List all halls
- [x] Filter by cinema
- [x] Create hall
- [x] Edit hall
- [x] Delete hall
- [x] View seat map

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú | Workaround |
|--------|---------|---------|--------|--------|--------|---------|-----------|
| 1 | Load **ALL** halls | `GET /api/v1/halls` | 4.1 | ❌ Không | ⚠️ Workaround | No global endpoint exists | **Call 1)** `GET /api/v1/cinemas/filters` (3.1) to get all cinemas **2)** For each cinema: `GET /api/v1/halls/cinema/:cinemaId` (5.2) **3)** Merge results client-side |
| 2 | Get halls for cinema | `GET /api/v1/halls/cinema/:cinemaId` | 5.2 | ✅ Có | Ready | Used in dropdown/filter |
| 3 | Get hall detail + seats | `GET /api/v1/halls/hall/:hallId` | 4.2 | ✅ Có | Ready | Returns full seat map |
| 4 | Create hall | `POST /api/v1/halls/hall` | 4.3 | ✅ Có | Ready | Body: { cinemaId, name, type, capacity, rows, cols } |
| 5 | Update hall | `PATCH /api/v1/halls/hall/:hallId` | 4.4 | ✅ Có | Ready | Partial update |
| 6 | Delete hall | `DELETE /api/v1/halls/hall/:hallId` | 4.5 | ✅ Có | Ready | Soft or hard delete |

### Dropdown/Select Dependencies
- **Cinemas:** `GET /api/v1/cinemas/filters` (3.1) ✅ Ready

### Implementation Pattern (Important!)

```typescript
// Step 1: Get all cinemas
const cinemas = await fetch('/api/v1/cinemas/filters')

// Step 2: For each cinema, get halls
const allHalls = []
for (const cinema of cinemas) {
  const halls = await fetch(`/api/v1/halls/cinema/${cinema.id}`)
  allHalls.push(...halls)
}

// Step 3: Display with grouping
// allHalls.map(hall => ({ ...hall, cinemaName: cinemas.find(c => c.id === hall.cinemaId).name }))
```

### Backend Enhancement Needed (Optional but Recommended)
- 🔴 **Request:** Add `GET /api/v1/halls?cinemaId=xxx` with optional `cinemaId` param
  - If provided: return halls for that cinema
  - If not provided: return all halls grouped by cinema
  - **Effort:** Low (1-2 hours)

### Implementation Notes
- ✅ Workaround is viable but requires 2 API calls
- Recommend backend enhancement for better performance
- Currently using mock data + movie-releases for UI logic

---

## ⏰ SHOWTIMES PAGE
**Route:** `/dashboard/showtimes`

### Current Functionality
- [x] List showtimes by date/cinema/movie
- [x] Filter by cinema, movie, date
- [x] Create single showtime
- [x] Edit showtime
- [x] Delete showtime

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú | Workaround |
|--------|---------|---------|--------|--------|--------|---------|-----------|
| 1 | Get showtimes with flexible filters | `GET /api/v1/showtimes/admin?date=xxx&cinemaId=xxx&movieId=xxx` | 5.1 | ❌ Không | ⚠️ Workaround | Current: requires both cinemaId & movieId | Must call: `GET /api/v1/cinemas/:cinemaId/movies/:movieId/showtimes/admin` but need workaround for independent date filter |
| 2 | Get halls for dropdown | `GET /api/v1/halls/cinema/:cinemaId` | 5.2 | ✅ Có | Ready | Filter halls by selected cinema |
| 3 | Create single showtime | `POST /api/v1/showtimes/showtime` | 5.3 | ✅ Có | Ready | Body: { cinemaId, movieId, hallId, startTime, endTime, format, language, subtitles } |
| 4 | Create batch showtimes | `POST /api/v1/showtimes/batch` | 5.4 | ✅ Có | Ready | Handled in separate page (batch-showtimes) |
| 5 | Update showtime | `PATCH /api/v1/showtimes/showtime/:id` | 5.5 | ✅ Có | Ready | Partial update |
| 6 | Delete showtime | `DELETE /api/v1/showtimes/showtime/:id` | 5.6 | ✅ Có | Ready | Cancel showtime |
| 7 | Get seats for showtime | `GET /api/v1/showtimes/:id/seats` | 5.7 | ✅ Có | Ready | Used in seat-status view |

### Dropdown Dependencies
- **Cinemas:** `GET /api/v1/cinemas/filters` (3.1) ✅ Ready
- **Movies:** `GET /api/v1/movies` (1.1) ✅ Ready
- **Halls:** `GET /api/v1/halls/cinema/:cinemaId` (5.2) ✅ Ready

### Implementation Workaround for Flexible Filtering

**Current API Limitation:**
- `GET /api/v1/cinemas/:cinemaId/movies/:movieId/showtimes/admin` requires BOTH cinemaId & movieId

**Frontend Workaround:** (Until backend creates ID 5.1)
```typescript
// Option A: Load all and filter client-side
async function getShowtimes(date: Date, cinemaId?: string, movieId?: string) {
  // 1. Get all cinemas
  const cinemas = await fetch('/api/v1/cinemas/filters')
  
  // 2. If cinemaId specified, only use that; else use all
  const targetCinemas = cinemaId 
    ? [cinemas.find(c => c.id === cinemaId)]
    : cinemas
  
  // 3. Get all movies
  const movies = await fetch('/api/v1/movies')
  
  // 4. If movieId specified, only use that; else use all
  const targetMovies = movieId 
    ? [movies.find(m => m.id === movieId)]
    : movies
  
  // 5. Fetch showtimes for each cinema-movie combo
  const allShowtimes = []
  for (const cinema of targetCinemas) {
    for (const movie of targetMovies) {
      const showtimes = await fetch(
        `/api/v1/cinemas/${cinema.id}/movies/${movie.id}/showtimes/admin`
      )
      allShowtimes.push(...showtimes)
    }
  }
  
  // 6. Filter by date client-side
  return allShowtimes.filter(st => 
    new Date(st.startTime).toDateString() === date.toDateString()
  )
}
```

### Backend Enhancement Needed (Recommended!)
- 🔴 **Request:** Create endpoint ID 5.1
  - `GET /api/v1/showtimes/admin?date=YYYY-MM-DD&cinemaId=xxx&movieId=xxx`
  - All params optional
  - **Effort:** Medium (3-4 hours)
  - Reuse existing `ShowtimeService.adminGetMovieShowtimes()` logic but make filters optional

### Implementation Notes
- ⚠️ **Workaround is complex** - Recommend requesting backend enhancement
- Current implementation uses mock data + filters
- For MVP: Can use limited workaround with required cinemaId OR request backend change first

---

## 🎬 MOVIE RELEASES PAGE
**Route:** `/dashboard/movie-releases`

### Current Functionality
- [x] List movie releases grouped by movie
- [x] Filter by movie status (upcoming, active, ended)
- [x] Create new release
- [x] Edit release
- [x] Delete release
- [x] Create showtimes from release

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú |
|--------|---------|---------|--------|--------|--------|---------|
| 1 | Get all releases for movie | `GET /api/v1/movies/:id/releases` | 6.1 | ✅ Có | Ready | Grouped by movie |
| 2 | Get all movies | `GET /api/v1/movies` | 1.1 | ✅ Có | Ready | For filtering/grouping |
| 3 | Create release | `POST /api/v1/movie-releases` | 6.2 | ✅ Có | Ready | Body: { movieId, startDate, endDate, status, note } |
| 4 | Update release | `PUT /api/v1/movie-releases/:id` | 6.3 | ✅ Có | Ready | Partial update |
| 5 | Delete release | `DELETE /api/v1/movie-releases/:id` | 6.4 | ✅ Có | Ready | Soft or hard delete |
| 6 | Batch create showtimes | `POST /api/v1/showtimes/batch` | 5.4 | ✅ Có | Ready | Triggered from release actions (separate page) |

### Dropdown Dependencies
- **Movies:** `GET /api/v1/movies` (1.1) ✅ Ready
- **Cinemas:** `GET /api/v1/cinemas/filters` (3.1) ✅ Ready
- **Halls:** `GET /api/v1/halls/cinema/:cinemaId` (5.2) ✅ Ready

### Implementation Notes
- ✅ **ALL APIs are ready** - No backend changes needed
- This page has a special "Create Showtimes" action that links to batch-showtimes page
- Should show releases for each movie with status badges

### Data Fetching Flow
```typescript
// 1. Fetch all movies
const movies = await GET /api/v1/movies

// 2. For each movie, fetch its releases
for (const movie of movies) {
  const releases = await GET /api/v1/movies/${movie.id}/releases
  movie.releases = releases
}

// 3. Display grouped + sorted by date
```

---

## 📦 BATCH SHOWTIMES PAGE
**Route:** `/dashboard/batch-showtimes`

### Current Functionality
- [x] Select movie release
- [x] Select cinema & hall
- [x] Set date range & repeat pattern
- [x] Select time slots
- [x] Configure format & language
- [x] Batch create showtimes

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú |
|--------|---------|---------|--------|--------|--------|---------|
| 1 | Get movie releases | `GET /api/v1/movies/:id/releases` | 6.1 | ✅ Có | Ready | For release selection |
| 2 | Get all movies | `GET /api/v1/movies` | 1.1 | ✅ Có | Ready | For dropdown |
| 3 | Get all cinemas | `GET /api/v1/cinemas/filters` | 3.1 | ✅ Có | Ready | For cinema selection |
| 4 | Get halls by cinema | `GET /api/v1/halls/cinema/:cinemaId` | 5.2 | ✅ Có | Ready | For hall selection |
| 5 | Create batch showtimes | `POST /api/v1/showtimes/batch` | 5.4 | ✅ Có | Ready | Bulk create with repeat pattern |

### Dropdown Dependencies
- **Movies:** `GET /api/v1/movies` (1.1) ✅ Ready
- **Movie Releases:** `GET /api/v1/movies/:id/releases` (6.1) ✅ Ready (select after movie)
- **Cinemas:** `GET /api/v1/cinemas/filters` (3.1) ✅ Ready
- **Halls:** `GET /api/v1/halls/cinema/:cinemaId` (5.2) ✅ Ready (select after cinema)

### Implementation Notes
- ✅ **ALL APIs are ready** - No backend changes needed
- This is a complex form with cascading dropdowns
- Batch create payload should support repeat patterns:
  - Daily
  - Weekly (specify weekdays)
  - Custom weekdays
- Response should include created showtime IDs for confirmation

### Form Submission Example
```typescript
const batchPayload = {
  movieId: "m123",
  movieReleaseId: "r456",
  cinemaId: "c789",
  hallId: "h101",
  startDate: "2025-01-15",
  endDate: "2025-01-30",
  timeSlots: ["10:00", "13:30", "16:00", "19:00", "22:00"],
  repeatType: "DAILY",  // or "WEEKLY", "CUSTOM_WEEKDAYS"
  weekdays: [1, 2, 3, 4, 5],  // only for CUSTOM_WEEKDAYS
  format: "2D",
  language: "VIETNAMESE",
  subtitles: ["ENGLISH"]
}

// POST /api/v1/showtimes/batch
```

---

## 💺 SHOWTIME SEATS PAGE
**Route:** `/dashboard/showtime-seats`

### Current Functionality
- [x] Select showtime (cinema/movie date/hall)
- [x] Display seat map with status
- [x] Show seat details
- [x] Show booking info (who reserved)
- [x] View seat type & reservation status

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú | Note |
|--------|---------|---------|--------|--------|--------|---------|------|
| 1 | Get all cinemas | `GET /api/v1/cinemas/filters` | 3.1 | ✅ Có | Ready | For cinema dropdown |
| 2 | Get movies for cinema | `GET /api/v1/movies` | 1.1 | ✅ Có | Ready | Filter client-side or combine with cinema |
| 3 | Get showtimes for movie | `GET /api/v1/cinemas/:cinemaId/movies/:movieId/showtimes/admin` | - | ✅ Có | Ready | Need both cinema & movie (see Showtimes page workaround) |
| 4 | Get seats for showtime | `GET /api/v1/showtimes/:id/seats` | 5.7 | ✅ Có | Ready | Main data display |
| 5 | Get hall details (backup) | `GET /api/v1/halls/hall/:hallId` | 4.2 | ✅ Có | Ready | Fallback for seat map if 5.7 doesn't include seats |

### Workaround Needed
- **Same issue as Showtimes page:** Getting showtimes with flexible filters
- Use same workaround as described in Showtimes section

### Implementation Notes
- ✅ **Most APIs are ready** - Just need showtime filtering workaround
- Display is read-only (no seat status updates from this page)
- Seat status can be updated from **Seat-Status page** using API 4.6
- Current implementation uses mock seats + shows seat type + reservation status

### Response Format Expected (from API 5.7)
```typescript
interface ShowtimeSeat {
  id: string;
  seatNumber: string;  // "A1", "A2", etc
  row: string;         // "A", "B", "C"
  seatType: 'STANDARD' | 'VIP' | 'COUPLE' | 'PREMIUM' | 'WHEELCHAIR';
  seatStatus: 'ACTIVE' | 'BROKEN' | 'MAINTENANCE';  // Seat physical status
  reservationStatus: 'AVAILABLE' | 'HELD' | 'CONFIRMED' | 'CANCELLED';
  reservedBy?: string;  // User name if reserved
  reservedAt?: string;  // Reservation time
}
```

---

## 💰 TICKET PRICING PAGE
**Route:** `/dashboard/ticket-pricing`

### Current Functionality
- [x] Select cinema & hall
- [x] Display pricing table (seat type × day type)
- [x] Edit prices in-line
- [x] Save price changes
- [x] Auto-suggest pricing

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú |
|--------|---------|---------|--------|--------|--------|---------|
| 1 | Get all cinemas | `GET /api/v1/cinemas/filters` | 3.1 | ✅ Có | Ready | For cinema selection |
| 2 | Get halls by cinema | `GET /api/v1/halls/cinema/:cinemaId` | 5.2 | ✅ Có | Ready | For hall selection |
| 3 | Get pricing for hall | `GET /api/v1/ticket-pricings/hall/:hallId` | 7.1 | ✅ Có | Ready | Main data display |
| 4 | Update ticket price | `PATCH /api/v1/ticket-pricings/pricing/:pricingId` | 7.2 | ✅ Có | Ready | Individual price updates |

### Dropdown Dependencies
- **Cinemas:** `GET /api/v1/cinemas/filters` (3.1) ✅ Ready
- **Halls:** `GET /api/v1/halls/cinema/:cinemaId` (5.2) ✅ Ready

### Implementation Notes
- ✅ **ALL APIs are ready** - No backend changes needed
- Display as table: Rows = Seat Types (STANDARD, VIP, COUPLE, PREMIUM, WHEELCHAIR)
- Columns = Day Types (WEEKDAY, WEEKEND, HOLIDAY)
- Each cell is editable with inline input
- Batch update capability optional

### Response Format Expected (from API 7.1)
```typescript
interface TicketPricing {
  id: string;
  hallId: string;
  seatType: 'STANDARD' | 'VIP' | 'COUPLE' | 'PREMIUM' | 'WHEELCHAIR';
  dayType: 'WEEKDAY' | 'WEEKEND' | 'HOLIDAY';
  price: number;
  currency: string;  // 'VND', 'USD', etc
  effectiveFrom: string;  // ISO date
  effectiveUntil?: string;
}
```

---

## 🪑 SEAT STATUS PAGE
**Route:** `/dashboard/seat-status`

### Current Functionality
- [x] Select cinema & hall
- [x] Display seat map with status indicators
- [x] Filter by seat status (active, broken, maintenance)
- [x] Update individual seat status
- [x] Bulk status updates (optional)

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú |
|--------|---------|---------|--------|--------|--------|---------|
| 1 | Get all cinemas | `GET /api/v1/cinemas/filters` | 3.1 | ✅ Có | Ready | For cinema selection |
| 2 | Get halls by cinema | `GET /api/v1/halls/cinema/:cinemaId` | 5.2 | ✅ Có | Ready | For hall selection |
| 3 | Get hall with seats | `GET /api/v1/halls/hall/:hallId` | 4.2 | ✅ Có | Ready | Get full seat map |
| 4 | Update seat status | `PATCH /api/v1/halls/seat/:seatId/status` | 4.6 | ✅ Có | Ready | Change status (ACTIVE, BROKEN, MAINTENANCE) |

### Dropdown Dependencies
- **Cinemas:** `GET /api/v1/cinemas/filters` (3.1) ✅ Ready
- **Halls:** `GET /api/v1/halls/cinema/:cinemaId` (5.2) ✅ Ready

### Implementation Notes
- ✅ **ALL APIs are ready** - No backend changes needed
- Visual seat map: Show seats with color coding by status
  - 🟢 ACTIVE (available)
  - 🔴 BROKEN (unavailable)
  - 🟡 MAINTENANCE (temporarily unavailable)
- Click seat to open dialog and change status
- Use ID 4.2 to get initial seat map, then update individual seats with ID 4.6

### Response Format Expected (from API 4.2)
```typescript
interface HallWithSeats {
  id: string;
  name: string;
  capacity: number;
  rows: number;
  seats: {
    id: string;
    seatNumber: string;  // "A1", "A2", etc
    row: string;         // "A", "B", "C"
    type: 'STANDARD' | 'VIP' | 'COUPLE' | 'PREMIUM' | 'WHEELCHAIR';
    status: 'ACTIVE' | 'BROKEN' | 'MAINTENANCE';
  }[]
}
```

---

## 📋 RESERVATIONS PAGE
**Route:** `/dashboard/reservations`

### Current Functionality
- [x] List all reservations (admin view)
- [x] Filter by status (confirmed, pending, cancelled)
- [x] Search by customer name / booking ID
- [x] View reservation details
- [x] Change reservation status
- [x] View seat details
- [x] Download reservation list (optional)

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú |
|--------|---------|---------|--------|--------|--------|---------|
| 1 | Get all reservations | `GET /api/v1/bookings/admin/all?status=CONFIRMED&startDate=2025-01-01` | 9.1 | ✅ Có | Ready | List with filters |
| 2 | Get reservation details | `GET /api/v1/bookings/:id/summary` | 9.2 | ✅ Có | Ready | Full booking info with seats |
| 3 | Update reservation status | `PUT /api/v1/bookings/admin/:id/status` | 9.3 | ✅ Có | Ready | Change status (CONFIRMED, CANCELLED, etc) |

### Filter Options (from API 9.1)
- `status`: CONFIRMED, PENDING, CANCELLED
- `startDate`: ISO date (YYYY-MM-DD)
- `endDate`: ISO date (optional)
- `cinemaId`: Filter by cinema (if supported)
- `movieId`: Filter by movie (if supported)

### Implementation Notes
- ✅ **ALL APIs are ready** - No backend changes needed
- Default view: Show all reservations from past 30 days with CONFIRMED status
- Tab/Status filter to switch views (All, Confirmed, Pending, Cancelled)
- Dialog to show full details + option to change status
- Current implementation uses mock data + shows tabs

### Response Format Expected (from API 9.1)
```typescript
interface Reservation {
  id: string;
  bookingCode: string;
  userId: string;
  userName: string;
  movieTitle: string;
  cinemaName: string;
  hallName: string;
  showtimeDate: string;
  showtimeTime: string;
  seats: string[];  // ["A1", "A2"]
  totalPrice: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}
```

---

## 👥 STAFF PAGE
**Route:** `/dashboard/staff`

### Current Functionality
- [x] List all staff
- [x] Filter by role (admin, manager, staff)
- [x] Filter by status (active, inactive)
- [x] Create new staff member
- [x] Edit staff info
- [x] Delete/Deactivate staff
- [x] Assign cinema to staff

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú | Workaround |
|--------|---------|---------|--------|--------|--------|---------|-----------|
| 1 | Get staff list | `GET /api/v1/users?role=MANAGER&status=ACTIVE` | 8.1 | ❌ Không | ⚠️ Workaround | No role/status filtering | **Option A:** Call `GET /api/v1/users` (returns all Clerk users), then filter client-side **Option B:** Get User roles separately, then match **Option C:** Ask backend to implement (4-6 hours) |
| 2 | Create staff | `POST /api/v1/staff` | 8.2 | ❌ Không | ❌ Missing | No endpoint for staff CRUD | Needs backend implementation (see guide) |
| 3 | Update staff | `PATCH /api/v1/staff/:id` | 8.3 | ❌ Không | ❌ Missing | No endpoint | Needs backend implementation |
| 4 | Delete staff | `DELETE /api/v1/staff/:id` | 8.4 | ❌ Không | ❌ Missing | No endpoint | Needs backend implementation |
| 5 | Get all cinemas | `GET /api/v1/cinemas/filters` | 3.1 | ✅ Có | Ready | For cinema assignment dropdown |

### Workaround for Get Staff List (8.1)
Until backend implements proper staff endpoints:

```typescript
// Option A: Use Clerk API (if integrated)
async function getStaffList(filters?: { role?: string, status?: string }) {
  // Get users from Clerk
  const clerkUsers = await fetch('/api/v1/users')
  
  // Optionally fetch UserRole table if backend exposes it
  // const userRoles = await fetch('/api/v1/user-roles')
  
  // Filter client-side
  return clerkUsers.filter(user => {
    if (filters?.role && user.role !== filters.role) return false
    if (filters?.status && user.status !== filters.status) return false
    return true
  })
}

// Option B: Wait for backend to implement proper endpoint
```

### Backend Implementation Needed (High Priority)
- 🔴 **ID 8.1:** Staff list with filters
  - `GET /api/v1/staff?role=MANAGER&status=ACTIVE&cinemaId=xxx`
  - **Effort:** Medium (4-6 hours)

- 🔴 **ID 8.2:** Create staff
  - `POST /api/v1/staff`
  - **Effort:** Medium (3-4 hours)

- 🔴 **ID 8.3:** Update staff
  - `PATCH /api/v1/staff/:id`
  - **Effort:** Medium (2-3 hours)

- 🔴 **ID 8.4:** Delete staff
  - `DELETE /api/v1/staff/:id`
  - **Effort:** Low (1-2 hours)

### Implementation Notes
- ❌ **3 out of 4 APIs missing** - Cannot fully implement this module until backend adds staff CRUD
- Recommend adding `staff_profiles` table (see API_ALIGNMENT_GUIDE for schema)
- Dropdown for cinemas needed for staff assignment

---

## ⭐ REVIEWS PAGE
**Route:** `/dashboard/reviews`

### Current Functionality
- [x] List all movie reviews
- [x] Filter by rating
- [x] Filter by status (active, hidden, deleted)
- [x] Search by movie or reviewer name
- [x] View review details
- [x] Hide/Delete review (soft delete)
- [x] See likes/dislikes
- [x] See verification badge

### API Requirements

| Thứ Tự | Chức Năng | API Call | API ID | Có sẵn? | Status | Ghi Chú |
|--------|---------|---------|--------|--------|--------|---------|
| 1 | Get all reviews | `GET /api/v1/reviews?status=ACTIVE&movieId=xxx` | 11.1 | ❌ Không | ❌ Missing | No reviews API exists |
| 2 | Get review details | `GET /api/v1/reviews/:id` | 11.2 | ❌ Không | ❌ Missing | No reviews API exists |
| 3 | Update review status | `PATCH /api/v1/reviews/:id/status` | 11.3 | ❌ Không | ❌ Missing | No reviews API exists |
| 4 | Delete review | `DELETE /api/v1/reviews/:id` | 11.4 | ❌ Không | ❌ Missing | No reviews API exists |
| 5 | Get movies for filter | `GET /api/v1/movies` | 1.1 | ✅ Có | Ready | For movie filter dropdown |

### Backend Implementation Needed (Lower Priority)
- 🔴 **ID 11.1:** Get reviews list with filters
  - `GET /api/v1/reviews?status=ACTIVE&rating=4&movieId=xxx&page=1&limit=20`
  - **Effort:** Medium (3-4 hours)

- 🔴 **ID 11.2:** Get review details
  - `GET /api/v1/reviews/:id`
  - **Effort:** Low (1 hour)

- 🔴 **ID 11.3:** Update review status
  - `PATCH /api/v1/reviews/:id/status`
  - Body: `{ status: 'ACTIVE' | 'HIDDEN' | 'DELETED' }`
  - **Effort:** Low (1-2 hours)

- 🔴 **ID 11.4:** Delete review
  - `DELETE /api/v1/reviews/:id`
  - **Effort:** Low (1 hour)

### Workaround
- Currently using mock reviews data from `mockData.ts`
- Can continue using mocks until backend provides real API
- Focus on UI/UX first, implement API later

### Implementation Notes
- ❌ **No reviews API exists** - Must use mock data or request backend
- Page shows review cards with: movie, rating, reviewer, text, likes/dislikes, status
- Status filter to show ACTIVE, HIDDEN, DELETED reviews
- Soft delete pattern (status change) recommended

---

## 📊 REPORTS PAGE
**Route:** `/dashboard/reports`

### Current Functionality
- [x] Revenue reports (monthly trend)
- [x] Movie performance (top movies)
- [x] Cinema performance
- [x] Genre breakdown
- [x] Occupancy rate
- [x] Hourly distribution
- [x] Date range filters
- [x] Export to CSV (optional)

### API Requirements

| Thứ Tự | Report Type | API Call | API ID | Có sẵn? | Status | Ghi Chú | Workaround |
|--------|-------------|---------|--------|--------|--------|---------|-----------|
| 1 | Revenue by period | `GET /api/v1/bookings/admin/revenue-report?startDate=xxx&endDate=xxx&groupBy=day` | 10.1 | ✅ Có | Ready | Revenue over time (monthly/daily) |
| 2 | Revenue by cinema | `GET /api/v1/reports/revenue-by-cinema?startDate=xxx&endDate=xxx` | 10.2 | ❌ Không | ❌ Missing | Per-cinema revenue breakdown |
| 3 | Revenue by movie | `GET /api/v1/reports/revenue-by-movie?startDate=xxx&endDate=xxx` | 10.3 | ❌ Không | ❌ Missing | Per-movie revenue breakdown |
| 4 | Occupancy rate | `GET /api/v1/reports/occupancy?startDate=xxx&endDate=xxx` | 10.4 | ❌ Không | ❌ Missing | Seat occupancy rate |
| 5 | Ticket sales by type | `GET /api/v1/reports/ticket-sales?seatType=VIP&startDate=xxx` | 10.5 | ❌ Không | ❌ Missing | Sales by seat type (STANDARD, VIP, COUPLE, etc) |
| 6 | Peak hours | `GET /api/v1/reports/peak-hours?startDate=xxx&endDate=xxx` | 10.6 | ❌ Không | ❌ Missing | Sales by time slot |
| 7 | Top movies | Use ID 10.1 + 10.3 | - | ⚠️ Partial | Workaround | Combine revenue-report + movie revenue |

### Backend Implementation Needed (Medium Priority)
- 🟡 **ID 10.1:** Revenue report (Partially available)
  - ✅ Exists as `revenue-report` but may need adjustment
  - Check if supports `groupBy` parameter

- 🔴 **ID 10.2:** Revenue by cinema
  - `GET /api/v1/reports/revenue-by-cinema?startDate=xxx&endDate=xxx`
  - Returns: `[ { cinemaId, cinemaName, revenue, ticketCount } ]`
  - **Effort:** Medium (3-4 hours)

- 🔴 **ID 10.3:** Revenue by movie
  - `GET /api/v1/reports/revenue-by-movie?startDate=xxx&endDate=xxx`
  - Returns: `[ { movieId, movieTitle, revenue, ticketCount, avgRating } ]`
  - **Effort:** Medium (3-4 hours)

- 🔴 **ID 10.4:** Occupancy rate
  - `GET /api/v1/reports/occupancy?startDate=xxx&endDate=xxx&groupBy=cinema|movie`
  - Returns: `[ { period, occupancyRate: 0-100 } ]`
  - **Effort:** Medium (4-5 hours)

- 🔴 **ID 10.5:** Ticket sales by seat type
  - `GET /api/v1/reports/ticket-sales?startDate=xxx&endDate=xxx&groupBy=seatType|day`
  - Returns: `[ { seatType, count, revenue } ]`
  - **Effort:** Medium (3-4 hours)

- 🔴 **ID 10.6:** Peak hours analysis
  - `GET /api/v1/reports/peak-hours?startDate=xxx&endDate=xxx`
  - Returns: `[ { timeSlot: "10:00", revenue, ticketCount } ]`
  - **Effort:** Medium (3-4 hours)

### Workaround Using Existing API
Until all report endpoints are implemented, use ID 10.1:

```typescript
// Current: Get revenue by date period
const revenueData = await fetch(
  '/api/v1/bookings/admin/revenue-report?startDate=2025-01-01&endDate=2025-12-31&groupBy=day'
)

// Enhanced workaround for other reports:

// 1. Revenue by Cinema (Combine APIs)
async function getRevenueByCinema(startDate, endDate) {
  // Get all cinemas
  const cinemas = await fetch('/api/v1/cinemas/filters')
  
  // Get all bookings
  const bookings = await fetch('/api/v1/bookings/admin/all?startDate=' + startDate)
  
  // Group by cinema client-side
  const byCinema = {}
  cinemas.forEach(c => {
    byCinema[c.id] = {
      cinemaName: c.name,
      revenue: 0,
      ticketCount: 0
    }
  })
  
  bookings.forEach(b => {
    if (b.cinemaId in byCinema) {
      byCache[b.cinemaId].revenue += b.totalPrice
      byCache[b.cinemaId].ticketCount += b.seats.length
    }
  })
  
  return Object.values(byCache)
}

// 2. Top Movies (Combine APIs)
async function getTopMovies(startDate, endDate) {
  const movies = await fetch('/api/v1/movies')
  const bookings = await fetch('/api/v1/bookings/admin/all?startDate=' + startDate)
  
  const byMovie = {}
  movies.forEach(m => {
    byMovie[m.id] = {
      movieTitle: m.name,
      revenue: 0,
      ticketCount: 0,
      avgRating: m.rating
    }
  })
  
  bookings.forEach(b => {
    if (b.movieId in byMovie) {
      byMovie[b.movieId].revenue += b.totalPrice
      byMovie[b.movieId].ticketCount += b.seats.length
    }
  })
  
  return Object.values(byMovie).sort((a, b) => b.revenue - a.revenue)
}
```

### Implementation Notes
- 🟡 **1 out of 7 APIs available** - Others need backend implementation
- Workaround viable for Revenue by Cinema and Top Movies
- Charts shown: Line chart (revenue), Bar chart (top movies), Pie charts (cinema/genre breakdown)
- Date range picker for filtering
- Current: Uses mock data with hardcoded charts

---

## ⚙️ SETTINGS PAGE
**Route:** `/dashboard/settings`

### Current Functionality
- [x] Profile settings (name, email, phone)
- [x] Notification preferences
- [x] Security settings (password, 2FA)
- [x] System settings (timezone, language)
- [x] Appearance (theme, dark mode)
- [x] Billing info (optional)
- [x] Save to localStorage

### API Requirements

| Thứ Tự | Setting Group | API Call | API ID | Có sẵn? | Status | Ghi Chú |
|--------|---------------|---------|--------|--------|--------|---------|
| 1 | Get profile | `GET /api/v1/admin/profile` | - | ❌ Không | ❌ Missing | User profile info |
| 2 | Update profile | `PUT /api/v1/admin/profile` | - | ❌ Không | ❌ Missing | Name, email, phone, avatar |
| 3 | Get notifications | `GET /api/v1/admin/notifications` | - | ❌ Không | ❌ Missing | Notification preferences |
| 4 | Update notifications | `PUT /api/v1/admin/notifications` | - | ❌ Không | ❌ Missing | Preference toggles |
| 5 | Get security | `GET /api/v1/admin/security` | - | ❌ Không | ❌ Missing | 2FA, password policy |
| 6 | Update password | `PUT /api/v1/admin/security/password` | - | ❌ Không | ❌ Missing | Change password |
| 7 | Get appearance | `GET /api/v1/admin/appearance` | - | ❌ Không | ❌ Missing | Theme, dark mode |
| 8 | Update appearance | `PUT /api/v1/admin/appearance` | - | ❌ Không | ❌ Missing | Theme preference |

### Backend Implementation Needed (Lower Priority)
- 🔴 **ID Admin.1:** Get admin profile
  - `GET /api/v1/admin/profile`
  - Returns: `{ id, name, email, phone, avatar, createdAt }`
  - **Effort:** Low (1-2 hours)

- 🔴 **ID Admin.2:** Update admin profile
  - `PUT /api/v1/admin/profile`
  - Body: `{ name, email, phone, avatar }`
  - **Effort:** Low (1-2 hours)

- 🔴 **ID Admin.3:** Get notifications
  - `GET /api/v1/admin/notifications`
  - Returns: `{ emailNotifications, pushNotifications, ... }`
  - **Effort:** Low (1-2 hours)

- 🔴 **ID Admin.4:** Update notifications
  - `PUT /api/v1/admin/notifications`
  - Body: settings object
  - **Effort:** Low (1-2 hours)

- 🔴 **ID Admin.5:** Get security settings
  - `GET /api/v1/admin/security`
  - Returns: `{ twoFactorEnabled, lastPasswordChange, ... }`
  - **Effort:** Low (1-2 hours)

- 🔴 **ID Admin.6:** Update password
  - `PUT /api/v1/admin/security/password`
  - Body: `{ currentPassword, newPassword }`
  - **Effort:** Low (2-3 hours)

- 🔴 **ID Admin.7:** Get appearance
  - `GET /api/v1/admin/appearance`
  - Returns: `{ theme: 'light' | 'dark', ... }`
  - **Effort:** Low (1 hour)

- 🔴 **ID Admin.8:** Update appearance
  - `PUT /api/v1/admin/appearance`
  - Body: `{ theme, ... }`
  - **Effort:** Low (1 hour)

### Current Workaround
- Settings stored in `localStorage` (Browser storage)
- Persists between sessions but not synced across devices
- Good for MVP, but should migrate to backend

### Implementation Notes
- ❌ **No settings API exists** - Using localStorage currently
- For MVP: Can keep localStorage approach
- Later: Implement backend endpoints for cloud sync
- Profile: Consider using Clerk API for user management (if integrated)
- Notification preferences: Should be stored in database

---

## 📝 SUMMARY TABLE - By Implementation Status

### ✅ READY TO IMPLEMENT (34 APIs, 8 Modules)
| Module | APIs | Route | Status |
|--------|------|-------|--------|
| Movies | 1.1-1.4 | GET/POST/PUT/DELETE /movies | ✅ All ready |
| Genres | 2.1-2.4 | GET/POST/PUT/DELETE /genres | ✅ All ready |
| Cinemas | 3.1-3.4 | GET/POST/PATCH/DELETE /cinemas | ✅ All ready |
| Halls | 4.2-4.6 | GET/POST/PATCH/DELETE /halls, PATCH /seat | ✅ All ready |
| Movie Releases | 6.1-6.4 | GET/POST/PUT/DELETE /movie-releases | ✅ All ready |
| Ticket Pricing | 7.1-7.2 | GET/PATCH /ticket-pricings | ✅ All ready |
| Batch Showtimes | 5.4 | POST /showtimes/batch | ✅ Ready |
| Reservations | 9.1-9.3 | GET/PUT /bookings | ✅ All ready |

### ⚠️ NEED WORKAROUND (3 APIs, 3 Modules)
| Module | Missing API | Workaround | Effort |
|--------|-------------|-----------|--------|
| Halls List | 4.1 (GET /halls) | Combine 3.1 + 5.2 (loop) | Low |
| Showtimes | 5.1 (flexible filters) | Combine cinemas + movies + filter | Medium |
| Showtime Seats | 5.1 (flexible filters) | Same as Showtimes | Medium |

### ❌ NEED BACKEND IMPLEMENTATION (13 APIs, 5 Modules)
| Module | Missing APIs | Effort | Priority |
|--------|-------------|--------|----------|
| Staff | 8.1-8.4 (4 APIs) | 10-15 hours | 🔴 HIGH |
| Reviews | 11.1-11.4 (4 APIs) | 10-12 hours | 🟡 MEDIUM |
| Reports | 10.2-10.6 (5 APIs) | 15-20 hours | 🟡 MEDIUM |
| Settings | Admin.1-8 (8 APIs) | 10-15 hours | 🟢 LOW |

---

## 🎯 RECOMMENDED IMPLEMENTATION ORDER

### Phase 1: MVP (Week 1-2) - ✅ Ready Now
1. **Movies** - Simple CRUD
2. **Genres** - Simple CRUD
3. **Cinemas** - Manage locations
4. **Halls** - List with workaround (combine 3.1 + 5.2)
5. **Ticket Pricing** - Manage prices
6. **Seat Status** - Update seats
7. **Batch Showtimes** - Create shows in bulk
8. **Movie Releases** - Manage movie availability

### Phase 2: Core Features (Week 3-4) - ⚠️ With Workaround
9. **Showtimes** - List & manage with flexible filters (workaround)
10. **Showtime Seats** - View seats with workaround
11. **Reservations** - View & manage bookings

### Phase 3: Enhanced Features (Week 5+) - ❌ Need Backend
12. **Reports** - Analytics (after 5.1, 10.2-10.6 implemented)
13. **Staff** - Manage users (after 8.1-8.4 implemented)
14. **Reviews** - Moderate reviews (after 11.1-11.4 implemented)
15. **Settings** - User preferences (after Admin.1-8 implemented)

---

## 🔧 BACKEND PRIORITIES (For Development Team)

### 🔴 HIGH PRIORITY (Blocking Core Features)
1. **ID 5.1:** `GET /api/v1/showtimes/admin` with flexible filters
   - **Blocks:** Showtimes page (2 workaround APIs), Showtime-Seats page
   - **Effort:** Medium (3-4 hours)
   - **Recommend:** Do this FIRST

2. **ID 8.1-8.4:** Staff CRUD endpoints
   - **Blocks:** Staff page entirely
   - **Effort:** Medium (10-15 hours)
   - **Recommend:** Do this SECOND

3. **ID 4.1:** `GET /api/v1/halls` (optional cinemaId)
   - **Blocks:** Halls list page (workaround viable but inefficient)
   - **Effort:** Low (1-2 hours)
   - **Recommend:** Quick win, do THIRD

### 🟡 MEDIUM PRIORITY (Enhanced Features)
4. **ID 10.2-10.6:** Report endpoints
   - **Blocks:** Reports page analytics
   - **Effort:** Medium-High (15-20 hours)
   - **Recommend:** After core features working

5. **ID 11.1-11.4:** Reviews endpoints
   - **Blocks:** Reviews page entirely
   - **Effort:** Medium (10-12 hours)
   - **Recommend:** After core features working

### 🟢 LOW PRIORITY (Polish)
6. **ID Admin.1-8:** Settings/Profile endpoints
   - **Blocks:** Settings page (localStorage workaround viable)
   - **Effort:** Low (10-15 hours)
   - **Recommend:** Last, after MVP features

---

## 📋 CHECKLIST FOR FRONTEND INTEGRATION

- [ ] **Phase 1: Setup**
  - [ ] Review API_ALIGNMENT_GUIDE.md (done ✅)
  - [ ] Update API base URL in `lib/api.ts`
  - [ ] Remove mock data imports from phase 1 pages
  - [ ] Implement real API calls

- [ ] **Phase 1: Movies Module**
  - [ ] `GET /api/v1/movies` - List with pagination
  - [ ] `POST /api/v1/movies` - Create
  - [ ] `PUT /api/v1/movies/:id` - Update
  - [ ] `DELETE /api/v1/movies/:id` - Delete
  - [ ] `GET /api/v1/genres` - Dropdown

- [ ] **Phase 1: Genres Module**
  - [ ] `GET /api/v1/genres` - List
  - [ ] `POST /api/v1/genres` - Create
  - [ ] `PUT /api/v1/genres/:id` - Update
  - [ ] `DELETE /api/v1/genres/:id` - Delete

- [ ] **Phase 1: Cinemas Module**
  - [ ] `GET /api/v1/cinemas/filters` - List
  - [ ] `POST /api/v1/cinemas/cinema` - Create
  - [ ] `PATCH /api/v1/cinemas/cinema/:id` - Update
  - [ ] `DELETE /api/v1/cinemas/cinema/:id` - Delete

- [ ] **Phase 1: Halls Module** (with workaround)
  - [ ] Implement workaround: `GET /cinemas/filters` + loop `GET /halls/cinema/:id`
  - [ ] `GET /api/v1/halls/hall/:id` - Details
  - [ ] `POST /api/v1/halls/hall` - Create
  - [ ] `PATCH /api/v1/halls/hall/:id` - Update
  - [ ] `DELETE /api/v1/halls/hall/:id` - Delete

- [ ] **Phase 1: Seat Status Module**
  - [ ] `GET /api/v1/halls/hall/:id` - Get seats
  - [ ] `PATCH /api/v1/halls/seat/:id/status` - Update status

- [ ] **Phase 1: Ticket Pricing Module**
  - [ ] `GET /api/v1/cinemas/filters` - Cinema dropdown
  - [ ] `GET /api/v1/halls/cinema/:id` - Hall dropdown
  - [ ] `GET /api/v1/ticket-pricings/hall/:id` - List prices
  - [ ] `PATCH /api/v1/ticket-pricings/pricing/:id` - Update

- [ ] **Phase 1: Batch Showtimes Module**
  - [ ] `GET /api/v1/movies` - Movie dropdown
  - [ ] `GET /api/v1/movies/:id/releases` - Release dropdown
  - [ ] `GET /api/v1/cinemas/filters` - Cinema dropdown
  - [ ] `GET /api/v1/halls/cinema/:id` - Hall dropdown
  - [ ] `POST /api/v1/showtimes/batch` - Create batch

- [ ] **Phase 1: Movie Releases Module**
  - [ ] `GET /api/v1/movies/:id/releases` - List by movie
  - [ ] `POST /api/v1/movie-releases` - Create
  - [ ] `PUT /api/v1/movie-releases/:id` - Update
  - [ ] `DELETE /api/v1/movie-releases/:id` - Delete

- [ ] **Phase 2: Showtimes Module** (after backend ID 5.1)
  - [ ] Wait for `GET /api/v1/showtimes/admin` OR implement workaround
  - [ ] `GET /api/v1/halls/cinema/:id` - Hall dropdown
  - [ ] `POST /api/v1/showtimes/showtime` - Create single
  - [ ] `PATCH /api/v1/showtimes/showtime/:id` - Update
  - [ ] `DELETE /api/v1/showtimes/showtime/:id` - Delete

- [ ] **Phase 2: Showtime Seats Module** (after backend ID 5.1)
  - [ ] Implement workaround for showtime filtering
  - [ ] `GET /api/v1/showtimes/:id/seats` - Seat map

- [ ] **Phase 2: Reservations Module**
  - [ ] `GET /api/v1/bookings/admin/all` - List with filters
  - [ ] `GET /api/v1/bookings/:id/summary` - Details
  - [ ] `PUT /api/v1/bookings/admin/:id/status` - Update status

- [ ] **Phase 3: Reports Module** (after backend 10.1-10.6)
  - [ ] `GET /api/v1/bookings/admin/revenue-report` - Revenue (ID 10.1)
  - [ ] `GET /api/v1/reports/revenue-by-cinema` - (ID 10.2, waiting)
  - [ ] `GET /api/v1/reports/revenue-by-movie` - (ID 10.3, waiting)
  - [ ] `GET /api/v1/reports/occupancy` - (ID 10.4, waiting)
  - [ ] `GET /api/v1/reports/ticket-sales` - (ID 10.5, waiting)
  - [ ] `GET /api/v1/reports/peak-hours` - (ID 10.6, waiting)

- [ ] **Phase 3: Staff Module** (after backend 8.1-8.4)
  - [ ] `GET /api/v1/staff` - List (ID 8.1, waiting)
  - [ ] `POST /api/v1/staff` - Create (ID 8.2, waiting)
  - [ ] `PATCH /api/v1/staff/:id` - Update (ID 8.3, waiting)
  - [ ] `DELETE /api/v1/staff/:id` - Delete (ID 8.4, waiting)

- [ ] **Phase 3: Reviews Module** (after backend 11.1-11.4)
  - [ ] `GET /api/v1/reviews` - List (ID 11.1, waiting)
  - [ ] `GET /api/v1/reviews/:id` - Details (ID 11.2, waiting)
  - [ ] `PATCH /api/v1/reviews/:id/status` - Update (ID 11.3, waiting)
  - [ ] `DELETE /api/v1/reviews/:id` - Delete (ID 11.4, waiting)

- [ ] **Phase 3: Settings Module** (after backend Admin.1-8)
  - [ ] Profile endpoints (Admin.1-2, waiting)
  - [ ] Notification endpoints (Admin.3-4, waiting)
  - [ ] Security endpoints (Admin.5-6, waiting)
  - [ ] Appearance endpoints (Admin.7-8, waiting)

---

**Document prepared by:** AI Assistant  
**Last updated:** 2025-12-17  
**Status:** Ready for Frontend Implementation Planning
