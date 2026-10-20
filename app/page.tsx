import HomeLanding from "@/components/HomeLanding";
import type { LangCode } from "@/lib/uiResources";

export default function HomePage({ initialLang = "pt" }: { initialLang?: LangCode }) {
  return <HomeLanding initialLang={initialLang} />;
}
