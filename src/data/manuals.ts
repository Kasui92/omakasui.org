import type { Status } from "./status";

export interface Manual {
  id: string;
  title: string;
  description: string;
  url: string;
  coverImage?: string;
  status: Status[];
  hidden?: boolean;
}

export const manuals: Manual[] = [
  {
    id: "omarell",
    title: "Omarell",
    description: "The Omarell Manual",
    url: "/manuals/omarell/",
    coverImage: "/logos/omarell.png",
    status: ["archived"],
    hidden: true,
  },
  {
    id: "omaforge",
    title: "Omaforge",
    description: "The Omaforge Manual",
    url: "/manuals/omaforge/",
    coverImage: "/logos/omaforge.png",
    status: ["archived"],
    hidden: true,
  },
];
