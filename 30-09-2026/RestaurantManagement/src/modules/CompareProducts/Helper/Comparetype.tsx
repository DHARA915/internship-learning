/* modules/CompareProducts/compareTypes.ts
   Shared types for the compare feature. Import from here in any file that touches the table plan. */
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type {
  CompareProduct,
  ProductCategory,
} from "../../../Redux/Slices/ProductCompareSlice/compareSlice";

export type SpecGroup = "none" | "basic" | "display" | "camera" | "additional";
export interface GroupMeta { label: string; hint: string }
export type GroupSet = Record<Exclude<SpecGroup, "none">, GroupMeta>;

export interface SpecRow {
  key: string;
  label: string;
  icon: LucideIcon;
  group: SpecGroup;
  render: (item: any) => ReactNode;
}

export interface CompareCategoryConfig {
  id: ProductCategory;
  title: string;
  description: string;
  noun: string;
  plural: string;
  icon: LucideIcon;
  items: CompareProduct[];
  specs: SpecRow[];
  groups: GroupSet;
  highlights: (item: any) => string[];
}