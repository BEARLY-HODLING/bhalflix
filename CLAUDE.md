# WatchPicker - Movie Discovery App

A React-based movie discovery app that helps users decide what to watch based on mood, then opens content directly in Stremio.

## Quick Start

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit (RTK Query for API) + React Context
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6

## Project Structure

```
src/
├── common/              # Reusable components
│   ├── Header/          # Navigation bar
│   ├── MovieCard/       # Movie poster card
│   ├── MoodSelector/    # Mood-based discovery grid
│   ├── Section/         # Content carousel section
│   └── index.ts         # Barrel exports
├── constants/
│   ├── index.ts         # Navigation links, sections
│   └── moods.ts         # Mood definitions, genres, filters
├── context/
│   ├── globalContext.tsx    # Modal & sidebar state
│   ├── themeContext.tsx     # Dark/light theme
│   └── watchlistContext.tsx # Watchlist (localStorage)
├── pages/
│   ├── Home/            # Homepage with hero + moods + sections
│   ├── Catalog/         # Movie/TV listing with search
│   ├── Detail/          # Movie detail with Stremio button
│   ├── Discover/        # Mood & filter-based discovery
│   └── Watchlist/       # Saved movies
├── services/
│   └── TMDB.ts          # RTK Query API endpoints
├── utils/
│   ├── config.ts        # Environment variables
│   ├── helper.ts        # Utility functions (cn)
│   └── stremio.ts       # Stremio deep link helpers
├── hooks/               # Custom React hooks
├── styles/              # Tailwind class exports
├── types.d.ts           # TypeScript interfaces
├── App.tsx              # Routes configuration
└── main.tsx             # App entry with providers
```

## Key Features

### 1. Mood-Based Discovery
- Located in `src/common/MoodSelector/` and `src/constants/moods.ts`
- 8 moods mapped to TMDB genre IDs
- Click a mood → navigates to `/discover?mood={id}`

### 2. Smart Filters (Discover Page)
- Genre multi-select, year, minimum rating
- Filters stored in URL params for shareability
- Uses TMDB `/discover/{category}` endpoint

### 3. Stremio Integration
- Helper functions in `src/utils/stremio.ts`
- Deep link format: `stremio:///detail/{type}/{imdb_id}/{imdb_id}`
- Button on Detail page fetches IMDB ID via `external_ids` in API response

### 4. Watchlist
- Context in `src/context/watchlistContext.tsx`
- Persisted to localStorage (`watchpicker_watchlist`)
- Syncs across browser tabs

## API Integration

### TMDB Service (`src/services/TMDB.ts`)

```typescript
// Available hooks:
useGetShowsQuery()    // List movies/TV (popular, top_rated, search, similar)
useGetShowQuery()     // Single movie/TV detail with videos, credits, external_ids
useGetDiscoverQuery() // Filtered discovery (genres, year, rating)
useGetGenresQuery()   // Genre list
```

### Environment Variables (`.env`)

```
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_API_KEY=your_tmdb_api_key
```

## Type Definitions (`src/types.d.ts`)

Key interfaces:
- `IMovie` - Basic movie data (id, poster_path, title, overview)
- `IMovieDetail` - Extended with genres, credits, videos, external_ids
- `IMood` - Mood definition with genre mappings
- `IWatchlistItem` - Saved movie with category and timestamp
- `IDiscoverParams` - Filter parameters for discover endpoint

## Styling Patterns

### Tailwind Classes (`src/styles/index.ts`)

```typescript
maxWidth      // Container with responsive padding
watchBtn      // Primary button with hover effects
mainHeading   // Large heading typography
paragraph     // Body text
```

### Theme Support
- Dark mode via `.dark` class on `<html>`
- Theme context in `src/context/themeContext.tsx`
- Toggle in header/sidebar

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Hero carousel + moods + sections |
| `/discover` | Discover | Mood/filter-based browsing |
| `/watchlist` | Watchlist | Saved movies |
| `/movie` | Catalog | Movie listing |
| `/tv` | Catalog | TV series listing |
| `/:category/:id` | Detail | Movie/TV detail page |

## Component Patterns

### Animation (Framer Motion)
```tsx
const { fadeDown, staggerContainer } = useMotion();

<m.div variants={staggerContainer(0.1, 0.2)} initial="hidden" animate="show">
  <m.h2 variants={fadeDown}>Content</m.h2>
</m.div>
```

### Conditional Styling
```tsx
import { cn } from "@/utils/helper";

className={cn(baseStyles, condition && "additional-styles")}
```

## Common Tasks

### Add a New Mood
Edit `src/constants/moods.ts`:
```typescript
{
  id: "new-mood",
  title: "New Mood",
  icon: "🎬",
  color: "from-blue-500 to-purple-600",
  genreIds: [28, 12], // TMDB genre IDs
  description: "Description here",
}
```

### Add a New Filter Option
Edit `yearOptions` or `ratingOptions` in `src/constants/moods.ts`

### Modify Stremio Deep Links
Edit `src/utils/stremio.ts` - supports movies, series, and specific episodes

### Add New API Endpoint
Add to `src/services/TMDB.ts` using RTK Query builder pattern

## TMDB Genre IDs Reference

| ID | Genre |
|----|-------|
| 28 | Action |
| 12 | Adventure |
| 16 | Animation |
| 35 | Comedy |
| 80 | Crime |
| 99 | Documentary |
| 18 | Drama |
| 10751 | Family |
| 14 | Fantasy |
| 27 | Horror |
| 9648 | Mystery |
| 10749 | Romance |
| 878 | Science Fiction |
| 53 | Thriller |

## Stremio Deep Link Reference

```
Movies:   stremio:///detail/movie/{imdb_id}/{imdb_id}
Series:   stremio:///detail/series/{imdb_id}/
Episode:  stremio:///detail/series/{imdb_id}/{imdb_id}:{season}:{episode}
```

## Build & Deploy

```bash
npm run build    # Production build to /dist
npm run preview  # Preview production build
```

Note: This is designed as a local app. For deployment, you'd need to handle the Stremio deep links appropriately (they only work when Stremio is installed locally).
