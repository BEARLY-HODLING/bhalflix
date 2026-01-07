import { Loader, Error, Section, MoodSelector, MoodSection } from "@/common";
import { Hero } from "./components";

import { useGetShowsQuery } from "@/services/TMDB";
import { maxWidth } from "@/styles";
import { sections, moods } from "@/constants";
import { cn } from "@/utils/helper";

const Home = () => {
  const { data, isLoading, isError } = useGetShowsQuery({
    category: "movie",
    type: "popular",
    page: 1,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Unable to fetch the movies! " />;
  }

  const popularMovies = data?.results.slice(0, 5);

  // Show first 4 moods on the home page
  const homeMoods = moods.slice(0, 4);

  return (
    <>
      <Hero movies={popularMovies} />
      <div className={cn(maxWidth, "lg:mt-12 md:mt-8 sm:mt-6 xs:mt-4 mt-2")}>
        {/* Mood-Based Discovery */}
        <MoodSelector />

        {/* Mood Content Sections */}
        {homeMoods.map((mood) => (
          <MoodSection key={mood.id} mood={mood} category="movie" />
        ))}

        {/* Trending Content Sections */}
        {sections.map(({ title, category, type }) => (
          <Section title={title} category={category} type={type} key={title} />
        ))}
      </div>
    </>
  );
};

export default Home;
