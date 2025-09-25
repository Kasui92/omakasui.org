export type Status =
  | "archived"
  | "work-in-progress"
  | "stable"
  | "experimental";

export const statusIcons: Record<Status, { icon: string; label: string }> = {
  archived: {
    icon: "nf-md-archive",
    label: "Archived",
  },
  "work-in-progress": {
    icon: "nf-md-crane",
    label: "Work in Progress",
  },
  stable: {
    icon: "nf-md-check",
    label: "Stable",
  },
  experimental: {
    icon: "nf-md-test_tube",
    label: "Experimental",
  },
} as const;
