import { Link } from "react-router-dom";
import { m } from "framer-motion";

import { moods } from "@/constants";
import { useMotion } from "@/hooks/useMotion";
import { cn } from "@/utils/helper";

const MoodSelector = () => {
  const { fadeDown, staggerContainer } = useMotion();

  return (
    <m.section
      variants={staggerContainer(0.1, 0.1)}
      initial="hidden"
      animate="show"
      className="mb-8"
    >
      <m.h2
        variants={fadeDown}
        className="text-xl sm:text-2xl font-bold dark:text-white text-black mb-4"
      >
        What are you in the mood for?
      </m.h2>

      <m.div
        variants={fadeDown}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
      >
        {moods.map((mood) => (
          <Link
            key={mood.id}
            to={`/discover?mood=${mood.id}`}
            className={cn(
              "relative overflow-hidden rounded-xl p-4 sm:p-5",
              "bg-gradient-to-br",
              mood.color,
              "hover:scale-[1.02] hover:shadow-lg transition-all duration-300",
              "group cursor-pointer"
            )}
          >
            <div className="relative z-10">
              <span className="text-2xl sm:text-3xl mb-2 block">{mood.icon}</span>
              <h3 className="font-bold text-white text-sm sm:text-base">
                {mood.title}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mt-1 line-clamp-2">
                {mood.description}
              </p>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </m.div>
    </m.section>
  );
};

export default MoodSelector;
