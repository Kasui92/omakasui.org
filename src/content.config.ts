import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const manualsPages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./docs" }),
});

const manuals = defineCollection({
  loader: file("src/data/manuals.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    url: z.string(),
    coverImage: z.string().optional(),
    status: z.array(z.enum(["archived"])),
    dateArchived: z.string().optional(),
    hidden: z.boolean().optional(),
  }),
});

const projects = defineCollection({
  loader: file("src/data/projects.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    installCommand: z.string(),
    githubUrl: z.string().optional(),
    manualUrl: z.string().optional(),
    status: z.array(z.enum(["work-in-progress", "archived", "experimental"])),
    hidden: z.boolean(),
  }),
});

export const collections = {
  manualsPages,
  manuals,
  projects,
};
