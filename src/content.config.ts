import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

const projects = defineCollection({
  loader: file("src/data/projects.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    installCommand: z.string(),
    siteUrl: z.string().optional(),
    sourceUrl: z.string().optional(),
    manualUrl: z.string().optional(),
    status: z.array(
      z.enum([
        "work-in-progress",
        "archived",
        "experimental",
        "stable",
        "paused",
      ]),
    ),
    hidden: z.boolean(),
  }),
});

const themes = defineCollection({
  loader: file("src/data/themes.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    image: z.string(),
  }),
});

export const collections = {
  projects,
  themes,
};
