# BhalFlix - Movie Discovery App

A React-based movie discovery app with mood-based browsing, bear branding, and Stremio integration.

**Rebranded from WatchPicker/tMovies → BhalFlix** (January 2026)

## Quick Start

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 4
- **State Management**: Redux Toolkit (RTK Query) + React Context
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Carousel**: Swiper.js (v8) with FreeMode + Mousewheel

## Project Structure

```
src/
├── assets/svg/
│   └── bhalflix-logo.svg    # Bear logo (flat brown, comic style)
├── common/
│   ├── Header/              # Navigation bar
│   ├── Logo/                # BhalFlix bear logo component
│   ├── MovieCard/           # Poster card (220x330px desktop)
│   ├── MoodSelector/        # 8-mood grid selector
│   ├── MoodSection/         # NEW: Mood-based content carousel
│   ├── Section/             # Content carousel with Swiper
│   ├── SideBar/             # Nav menu + theme + sound toggle
│   ├── Loader/              # SkeletonLoader component
│   └── index.ts             # Barrel exports
├── constants/
│   ├── index.ts             # Nav links, home sections
│   └── moods.ts             # 8 mood definitions with genre IDs
├── context/
│   ├── audioContext.tsx     # NEW: Startup sound + toggle
│   ├── globalContext.tsx    # Modal & sidebar state
│   ├── themeContext.tsx     # Dark/light/system theme
│   └── watchlistContext.tsx # Watchlist + watched tracking
├── pages/
│   ├── Home/                # Hero + moods + mood sections + trending
│   ├── Catalog/             # Movie/TV listing with badges
│   ├── Detail/              # Detail page with Stremio button
│   ├── Discover/            # Mood & filter-based discovery
│   └── Watchlist/           # Saved movies/shows
├── services/
│   └── TMDB.ts              # RTK Query API (includes getMoodMovies)
├── utils/
│   ├── config.ts            # Environment variables
│   ├── helper.ts            # Utility functions (cn)
│   └── stremio.ts           # Stremio deep link helpers
├── styles/index.ts          # Tailwind class exports (maxWidth: 1400px)
├── types.d.ts               # TypeScript interfaces
└── main.tsx                 # App entry with providers
```

## Key Features

### 1. Bear Branding

- Logo: `src/assets/svg/bhalflix-logo.svg` (flat brown bear, comic style)
- Color: Bear brown `#8B4513` (replaces red accents)
- Background: Netflix-dark `#141414`

### 2. Startup Sound

- Location: `src/context/audioContext.tsx`
- Sound file: `public/sounds/bear-roar.mp3` (~2 seconds)
- Behavior:
  - Plays on first user interaction (click/key/touch)
  - Respects browser autoplay policy
  - `sessionStorage` prevents repeat plays per session
  - `localStorage` persists user sound preference
- Toggle in sidebar: "Sound: On/Off"

### 3. Mood-Based Discovery

- 8 moods in `src/constants/moods.ts`:
  | Mood | Icon | Genres | Gradient |
  |------|------|--------|----------|
  | Feel Good | 😊 | Comedy, Family, Romance | yellow→orange |
  | Thrilling | 🔥 | Action, Thriller, Crime | red→orange |
  | Mind-Bending | 🧠 | Sci-Fi, Mystery | purple→indigo |
  | Scary | 👻 | Horror, Thriller | gray |
  | Epic Adventure | ⚔️ | Adventure, Fantasy, Action | emerald→teal |
  | Relaxing | 🌿 | Animation, Documentary, Family | green→cyan |
  | Romantic | 💕 | Romance, Comedy, Drama | pink→rose |
  | Dramatic | 🎭 | Drama, History, War | blue→indigo |

- **MoodSection component** (`src/common/MoodSection/`):
  - Fetches movies via `useGetMoodMoviesQuery(genreIds)`
  - Gradient header with icon + "See all" link
  - Home page shows first 4 moods

### 4. Enhanced Horizontal Scroll

- **Poster size**: 220×330px (desktop), 150×225px (mobile)
- **Swiper config** (`src/common/Section/MoviesSlides.tsx`):
  - FreeMode + Mousewheel modules
  - `spaceBetween: 20`
  - Horizontal mousewheel scrolling enabled
- **No slice limits**: Shows all 20 results per section
- **Container**: `maxWidth: 1400px` (was 1140px)

### 5. TV Show Watchlist Auto-Add

- Location: `src/context/watchlistContext.tsx`
- **Key behavior**: When a TV show is marked as watched → auto-adds to watchlist
- Visual indicators on TV catalog (`src/pages/Catalog/index.tsx`):
  - Green bookmark badge: In watchlist
  - Blue eye badge: Watched

### 6. Home Page Sections

```typescript
// src/constants/index.ts
sections = [
  { title: "Trending Now", category: "movie", type: "popular" },
  { title: "New Releases", category: "movie", type: "now_playing" },
  { title: "Trending TV Series", category: "tv", type: "popular" },
  { title: "Top Picks", category: "movie", type: "top_rated" },
];
```

## API Endpoints

### TMDB Service (`src/services/TMDB.ts`)

```typescript
useGetShowsQuery(); // List movies/TV (popular, top_rated, search)
useGetShowQuery(); // Single detail with videos, credits, external_ids
useGetDiscoverQuery(); // Filtered discovery
useGetGenresQuery(); // Genre list
useGetMoodMoviesQuery(); // NEW: Fetch by genre IDs for mood sections
```

### Mood Movies Endpoint

```typescript
// Uses TMDB discover with genre filter
getMoodMovies: builder.query({
  query: ({ genreIds, category = "movie", page = 1 }) => ({
    url: `/discover/${category}`,
    params: {
      with_genres: genreIds.join(","),
      page,
      sort_by: "popularity.desc",
    },
  }),
});
```

## Context Providers (in order)

```tsx
// src/main.tsx
<Provider store={store}>           // Redux
  <ThemeProvider>                  // Dark/Light/System
    <AudioProvider>                // Startup sound
      <WatchlistProvider>          // Watchlist + watched
        <GlobalStateProvider>      // Modal/sidebar state
          <App />
```

## localStorage Keys

| Key                         | Purpose                              |
| --------------------------- | ------------------------------------ |
| `watchpicker_watchlist`     | Saved watchlist items                |
| `watchpicker_watched`       | Watched items (triggers TV auto-add) |
| `watchpicker_sound_enabled` | Sound preference (true/false)        |
| `theme`                     | Theme preference                     |

## sessionStorage Keys

| Key                                | Purpose                           |
| ---------------------------------- | --------------------------------- |
| `watchpicker_startup_sound_played` | Prevents sound replay per session |

## Error Handling Patterns

All localStorage/JSON operations wrapped in try-catch:

```typescript
try {
  const saved = localStorage.getItem(KEY);
  return saved ? JSON.parse(saved) : [];
} catch (error) {
  console.warn("Corrupted data, clearing:", error);
  localStorage.removeItem(KEY);
  return [];
}
```

## Routes

| Path             | Component | Description                                     |
| ---------------- | --------- | ----------------------------------------------- |
| `/`              | Home      | Hero + mood selector + mood sections + trending |
| `/discover`      | Discover  | Mood/filter-based browsing                      |
| `/watchlist`     | Watchlist | Saved movies/shows                              |
| `/movie`         | Catalog   | Movie listing                                   |
| `/tv`            | Catalog   | TV series listing (with badges)                 |
| `/:category/:id` | Detail    | Movie/TV detail with Stremio                    |

## Tailwind Theme Extensions

```javascript
// tailwind.config.cjs
colors: {
  'dark-bg': '#141414',      // Netflix-style dark
  'bear-brown': '#8B4513',   // Primary accent
  'bear-light': '#A0522D',   // Light variant
  'bear-dark': '#654321',    // Dark variant
}
```

## Common Tasks

### Add a New Mood

Edit `src/constants/moods.ts`:

```typescript
{
  id: "new-mood",
  title: "New Mood",
  icon: "🎬",
  color: "from-blue-500 to-purple-600",  // Tailwind gradient
  genreIds: [28, 12],  // TMDB genre IDs
  description: "Description here",
}
```

### Change Number of Home Mood Sections

Edit `src/pages/Home/index.tsx`:

```typescript
const homeMoods = moods.slice(0, 4); // Change 4 to desired count
```

### Disable Startup Sound

Set `localStorage.setItem('watchpicker_sound_enabled', 'false')` or use sidebar toggle.

## Build & Deploy

```bash
npm run build    # Production build to /dist
npm run preview  # Preview production build
```

## Repository

- **GitHub**: https://github.com/BEARLY-HODLING/bhalflix
- **Original**: Forked from sudeepmahato16/movie-app

## Known Issues / Future Work

- [ ] Favicon needs bear icon (currently placeholder)
- [ ] Add "Mark as Watched" button to detail page UI
- [ ] Consider user-selectable mood sections on home page
