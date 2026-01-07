import { IconType } from "react-icons";

export interface ITheme {
  title: string;
  icon: IconType;
}

export interface INavLink extends ITheme {
  path: string;
}

export interface IMovie {
  id: string;
  poster_path: string;
  original_title: string;
  name: string;
  overview: string;
  backdrop_path: string;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface IExternalIds {
  imdb_id: string | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}

export interface ICast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface IVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface IMovieDetail extends IMovie {
  title: string;
  genres: IGenre[];
  runtime: number;
  vote_average: number;
  vote_count: number;
  release_date: string;
  first_air_date: string;
  external_ids: IExternalIds;
  videos: {
    results: IVideo[];
  };
  credits: {
    cast: ICast[];
  };
}

export interface IMood {
  id: string;
  title: string;
  icon: string;
  color: string;
  genreIds: number[];
  description: string;
}

export interface IWatchlistItem {
  id: string;
  title: string;
  poster_path: string;
  category: "movie" | "tv";
  addedAt: number;
}

export interface IDiscoverParams {
  category: string;
  genres?: string;
  year?: string;
  minRating?: string;
  page?: number;
}
