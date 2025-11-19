import { useEffect, useState } from "react";

/**
 * Checks if the code is running in a server-side environment.
 *
 * @returns {boolean} True if running on the server (window is undefined), false otherwise
 */
function isServer() {
  return typeof window === "undefined";
}

/**
 * Safely checks if a media query matches the current viewport.
 *
 * @param {string} query - The CSS media query string to test
 * @returns {boolean} True if the media query matches, false if it doesn't match or if an error occurs
 */
function safeMatch(query: string) {
  try {
    if (isServer() || !Object.prototype.hasOwnProperty.call(window, "matchMedia")) {
      return false;
    }

    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

/**
 * Represents a media query input type.
 *
 * Can be either:
 * - A single media query string (e.g., "(min-width: 768px)")
 * - An object with named media queries (e.g., { mobile: "(max-width: 767px)", desktop: "(min-width: 768px)" })
 *
 * @since 0.0.1
 */
export type MediaQuery = string | Record<string, string>;

/**
 * The result type for media query matching.
 *
 * @template Query - The type of media query being tested
 *
 * Returns:
 * - `boolean` if Query is a string
 * - An object with boolean values for each key if Query is a Record<string, string>
 */
export type MediaMatchResult<Query extends MediaQuery> = Query extends string
  ? boolean
  : {
      [Key in keyof Query]: boolean;
    };

/**
 * Tests one or more media queries and returns the match result(s).
 *
 * @template Query - The type of media query (string or object)
 * @param {Query} query - A single media query string or an object of named queries
 * @returns {MediaMatchResult<Query>} Boolean if query is a string, or an object of booleans if query is an object
 */
function matching<Query extends MediaQuery = MediaQuery>(query: Query): MediaMatchResult<Query> {
  if (typeof query === "object") {
    return Object.keys(query).reduce(
      (rs, key) => {
        rs[key] = safeMatch(query[key]!);
        return rs;
      },
      {} as Record<string, boolean>
    ) as MediaMatchResult<typeof query>;
  } else {
    return safeMatch(query) as MediaMatchResult<typeof query>;
  }
}

/**
 * Compares two media match results for equality.
 *
 * @template Query - The type of media query
 * @param {MediaMatchResult<Query>} a - The first match result to compare
 * @param {MediaMatchResult<Query>} b - The second match result to compare
 * @returns {boolean} True if the results are equal, false otherwise
 */
function isEqual<Query extends MediaQuery>(
  a: MediaMatchResult<Query>,
  b: MediaMatchResult<Query>
): boolean {
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    if (aKeys.length === 0) {
      return true;
    }

    return aKeys.every((key) => a[key] === b[key]);
  } else {
    return a === b;
  }
}

/**
 * A React hook that tracks whether media query(ies) match the current viewport.
 *
 * This hook subscribes to window resize events and updates whenever the match status changes.
 * It supports both single media queries and multiple named queries.
 *
 * @template Query - The type of media query (string or object)
 * @param {Query} query - A CSS media query string or an object of named media queries
 * @returns {MediaMatchResult<Query>} The current match status:
 *   - `boolean` if a single query string was provided
 *   - An object with boolean values for each named query if an object was provided
 *
 * @example
 * ```tsx
 * import { useMediaQuery } from '@mxweb/react-hooks';
 *
 * // Single query
 * function MyComponent() {
 *   const isMobile = useMediaQuery('(max-width: 767px)');
 *
 *   return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Multiple named queries
 * function ResponsiveComponent() {
 *   const { mobile, tablet, desktop } = useMediaQuery({
 *     mobile: '(max-width: 767px)',
 *     tablet: '(min-width: 768px) and (max-width: 1023px)',
 *     desktop: '(min-width: 1024px)',
 *   });
 *
 *   if (mobile) return <MobileView />;
 *   if (tablet) return <TabletView />;
 *   if (desktop) return <DesktopView />;
 * }
 * ```
 *
 * @since 0.0.1
 */
export function useMediaQuery<Query extends MediaQuery = MediaQuery>(query: Query) {
  const [isMatch, setIsMatch] = useState<MediaMatchResult<Query>>(matching(query));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function handleResize() {
      const newMatch = matching(query);
      isEqual(isMatch, newMatch) || setIsMatch(newMatch);
    }

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [query, isMatch]);

  return isMatch;
}
