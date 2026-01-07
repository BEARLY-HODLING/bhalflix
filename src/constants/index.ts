import { FiSun } from "react-icons/fi";
import { BsMoonStarsFill } from "react-icons/bs";
import { GoDeviceDesktop } from "react-icons/go";
import { AiOutlineHome } from "react-icons/ai";
import { TbMovie } from "react-icons/tb";
import { MdOutlineLiveTv, MdExplore } from "react-icons/md";
import { BsBookmarkHeart } from "react-icons/bs";

import { ITheme, INavLink } from "../types";

export const navLinks: INavLink[] = [
  {
    title: "home",
    path: "/",
    icon: AiOutlineHome,
  },
  {
    title: "discover",
    path: "/discover",
    icon: MdExplore,
  },
  {
    title: "movies",
    path: "/movie",
    icon: TbMovie,
  },
  {
    title: "tv series",
    path: "/tv",
    icon: MdOutlineLiveTv,
  },
  {
    title: "watchlist",
    path: "/watchlist",
    icon: BsBookmarkHeart,
  },
];

export const themeOptions: ITheme[] = [
  {
    title: "Dark",
    icon: BsMoonStarsFill,
  },
  {
    title: "Light",
    icon: FiSun,
  },
  {
    title: "System",
    icon: GoDeviceDesktop,
  },
];

export const footerLinks = [
  "home",
  "discover",
  "watchlist",
  "movies",
  "tv series",
];

export const sections = [
  {
    title: "Trending Now",
    category: "movie",
    type: "popular",
  },
  {
    title: "New Releases",
    category: "movie",
    type: "now_playing",
  },
  {
    title: "Trending TV Series",
    category: "tv",
    type: "popular",
  },
  {
    title: "Top Picks",
    category: "movie",
    type: "top_rated",
  },
];

export {
  moods,
  genres,
  yearOptions,
  ratingOptions,
  getMoodById,
} from "./moods";
