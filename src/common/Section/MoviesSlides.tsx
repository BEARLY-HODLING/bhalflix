import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper";

import MovieCard from "../MovieCard";
import { IMovie } from "@/types";

interface MoviesSlidesProps {
  movies: IMovie[];
  category: string;
}

const MoviesSlides: FC<MoviesSlidesProps> = ({ movies, category }) => (
  <Swiper
    slidesPerView="auto"
    spaceBetween={20}
    freeMode={true}
    mousewheel={{ forceToAxis: true }}
    modules={[FreeMode, Mousewheel]}
    className="mySwiper"
  >
    {movies.map((movie) => {
      return (
        <SwiperSlide
          key={movie.id}
          className="flex mt-1 flex-col xs:gap-[14px] gap-2 sm:max-w-[220px] max-w-[150px] rounded-lg"
        >
          <MovieCard movie={movie} category={category} />
        </SwiperSlide>
      );
    })}
  </Swiper>
);

export default MoviesSlides;
