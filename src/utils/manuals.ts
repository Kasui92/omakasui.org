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
