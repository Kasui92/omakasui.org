export interface ParsedManualCollectionId {
  slug: string;
  group: string;
  orderChapter?: number;
  chapter?: string;
  order: number;
  title: string;
}

export interface ManualNavItem {
  slug: string;
  title: string;
  url: string;
  active: boolean;
  chapter?: string;
  orderChapter?: number;
}
