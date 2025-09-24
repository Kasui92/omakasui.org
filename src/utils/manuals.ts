import fs from "fs";
import path from "path";
import { parseFilename } from "./helpers";
import { manuals, type Manual } from "../data/manuals";

export interface ManualPage {
  filename: string;
  title: string;
  content: string;
  order: number;
  exists: boolean;
  slug: string;
}

/**
 * Get manual data by ID from structured data
 * @param id - The manual ID
 * @returns Manual|undefined
 */
export function getManualById(id: string): Manual | undefined {
  return manuals.find((manual) => manual.id === id);
}

/**
 * Returns all available manual groups
 * @returns string[]
 */
export function getManualGroups(): string[] {
  const docsPath = path.join(process.cwd(), "docs");
  return fs
    .readdirSync(docsPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

/**
 * Returns metadata for all pages in a manual group, sorted by order
 * Enriches file-based data with structured manual information
 */
export function getManualPages(group: string): Partial<ManualPage>[] {
  const groupPath = path.join(process.cwd(), "docs", group);

  return fs
    .readdirSync(groupPath)
    .filter((file) => file.endsWith(".md"))
    .map((filename) => {
      const { order, slug } = parseFilename(filename, true);

      // Always use manual title for home page, fallback to generated title for other pages
      const title = parseFilename(filename, true).title;

      return {
        filename,
        slug,
        title,
        order,
      };
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Reads a Markdown file from the docs folder
 * @param group - The manual group (subfolder in docs)
 * @param page - The page slug (filename without extension)
 * @returns ManualPage
 */
export function readManualPage(
  group: string,
  page: string = "home",
): ManualPage {
  // List all markdown files in the group directory
  const groupPath = path.join(process.cwd(), "docs", group);
  const files = fs.readdirSync(groupPath).filter((f) => f.endsWith(".md"));

  // Find the file matching the requested page slug
  const targetFile = files.find((f) => {
    const { slug } = parseFilename(f, true);
    return slug === page;
  })!;

  const filePath = path.join(groupPath, targetFile);
  const content = fs.readFileSync(filePath, "utf-8");
  const { order, slug, title } = parseFilename(targetFile, true);

  return {
    order,
    content,
    title,
    exists: true,
    filename: targetFile,
    slug,
  };
}
