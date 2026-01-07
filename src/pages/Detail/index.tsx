import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  BsBookmarkPlus,
  BsBookmarkCheckFill,
  BsPlayCircleFill,
  BsClipboard,
  BsCheck2,
} from "react-icons/bs";

import { Poster, Loader, Error, Section } from "@/common";
import { Casts, Videos, Genre } from "./components";

import { useGetShowQuery } from "@/services/TMDB";
import { useMotion } from "@/hooks/useMotion";
import { useWatchlist } from "@/context/watchlistContext";
import { mainHeading, maxWidth, paragraph, watchBtn } from "@/styles";
import { cn } from "@/utils/helper";
import {
  openInStremioWeb,
  isValidImdbId,
  categoryToStremioType,
} from "@/utils/stremio";

const Detail = () => {
  const { category, id } = useParams();
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const { fadeDown, staggerContainer } = useMotion();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const {
    data: movie,
    isLoading,
    isFetching,
    isError,
  } = useGetShowQuery({
    category: String(category),
    id: Number(id),
  });

  const inWatchlist = isInWatchlist(String(id));

  useEffect(() => {
    document.title =
      (movie?.title || movie?.name) && !isLoading
        ? `${movie.title || movie.name} - BhalFlix`
        : "BhalFlix";

    return () => {
      document.title = "BhalFlix";
    };
  }, [movie?.title, isLoading, movie?.name]);

  const toggleShow = () => setShow((prev) => !prev);

  const handleWatchInStremioWeb = () => {
    const imdbId = movie?.external_ids?.imdb_id;
    if (isValidImdbId(imdbId)) {
      openInStremioWeb(imdbId!, categoryToStremioType(String(category)));
    }
  };

  const handleCopyImdbId = async () => {
    const imdbId = movie?.external_ids?.imdb_id;
    if (imdbId) {
      try {
        await navigator.clipboard.writeText(imdbId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy IMDB ID to clipboard:", error);
        alert(`IMDB ID: ${imdbId}`);
      }
    }
  };

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(String(id));
    } else {
      addToWatchlist({
        id: String(id),
        title: movie?.title || movie?.name,
        poster_path: movie?.poster_path,
        category: category as "movie" | "tv",
      });
    }
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Something went wrong!" />;
  }

  const {
    title,
    poster_path: posterPath,
    overview,
    name,
    genres,
    videos,
    credits,
    external_ids,
    vote_average,
  } = movie;

  const imdbId = external_ids?.imdb_id;
  const hasValidImdb = isValidImdbId(imdbId);

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to top, rgba(0,0,0), rgba(0,0,0,0.98),rgba(0,0,0,0.8) ,rgba(0,0,0,0.4)),url('https://image.tmdb.org/t/p/original/${posterPath}'`,
    backgroundPosition: "top",
    backgroundSize: "cover",
  };

  return (
    <>
      <section className="w-full" style={backgroundStyle}>
        <div
          className={`${maxWidth} lg:py-36 sm:py-[136px] sm:pb-28 xs:py-28 xs:pb-12 pt-24 pb-8 flex flex-row lg:gap-12 md:gap-10 gap-8 justify-center`}
        >
          <Poster title={title} posterPath={posterPath} />
          <m.div
            variants={staggerContainer(0.2, 0.4)}
            initial="hidden"
            animate="show"
            className="text-gray-300 sm:max-w-[80vw] max-w-[90vw]  md:max-w-[520px] font-nunito flex flex-col lg:gap-5 sm:gap-4 xs:gap-[14px] gap-3 mb-8 flex-1 will-change-transform motion-reduce:transform-none"
          >
            <m.h2
              variants={fadeDown}
              className={cn(
                mainHeading,
                " md:max-w-[420px] will-change-transform motion-reduce:transform-none",
              )}
            >
              {title || name}
            </m.h2>

            {vote_average > 0 && (
              <m.div variants={fadeDown} className="flex items-center gap-2">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-gray-300 font-medium">
                  {vote_average.toFixed(1)}
                </span>
              </m.div>
            )}

            <m.ul
              variants={fadeDown}
              className="flex flex-row items-center  sm:gap-[14px] xs:gap-3 gap-[6px] flex-wrap will-change-transform motion-reduce:transform-none"
            >
              {genres.map((genre: { name: string; id: number }) => {
                return <Genre key={genre.id} name={genre.name} />;
              })}
            </m.ul>

            <m.p
              variants={fadeDown}
              className={`${paragraph} will-change-transform motion-reduce:transform-none`}
            >
              <span>
                {overview.length > 280
                  ? `${show ? overview : `${overview.slice(0, 280)}...`}`
                  : overview}
              </span>
              <button
                type="button"
                className={cn(
                  `font-bold ml-1 hover:underline transition-all duration-300`,
                  overview.length > 280 ? "inline-block" : "hidden",
                )}
                onClick={toggleShow}
              >
                {!show ? "show more" : "show less"}
              </button>
            </m.p>

            {/* Action Buttons */}
            <m.div
              variants={fadeDown}
              className="flex flex-wrap gap-3 mt-2 will-change-transform motion-reduce:transform-none"
            >
              {/* Watch in Stremio Web Button - Primary */}
              <button
                type="button"
                onClick={handleWatchInStremioWeb}
                disabled={!hasValidImdb}
                className={cn(
                  watchBtn,
                  hasValidImdb
                    ? "bg-[#8A5CF5] hover:bg-[#7B4FE0] shadow-[0_0_18px_rgba(138,92,245,0.5)]"
                    : "bg-gray-600 cursor-not-allowed opacity-50",
                  "flex items-center gap-2",
                )}
              >
                <BsPlayCircleFill className="text-lg" />
                <span>Watch in Stremio</span>
              </button>

              {/* Copy IMDB ID Button - For manual search in Stremio app */}
              <button
                type="button"
                onClick={handleCopyImdbId}
                disabled={!hasValidImdb}
                className={cn(
                  watchBtn,
                  hasValidImdb
                    ? "watch-trailer"
                    : "bg-gray-600 cursor-not-allowed opacity-50",
                  "flex items-center gap-2",
                )}
                title="Copy IMDB ID to paste in Stremio app search"
              >
                {copied ? (
                  <>
                    <BsCheck2 className="text-lg text-green-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <BsClipboard className="text-lg" />
                    <span>Copy IMDB ID</span>
                  </>
                )}
              </button>

              {/* Watchlist Button */}
              <button
                type="button"
                onClick={handleWatchlistToggle}
                className={cn(
                  watchBtn,
                  inWatchlist
                    ? "bg-green-600 hover:bg-green-700"
                    : "watch-trailer",
                  "flex items-center gap-2",
                )}
              >
                {inWatchlist ? (
                  <>
                    <BsBookmarkCheckFill className="text-lg" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <BsBookmarkPlus className="text-lg" />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>
            </m.div>

            <Casts casts={credits?.cast || []} />
          </m.div>
        </div>
      </section>

      <Videos videos={videos.results} />

      <Section
        title={`Similar ${category === "movie" ? "movies" : "series"}`}
        category={String(category)}
        className={`${maxWidth}`}
        id={Number(id)}
        showSimilarShows
      />
    </>
  );
};

export default Detail;
