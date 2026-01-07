import { Link } from "react-router-dom";
import { m } from "framer-motion";
import { BsTrash, BsBookmarkHeart } from "react-icons/bs";

import { MovieCard } from "@/common";
import { useWatchlist } from "@/context/watchlistContext";
import { useMotion } from "@/hooks/useMotion";
import { maxWidth, mainHeading } from "@/styles";
import { cn } from "@/utils/helper";

const Watchlist = () => {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();
  const { fadeDown, staggerContainer } = useMotion();

  return (
    <section className={cn(maxWidth, "pt-28 pb-12 min-h-screen")}>
      <m.div
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        animate="show"
      >
        <m.div
          variants={fadeDown}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className={cn(mainHeading, "dark:text-white text-black")}>
              My Watchlist
            </h1>
            <p className="dark:text-gray-400 text-gray-600 mt-2">
              {watchlist.length} {watchlist.length === 1 ? "item" : "items"}{" "}
              saved
            </p>
          </div>

          {watchlist.length > 0 && (
            <button
              onClick={clearWatchlist}
              className="flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-amber-900/30 bg-amber-100 dark:text-amber-600 text-amber-700 hover:dark:bg-amber-900/50 hover:bg-amber-200 transition-colors self-start"
            >
              <BsTrash />
              <span>Clear All</span>
            </button>
          )}
        </m.div>

        {watchlist.length === 0 ? (
          <m.div
            variants={fadeDown}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <BsBookmarkHeart className="text-6xl dark:text-gray-600 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold dark:text-gray-300 text-gray-700 mb-2">
              Your watchlist is empty
            </h2>
            <p className="dark:text-gray-500 text-gray-500 mb-6 max-w-md">
              Start adding movies and TV shows you want to watch later. They'll
              appear here so you never forget what to watch next.
            </p>
            <Link
              to="/discover"
              className="px-6 py-3 bg-[#8A5CF5] hover:bg-[#7B4FE0] text-white rounded-full font-medium transition-colors"
            >
              Discover Movies
            </Link>
          </m.div>
        ) : (
          <m.div
            variants={fadeDown}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {watchlist.map((item) => (
              <div key={item.id} className="relative group">
                <MovieCard
                  movie={{
                    id: item.id,
                    poster_path: item.poster_path,
                    original_title: item.title,
                    name: item.title,
                    overview: "",
                    backdrop_path: "",
                  }}
                  category={item.category}
                />
                <button
                  onClick={() => removeFromWatchlist(item.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-bear-brown text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-bear-dark z-10"
                  title="Remove from watchlist"
                >
                  <BsTrash size={14} />
                </button>
              </div>
            ))}
          </m.div>
        )}
      </m.div>
    </section>
  );
};

export default Watchlist;
