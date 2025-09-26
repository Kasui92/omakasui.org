import type { Status } from "./status";

export interface Manual {
  id: string;
  title: string;
  description: string;
  url: string;
  coverImage?: string;
  status: Status[];
  dateArchived?: string;
  hidden?: boolean;
}

export interface ManualPage {
  filename: string;
  title: string;
  content: string;
  order: number;
  exists: boolean;
  slug: string;
}

export const manuals: Manual[] = [
  {
    id: "omarell",
    title: "Omarell",
    description: "The Omarell Manual",
    url: "/manuals/omarell/",
    coverImage: "/logos/omarell.png",
    status: ["archived"],
    dateArchived: "2025-09-13",
    hidden: true,
  },
  {
    id: "omaforge",
    title: "Omaforge",
    description: "The Omaforge Manual",
    url: "/manuals/omaforge/",
    coverImage: "/logos/omaforge.png",
    status: ["archived"],
    dateArchived: "2025-09-10",
    hidden: true,
  },
  {
    id: "omakube",
    title: "Omakube",
    description: "The Omakube Manual",
    url: "/manuals/omakube/",
    coverImage: "/logos/omakube.png",
    status: [],
    hidden: false,
  },
];
