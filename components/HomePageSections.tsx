"use client";

import { useState } from "react";
import BenefitsSection from "@/app/components/home/BenefitsSection";
import PremiumModal from "@/app/components/home/PremiumModal";
import PremiumTeaser from "@/app/components/home/PremiumTeaser";
import TrustStrip from "@/app/components/home/TrustStrip";
import { copy as uiCopy, type LangCode } from "@/lib/uiResources";

type HomePageSectionsProps = {
  lang: LangCode;
};

export function HomePageSections({ lang }: HomePageSectionsProps) {
  const [premiumOpen, setPremiumOpen] = useState(false);
  const copy = uiCopy[lang] ?? uiCopy.pt;

  return (
    <div className="home-sections container">
      <TrustStrip copy={copy} />
      <BenefitsSection copy={copy} />
      <PremiumTeaser copy={copy} setPremiumOpen={setPremiumOpen} />
      <PremiumModal
        copy={copy}
        premiumOpen={premiumOpen}
        setPremiumOpen={setPremiumOpen}
      />
    </div>
  );
}
