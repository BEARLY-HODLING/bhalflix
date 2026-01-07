/**
 * Stremio Deep Link Utilities
 *
 * Generates deep links to open content directly in Stremio app
 * Reference: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/deep-links.md
 */

export type StremioContentType = "movie" | "series";

/**
 * Generate a Stremio desktop app deep link URL from an IMDB ID
 * Format: stremio:///detail/{type}/{metaId}/{videoId}
 */
export const getStremioDesktopLink = (
  imdbId: string,
  type: StremioContentType
): string => {
  if (type === "series") {
    return `stremio:///detail/${type}/${imdbId}/`;
  }
  return `stremio:///detail/${type}/${imdbId}/${imdbId}`;
};

/**
 * Generate a Stremio web app link from an IMDB ID
 * Format: https://web.strem.io/#/detail/{type}/{metaId}/{videoId}
 */
export const getStremioWebLink = (
  imdbId: string,
  type: StremioContentType
): string => {
  if (type === "series") {
    return `https://web.strem.io/#/detail/${type}/${imdbId}`;
  }
  return `https://web.strem.io/#/detail/${type}/${imdbId}/${imdbId}`;
};

/**
 * Generate a Stremio deep link for a specific TV episode (desktop)
 */
export const getStremioEpisodeLink = (
  imdbId: string,
  season: number,
  episode: number
): string => {
  return `stremio:///detail/series/${imdbId}/${imdbId}:${season}:${episode}`;
};

/**
 * Open content in Stremio web app (more reliable on macOS)
 * Opens in a new tab at web.strem.io
 */
export const openInStremioWeb = (
  imdbId: string,
  type: StremioContentType
): void => {
  const link = getStremioWebLink(imdbId, type);
  console.log("Opening Stremio Web with:", { imdbId, type, link });
  window.open(link, "_blank");
};

/**
 * Open content in Stremio desktop app
 */
export const openInStremioDesktop = (
  imdbId: string,
  type: StremioContentType
): void => {
  const link = getStremioDesktopLink(imdbId, type);
  console.log("Opening Stremio Desktop with:", { imdbId, type, link });

  // Create a hidden link and click it
  const a = document.createElement("a");
  a.href = link;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Main function to open in Stremio
 * Tries desktop app first, with web fallback available
 */
export const openInStremio = (
  imdbId: string,
  type: StremioContentType,
  preferWeb: boolean = false
): void => {
  if (preferWeb) {
    openInStremioWeb(imdbId, type);
  } else {
    openInStremioDesktop(imdbId, type);
  }
};

/**
 * Check if an IMDB ID is valid (starts with 'tt')
 */
export const isValidImdbId = (imdbId: string | null | undefined): boolean => {
  return Boolean(imdbId && imdbId.startsWith("tt"));
};

/**
 * Convert TMDB category to Stremio content type
 */
export const categoryToStremioType = (category: string): StremioContentType => {
  return category === "movie" ? "movie" : "series";
};
