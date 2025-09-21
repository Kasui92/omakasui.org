import fs from "fs";
import path from "path";
import { ucfirst } from "./helpers";

export interface ManualPage {
  filename: string;
  title?: string;
  displayTitle: string;
  content: string;
  order: number;
  exists: boolean;
  slug: string;
}

export interface ManualPageInfo {
  filename: string;
  slug: string;
  displayTitle: string;
  order: number;
}

/**
 * Parse filename like "01-home.md" into components
 */
function parseFilename(filename: string): {
  order: number;
  slug: string;
  displayTitle: string;
} {
  const nameWithoutExt = path.basename(filename, ".md");
  const match = nameWithoutExt.match(/^(\d+)-(.+)$/);

  if (match) {
    const order = parseInt(match[1], 10);
    const slug = match[2];
    const displayTitle = slug
      .split("-")
      .map((word) => ucfirst(word))
      .join(" ");
    return { order, slug, displayTitle };
  }

  return {
    order: 999,
    slug: nameWithoutExt,
    displayTitle: ucfirst(nameWithoutExt),
  };
}

/**
 * Reads a Markdown file from the docs folder
 */
export function readManualPage(
  group: string,
  page: string = "home",
): ManualPage {
  const groupPath = path.join(process.cwd(), "docs", group);
  const files = fs.readdirSync(groupPath).filter((f) => f.endsWith(".md"));

  const targetFile = files.find((f) => {
    const { slug } = parseFilename(f);
    return slug === page;
  })!;

  const filePath = path.join(groupPath, targetFile);
  const content = fs.readFileSync(filePath, "utf-8");
  const { order, slug, displayTitle } = parseFilename(targetFile);

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : undefined;

  return {
    content,
    title,
    exists: true,
    filename: targetFile,
    order,
    slug,
    displayTitle: title || displayTitle,
  };
}

/**
 * Returns all available manual groups
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
 */
export function getManualPages(group: string): ManualPageInfo[] {
  const groupPath = path.join(process.cwd(), "docs", group);

  return fs
    .readdirSync(groupPath)
    .filter((file) => file.endsWith(".md"))
    .map((filename) => {
      const { order, slug, displayTitle } = parseFilename(filename);
      return {
        filename,
        slug,
        displayTitle,
        order,
      };
    })
    .sort((a, b) => a.order - b.order);
}
