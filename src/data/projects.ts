import type { Status } from "./status";

export interface Project {
  id: string;
  name: string;
  description: string;
  installCommand: string;
  githubUrl?: string;
  manualUrl?: string;
  status: Status[];
  hidden: boolean;
}

export const projects: Project[] = [
  {
    id: "dotfiles",
    name: "dotfiles",
    description:
      "My personal <strong>dotfiles</strong>, also designed for Omakase scripts",
    installCommand: "curl -fsSL https://omakasui.org/dotfiles | bash",
    githubUrl: "https://github.com/Kasui92/dotfiles",
    status: [],
    hidden: false,
  },
  {
    id: "omakube",
    name: "omakube",
    description:
      'A fork of <a href="https://omakub.org" target="_blank" title="View Omakub website" rel="noopener">Omakub</a>, weighed down and more refined',
    installCommand: "curl -fsSL https://omakasui.org/omakube | bash",
    githubUrl: "https://github.com/Kasui92/omakube",
    status: ["work-in-progress"],
    hidden: false,
  },
  {
    id: "omarell",
    name: "omarell",
    description: "A personal Omakube fork, less apps and more focus",
    installCommand: "curl -fsSL https://omakasui.org/omarell | bash",
    status: ["archived"],
    hidden: true,
  },
  {
    id: "omaforge",
    name: "omaforge",
    description:
      'Opinionated <strong>Ubuntu</strong>/<strong>Gnome</strong> Setup, powered by <a href="https://github.com/forge-ext/forge" target="_blank" title="View Forge source code on GitHub" rel="noopener">Forge</a>',
    installCommand: "curl -fsSL https://omakasui.org/omaforge | bash",
    githubUrl: "https://github.com/Kasui92/omaforge",
    manualUrl: "/manuals/omaforge/",
    status: ["archived", "experimental"],
    hidden: true,
  },
  {
    id: "omadeb",
    name: "omadeb",
    description: "Just like Omakube, but for <strong>Debian</strong>",
    installCommand: "curl -fsSL https://omakasui.org/omadeb | bash",
    githubUrl: "https://github.com/Kasui92/omadeb",
    status: ["work-in-progress"],
    hidden: false,
  },
  {
    id: "omasway",
    name: "omasway",
    description:
      "Opinionated <strong>Ubuntu</strong>/<strong>Sway</strong> Setup",
    installCommand: "curl -fsSL https://omakasui.org/omasway | bash",
    githubUrl: "https://github.com/Kasui92/omasway",
    status: ["work-in-progress"],
    hidden: false,
  },
];
