import { getEntry } from "astro:content";
import { ucfirst } from "./helpers";

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
 * @param id - The manual ID (e.g., "01-introduction" or "group/01-introduction")
 * @param isNumbered - Whether the file has numbered prefix (default: false)
 */
export function parseManualCollectionId(
  id: string,
  isNumbered: boolean = false,
): {
  slug: string;
  group: string;
  order: number;
  title: string;
} {
  // Default values
  let order = 999;

  let [group, slug] =
    id.split("/").length === 2
      ? [id.split("/")[0], id.split("/")[1]]
      : ["default", id];

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
    order,
    title,
  };
}
