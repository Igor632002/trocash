import type { ComponentType } from "react";

declare const SiteFooter: ComponentType<{
  copy: Record<string, string | undefined>;
  lang?: string;
}>;

export default SiteFooter;
