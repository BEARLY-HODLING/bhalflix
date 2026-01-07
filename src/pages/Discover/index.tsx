import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { m } from "framer-motion";
import { FiFilter, FiX } from "react-icons/fi";

import { MovieCard, Loader, Error } from "@/common";
import { useGetDiscoverQuery } from "@/services/TMDB";
import { useMotion } from "@/hooks/useMotion";
import { maxWidth, mainHeading } from "@/styles";
import { cn } from "@/utils/helper";
import { moods, genres, yearOptions, ratingOptions, getMoodById } from "@/constants";
import { IMovie, IMood } from "@/types";

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { fadeDown, staggerContainer } = useMotion();

  // Get params from URL
  const moodId = searchParams.get("mood");
  const selectedGenres = searchParams.get("genres")?.split(",").filter(Boolean) || [];
  const selectedYear = searchParams.get("year") || "";
  const selectedRating = searchParams.get("rating") || "";
  const category = searchParams.get("type") || "movie";

  // Local state for filters
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [allResults, setAllResults] = useState<IMovie[]>([]);

  // Get mood if selected
  const selectedMood: IMood | undefined = moodId ? getMoodById(moodId) : undefined;

  // Build genre string for API
  const genreString = selectedMood
    ? selectedMood.genreIds.join(",")
    : selectedGenres.join(",");

  const { data, isLoading, isError, isFetching } = useGetDiscoverQuery({
    category,
    genres: genreString || undefined,
    year: selectedYear || undefined,
    minRating: selectedRating || undefined,
    page,
  });

  // Reset results when filters change
  useEffect(() => {
    setPage(1);
    setAllResults([]);
  }, [moodId, selectedGenres.join(","), selectedYear, selectedRating, category]);

  // Append new results
  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setAllResults(data.results);
      } else {
        setAllResults((prev) => [...prev, ...data.results]);
      }
    }
  }, [data, page]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Clear mood when manually setting filters
    if (key !== "mood") {
      params.delete("mood");
    }
    setSearchParams(params);
  };

  const toggleGenre = (genreId: number) => {
    const id = String(genreId);
    let newGenres: string[];
    if (selectedGenres.includes(id)) {
      newGenres = selectedGenres.filter((g) => g !== id);
    } else {
      newGenres = [...selectedGenres, id];
    }
    updateFilter("genres", newGenres.join(","));
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const loadMore = () => {
    if (data?.total_pages > page) {
      setPage((prev) => prev + 1);
    }
  };

  const hasActiveFilters = moodId || selectedGenres.length > 0 || selectedYear || selectedRating;

  return (
    <section className={cn(maxWidth, "pt-28 pb-12 min-h-screen")}>
      <m.div
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <m.div variants={fadeDown} className="mb-6">
          <h1 className={cn(mainHeading, "dark:text-white text-black")}>
            {selectedMood ? (
              <>
                <span className="mr-2">{selectedMood.icon}</span>
                {selectedMood.title} Movies
              </>
            ) : (
              "Discover"
            )}
          </h1>
          {selectedMood && (
            <p className="dark:text-gray-400 text-gray-600 mt-2">
              {selectedMood.description}
            </p>
          )}
        </m.div>

        {/* Filter Toggle & Active Filters */}
        <m.div variants={fadeDown} className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                showFilters
                  ? "bg-[#8A5CF5] text-white"
                  : "dark:bg-gray-800 bg-gray-200 dark:text-white text-black"
              )}
            >
              <FiFilter />
              <span>Filters</span>
            </button>

            {/* Category Toggle */}
            <div className="flex rounded-lg overflow-hidden">
              <button
                onClick={() => updateFilter("type", "movie")}
                className={cn(
                  "px-4 py-2 font-medium transition-colors",
                  category === "movie"
                    ? "bg-[#8A5CF5] text-white"
                    : "dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700"
                )}
              >
                Movies
              </button>
              <button
                onClick={() => updateFilter("type", "tv")}
                className={cn(
                  "px-4 py-2 font-medium transition-colors",
                  category === "tv"
                    ? "bg-[#8A5CF5] text-white"
                    : "dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700"
                )}
              >
                TV Shows
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-black transition-colors"
              >
                <FiX />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {selectedMood && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm">
                  {selectedMood.icon} {selectedMood.title}
                  <button onClick={() => updateFilter("mood", "")} className="ml-1">
                    <FiX size={14} />
                  </button>
                </span>
              )}
              {selectedGenres.map((genreId) => {
                const genre = genres.find((g) => String(g.id) === genreId);
                return genre ? (
                  <span
                    key={genreId}
                    className="flex items-center gap-1 px-3 py-1 rounded-full dark:bg-gray-700 bg-gray-300 dark:text-white text-black text-sm"
                  >
                    {genre.name}
                    <button onClick={() => toggleGenre(genre.id)}>
                      <FiX size={14} />
                    </button>
                  </span>
                ) : null;
              })}
              {selectedYear && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full dark:bg-gray-700 bg-gray-300 dark:text-white text-black text-sm">
                  {selectedYear}
                  <button onClick={() => updateFilter("year", "")}>
                    <FiX size={14} />
                  </button>
                </span>
              )}
              {selectedRating && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full dark:bg-gray-700 bg-gray-300 dark:text-white text-black text-sm">
                  {selectedRating}+ Rating
                  <button onClick={() => updateFilter("rating", "")}>
                    <FiX size={14} />
                  </button>
                </span>
              )}
            </div>
          )}
        </m.div>

        {/* Filter Panel */}
        {showFilters && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 rounded-xl dark:bg-gray-900/50 bg-gray-100"
          >
            {/* Mood Quick Select */}
            <div className="mb-4">
              <h3 className="font-semibold dark:text-white text-black mb-2">
                Quick Mood
              </h3>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => updateFilter("mood", mood.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                      moodId === mood.id
                        ? `bg-gradient-to-r ${mood.color} text-white`
                        : "dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700 hover:dark:bg-gray-700 hover:bg-gray-300"
                    )}
                  >
                    {mood.icon} {mood.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div className="mb-4">
              <h3 className="font-semibold dark:text-white text-black mb-2">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                      selectedGenres.includes(String(genre.id))
                        ? "bg-[#8A5CF5] text-white"
                        : "dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700 hover:dark:bg-gray-700 hover:bg-gray-300"
                    )}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Year & Rating Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold dark:text-white text-black mb-2">
                  Year
                </h3>
                <div className="flex flex-wrap gap-2">
                  {yearOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateFilter(
                          "year",
                          selectedYear === option.value ? "" : option.value
                        )
                      }
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                        selectedYear === option.value
                          ? "bg-[#8A5CF5] text-white"
                          : "dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700 hover:dark:bg-gray-700 hover:bg-gray-300"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold dark:text-white text-black mb-2">
                  Minimum Rating
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ratingOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateFilter(
                          "rating",
                          selectedRating === option.value ? "" : option.value
                        )
                      }
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                        selectedRating === option.value
                          ? "bg-[#8A5CF5] text-white"
                          : "dark:bg-gray-800 bg-gray-200 dark:text-gray-300 text-gray-700 hover:dark:bg-gray-700 hover:bg-gray-300"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </m.div>
        )}

        {/* Results */}
        {isLoading && page === 1 ? (
          <Loader />
        ) : isError ? (
          <Error error="Failed to load movies. Please try again." />
        ) : (
          <>
            <m.div
              variants={fadeDown}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              {allResults.map((movie: IMovie) => (
                <MovieCard key={movie.id} movie={movie} category={category} />
              ))}
            </m.div>

            {allResults.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="dark:text-gray-400 text-gray-600 text-lg">
                  No results found. Try adjusting your filters.
                </p>
              </div>
            )}

            {/* Load More */}
            {data?.total_pages > page && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={isFetching}
                  className="px-6 py-3 bg-[#8A5CF5] hover:bg-[#7B4FE0] text-white rounded-full font-medium transition-colors disabled:opacity-50"
                >
                  {isFetching ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </m.div>
    </section>
  );
};

export default Discover;
