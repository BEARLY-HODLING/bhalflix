import { Link } from "react-router-dom";
import { FaYoutube, FaBookmark, FaEye } from "react-icons/fa";

import Image from "../Image";
import { IMovie } from "@/types";
import { useMediaQuery } from "usehooks-ts";
import { useWatchlist } from "@/context/watchlistContext";

const MovieCard = ({
  movie,
  category,
  showWatchlistBadge = false,
}: {
  movie: IMovie;
  category: string;
  showWatchlistBadge?: boolean;
}) => {
  const { poster_path, original_title: title, name, id } = movie;
  const isMobile = useMediaQuery("(max-width: 380px)");
  const { isInWatchlist, isWatched } = useWatchlist();

  const inWatchlist = showWatchlistBadge && isInWatchlist(String(id));
  const watched = showWatchlistBadge && isWatched(String(id));

  return (
    <>
      <Link
        to={`/${category}/${id}`}
        className="dark:bg-[#1f1f1f] bg-[#f5f5f5] rounded-lg relative group sm:w-[220px] w-[150px] select-none sm:h-[330px] h-[225px] overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:z-10"
      >
        <Image
          height={!isMobile ? 330 : 225}
          width={!isMobile ? 220 : 150}
          src={`https://image.tmdb.org/t/p/original/${poster_path}`}
          alt={movie.original_title}
          className="object-cover rounded-lg drop-shadow-md shadow-md transition-all duration-300 ease-in-out"
          effect="zoomIn"
        />

        {/* Watchlist and Watched badges */}
        {showWatchlistBadge && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
            {inWatchlist && (
              <div className="bg-green-500 text-white p-1.5 rounded-full shadow-md">
                <FaBookmark className="w-3 h-3" />
              </div>
            )}
            {watched && (
              <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-md">
                <FaEye className="w-3 h-3" />
              </div>
            )}
          </div>
        )}

        <div className="absolute top-0 left-0 sm:w-[220px] w-[150px] h-full group-hover:opacity-100 opacity-0 bg-[rgba(0,0,0,0.6)] transition-all duration-300 rounded-lg flex items-center justify-center">
          <div className="xs:text-[48px] text-[42px] text-bear-brown scale-[0.4] group-hover:scale-100 transition-all duration-300 ">
            <FaYoutube />
          </div>
        </div>
      </Link>

      <h4 className="dark:text-gray-300 text-center cursor-default sm:text-base xs:text-[14.75px] text-[14px] font-medium sm:max-w-[220px] max-w-[150px]">
        {(title?.length > 50 ? title.split(":")[0] : title) || name}
      </h4>
    </>
  );
};

export default MovieCard;
