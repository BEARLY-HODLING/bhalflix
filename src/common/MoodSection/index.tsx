import { memo, FC, useRef } from "react";
import { Link } from "react-router-dom";
import { useInView } from "framer-motion";

import MoviesSlides from "../Section/MoviesSlides";
import { SkeletonLoader } from "../Loader";
import Error from "../Error";

import { useGetMoodMoviesQuery } from "@/services/TMDB";
import { useTheme } from "@/context/themeContext";
import { cn, getErrorMessage } from "@/utils/helper";
import { IMood } from "@/types";

interface MoodSectionProps {
  mood: IMood;
  category?: "movie" | "tv";
}

const MoodSection: FC<MoodSectionProps> = ({ mood, category = "movie" }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    margin: "420px",
    once: true,
  });

  const { theme } = useTheme();

  const {
    data = { results: [] },
    isLoading,
    isError,
    error,
  } = useGetMoodMoviesQuery(
    {
      genreIds: mood.genreIds,
      category,
      page: 1,
    },
    {
      skip: !inView,
    },
  );

  const errorMessage = isError ? getErrorMessage(error) : "";

  const linkStyle = cn(
    `sm:py-1 py-[2px] sm:text-[14px] xs:text-[12.75px] text-[12px] sm:px-4 px-3 rounded-full dark:text-gray-300 hover:-translate-y-1 transition-all duration-300`,
    theme === "Dark" ? "view-all-btn--dark" : "view-all-btn--light",
  );

  return (
    <section
      className="sm:py-[20px] xs:py-[18.75px] py-[16.75px] font-nunito"
      ref={ref}
    >
      <div className="flex flex-row justify-between items-center mb-[22.75px]">
        <div className="relative flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl",
              "bg-gradient-to-br",
              mood.color,
            )}
          >
            <span className="text-xl sm:text-2xl">{mood.icon}</span>
          </div>
          <div>
            <h3 className="sm:text-[22.25px] xs:text-[20px] text-[18.75px] dark:text-gray-50 sm:font-bold font-semibold">
              {mood.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {mood.description}
            </p>
          </div>
          <div className="line" />
        </div>
        <Link to={`/discover?mood=${mood.id}`} className={linkStyle}>
          See all
        </Link>
      </div>
      <div className="sm:h-[420px] xs:h-[380px] h-[340px]">
        {isLoading ? (
          <SkeletonLoader />
        ) : isError ? (
          <Error error={String(errorMessage)} className="h-full text-[18px]" />
        ) : (
          <MoviesSlides movies={data.results} category={category} />
        )}
      </div>
    </section>
  );
};

export default memo(MoodSection);
