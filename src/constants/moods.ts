import { IMood } from "@/types";

/**
 * TMDB Genre IDs Reference:
 * Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80,
 * Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36,
 * Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749, Science Fiction: 878,
 * TV Movie: 10770, Thriller: 53, War: 10752, Western: 37
 */

export const moods: IMood[] = [
  {
    id: "feel-good",
    title: "Feel Good",
    icon: "😊",
    color: "from-yellow-400 to-orange-500",
    genreIds: [35, 10751, 10749], // Comedy, Family, Romance
    description: "Light-hearted fun to lift your spirits",
  },
  {
    id: "thrilling",
    title: "Thrilling",
    icon: "🔥",
    color: "from-amber-600 to-orange-600",
    genreIds: [28, 53, 80], // Action, Thriller, Crime
    description: "Edge-of-your-seat excitement",
  },
  {
    id: "mind-bending",
    title: "Mind-Bending",
    icon: "🧠",
    color: "from-purple-500 to-indigo-600",
    genreIds: [878, 9648], // Sci-Fi, Mystery
    description: "Stories that make you think",
  },
  {
    id: "scary",
    title: "Scary",
    icon: "👻",
    color: "from-gray-700 to-gray-900",
    genreIds: [27, 53], // Horror, Thriller
    description: "Spine-chilling frights",
  },
  {
    id: "epic",
    title: "Epic Adventure",
    icon: "⚔️",
    color: "from-emerald-500 to-teal-600",
    genreIds: [12, 14, 28], // Adventure, Fantasy, Action
    description: "Grand journeys and heroic quests",
  },
  {
    id: "relaxing",
    title: "Relaxing",
    icon: "🌿",
    color: "from-green-400 to-cyan-500",
    genreIds: [16, 99, 10751], // Animation, Documentary, Family
    description: "Calm and easy viewing",
  },
  {
    id: "romantic",
    title: "Romantic",
    icon: "💕",
    color: "from-pink-400 to-rose-500",
    genreIds: [10749, 35, 18], // Romance, Comedy, Drama
    description: "Love stories and heartfelt moments",
  },
  {
    id: "dramatic",
    title: "Dramatic",
    icon: "🎭",
    color: "from-blue-500 to-indigo-600",
    genreIds: [18, 36, 10752], // Drama, History, War
    description: "Powerful stories with depth",
  },
];

/**
 * All available genres for filtering
 */
export const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

/**
 * Year filter options
 */
export const yearOptions = [
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
];

/**
 * Minimum rating filter options
 */
export const ratingOptions = [
  { value: "9", label: "9+ Excellent" },
  { value: "8", label: "8+ Great" },
  { value: "7", label: "7+ Good" },
  { value: "6", label: "6+ Decent" },
];

/**
 * Get a mood by its ID
 */
export const getMoodById = (id: string): IMood | undefined => {
  return moods.find((mood) => mood.id === id);
};
