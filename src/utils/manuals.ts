import { getEntry } from "astro:content";
import { ucfirst } from "./helpers";
import type { ParsedManualCollectionId } from "../@types/manual";

/**
 * Get a manual by its group
 * @param group - The manual group (e.g., "omakube")
 * @returns The manual entry data or null if not found
 */
export const getManual = async (group: string) => {
  try {
    const manual = group ? await getEntry("manuals", group) : null;
    return manual ? manual.data : null;
  } catch (error) {
    console.error("Error fetching manual:", error);
    return null;
  }
};

/**
 * Parse a manual collection ID into its components
 * @param id - The manual ID (e.g., "01-introduction", "group/01-introduction", or "group/01-chapter/02-section")
 * @param isNumbered - Whether the file has numbered prefix (default: false)
 */
export function parseManualCollectionId(
  id: string,
  isNumbered: boolean = false,
): ParsedManualCollectionId {
  // Default values
  let order = 999;
  let orderChapter: number | undefined;
  let chapter: string | undefined;

  const parts = id.split("/");

  let group: string;
  let slug: string;

  if (parts.length === 1) {
    // Format: {order}-{title}
    group = "default";
    slug = parts[0];
  } else if (parts.length === 2) {
    // Format: {group}/{order}-{title}
    group = parts[0];
    slug = parts[1];
  } else if (parts.length === 3) {
    // Format: {group}/{order-chapter}-{chapter}/{order}-{title}
    group = parts[0];
    chapter = parts[1];
    slug = parts[2];

    // Extract chapter name and order from the middle part
    if (isNumbered) {
      const chapterMatch = chapter.match(/^(\d+)-(.+)$/);
      if (chapterMatch) {
        orderChapter = parseInt(chapterMatch[1], 10);
        chapter = chapterMatch[2];
      }
    }
  } else {
    // Fallback for unexpected formats
    group = parts[0];
    slug = parts[parts.length - 1];
  }

  // If the filename is numbered, extract order and slug
  if (isNumbered) {
    const match = slug.match(/^(\d+)-(.+)$/);

    if (match) {
      order = parseInt(match[1], 10);
      slug = match[2];
    }
  }

  // Generate a human-readable title from the slug
  let title = slug
    .split("-")
    .map((word) => ucfirst(word))
    .join(" ");

  return {
    slug,
    group,
    orderChapter,
    chapter,
    order,
    title,
  };
}

/**
 * Sort manual pages by chapter and order
 * @param pages - Array of manual pages to sort
 * @returns Sorted array of manual pages
 */
export function sortManualPages<T extends { id: string }>(pages: T[]): T[] {
  return pages.sort((a, b) => {
    const aParsed = parseManualCollectionId(a.id, true);
    const bParsed = parseManualCollectionId(b.id, true);

    // First sort by chapter
    if (
      aParsed.orderChapter !== undefined &&
      bParsed.orderChapter !== undefined
    ) {
      if (aParsed.orderChapter !== bParsed.orderChapter) {
        return aParsed.orderChapter - bParsed.orderChapter;
      }
    }

    // Then sort by page
    return aParsed.order - bParsed.order;
  });
}

/**
 * Format a chapter slug into a human-readable title
 * @param chapter - The chapter slug (e.g., "getting-started")
 * @returns Formatted chapter title (e.g., "Getting Started")
 */
export function formatChapterTitle(chapter: string | undefined): string | null {
  if (!chapter) return null;

  return chapter
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get sorted manual pages for a specific group
 * @param pages - All manual pages
 * @param group - The manual group to filter by
 * @returns Sorted array of pages in the specified group
 */
export function getManualPagesByGroup<T extends { id: string }>(
  pages: T[],
  group: string,
): T[] {
  const filtered = pages.filter((page) => page.id.startsWith(`${group}/`));
  return sortManualPages(filtered);
}

/**
 * Check if a page is the first page in its manual group
 * @param pages - All manual pages in the group (must be sorted)
 * @param pageId - The page ID to check
 * @returns True if this is the first page
 */
export function isFirstPage(pages: { id: string }[], pageId: string): boolean {
  return pages[0]?.id === pageId;
}

/**
 * Generate the URL for a manual page
 * @param group - The manual group
 * @param slug - The page slug
 * @param isFirst - Whether this is the first page in the group
 * @returns The URL path for the page
 */
export function getManualPageUrl(
  group: string,
  slug: string,
  isFirst: boolean,
): string {
  return isFirst ? `/manuals/${group}` : `/manuals/${group}/${slug}`;
}
