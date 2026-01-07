import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_KEY, TMDB_API_BASE_URL } from "@/utils/config";
import { IDiscoverParams } from "@/types";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({ baseUrl: TMDB_API_BASE_URL }),

  endpoints: (builder) => ({
    getShows: builder.query({
      query: ({
        category,
        type,
        searchQuery,
        page,
        showSimilarShows,
        id,
      }: {
        category: string | undefined;
        type?: string;
        page?: number;
        searchQuery?: string;
        showSimilarShows?: boolean;
        id?: number;
      }) => {
        if (searchQuery) {
          return `search/${category}?api_key=${API_KEY}&query=${searchQuery}&page=${page}`;
        }

        if (showSimilarShows) {
          return `${category}/${id}/similar?api_key=${API_KEY}`;
        }

        return `${category}/${type}?api_key=${API_KEY}&page=${page}`;
      },
    }),

    getShow: builder.query({
      query: ({ category, id }: { category: string; id: number }) =>
        `${category}/${id}?append_to_response=videos,credits,external_ids&api_key=${API_KEY}`,
    }),

    getDiscover: builder.query({
      query: ({
        category,
        genres,
        year,
        minRating,
        page = 1,
      }: IDiscoverParams) => {
        let url = `discover/${category}?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc`;

        if (genres) {
          url += `&with_genres=${genres}`;
        }

        if (year) {
          if (category === "movie") {
            url += `&primary_release_year=${year}`;
          } else {
            url += `&first_air_date_year=${year}`;
          }
        }

        if (minRating) {
          url += `&vote_average.gte=${minRating}&vote_count.gte=100`;
        }

        return url;
      },
    }),

    getGenres: builder.query({
      query: ({ category }: { category: string }) =>
        `genre/${category}/list?api_key=${API_KEY}`,
    }),

    getMoodMovies: builder.query({
      query: ({
        genreIds,
        category = "movie",
        page = 1,
      }: {
        genreIds: number[];
        category?: "movie" | "tv";
        page?: number;
      }) => {
        const genresParam = genreIds.join(",");
        return `discover/${category}?api_key=${API_KEY}&with_genres=${genresParam}&page=${page}&sort_by=popularity.desc`;
      },
    }),
  }),
});

export const {
  useGetShowsQuery,
  useGetShowQuery,
  useGetDiscoverQuery,
  useGetGenresQuery,
  useGetMoodMoviesQuery,
} = tmdbApi;
