export function ucfirst(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Parse filename into components
 * @param filename - The filename to parse
 * @param isNumbered - Whether the file has numbered prefix (default: false)
 */
export function parseFilename(
  filename: string,
  isNumbered: boolean = false,
): {
  order: number;
  slug: string;
  title: string;
} {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");

  // Default values
  let slug = nameWithoutExt;
  let order = 999;

  // If the filename is numbered, extract order and slug
  if (isNumbered) {
    const match = nameWithoutExt.match(/^(\d+)-(.+)$/);

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
    order,
    slug,
    title,
  };
}
