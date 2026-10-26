
import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowRight } from "./Icons";

type HeroPoint = {
  title: string;
  text: string;
  href?: string;
  Icon: ComponentType<{ size?: number }>;
};

type HeroContentProps = {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  lead: string;
  centerTaglineTop: string;
  centerTaglineBottom: string;
  pointsAriaLabel: string;
  points: HeroPoint[];
  ctaHref?: string;
  ctaLabel: string;
};

export function Hero({
  eyebrow,
  titlePrefix,
  titleAccent,
  lead,
  centerTaglineTop,
  centerTaglineBottom,
  pointsAriaLabel,
  points,
  ctaHref = "/exchange",
  ctaLabel,
}: HeroContentProps) {
  return (
    <section className="hero">
      <div className="hero__background" />
      <div className="hero__glow hero__glow--one" />
      <div className="hero__glow hero__glow--two" />

      <div className="container hero__grid">
        <div className="hero-copy">
          <div className="eyebrow">{eyebrow}</div>
          <h1>
            {titlePrefix} <span>{titleAccent}</span>
          </h1>
          <p className="hero-lead">{lead}</p>
          <Link href={ctaHref} className="gold-button">
            {ctaLabel}
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="hero-center">
          <div className="hero-center__tagline">
            <span>{centerTaglineTop}</span>
            <span>{centerTaglineBottom}</span>
          </div>
        </div>

        <aside className="hero-points" aria-label={pointsAriaLabel}>
          {points.map(({ title, text, href, Icon }) => {
            const content = (
              <>
                <div className="hero-point__icon">
                  <Icon size={25} />
                </div>
                <div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              </>
            );

            return href ? (
              <Link href={href} className="hero-point hero-point--link" key={title}>
                {content}
              </Link>
            ) : (
              <div className="hero-point" key={title}>
                {content}
              </div>
            );
          })}
        </aside>
      </div>
    </section>
  );
}
