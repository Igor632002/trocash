"use client";

import { useEffect, useRef, useState } from "react";

type SupportProjectCopy = {
  supportProjectButton: string;
  supportProjectTeaser: string;
  supportProjectTitle: string;
  supportProjectParagraphs: string[];
  supportProjectAmountsTitle: string;
  supportProjectAmounts: string[];
  supportProjectFrequencyTitle: string;
  supportProjectFrequencyOnce: string;
  supportProjectFrequencyMonthly: string;
  supportProjectPaymentInstructions: string;
  supportProjectBankDetailsTitle: string;
  supportProjectMonthlyInstructions: string;
  supportProjectIdeaTitle: string;
  supportProjectIdea: string;
  supportProjectCloseLabel: string;
};

type SupportProjectProps = {
  copy: SupportProjectCopy;
};

export function SupportProject({ copy }: SupportProjectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <section className="support-project container">
        <p>{copy.supportProjectTeaser}</p>
        <button
          ref={triggerRef}
          className="support-project__trigger"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          {copy.supportProjectButton}
        </button>
      </section>

      {isOpen && (
        <div
          className="support-project__backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            className="support-project__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-project-title"
          >
            <button
              ref={closeRef}
              className="support-project__close"
              type="button"
              aria-label={copy.supportProjectCloseLabel}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
            <h2 id="support-project-title">{copy.supportProjectTitle}</h2>
            <div className="support-project__message">
              {copy.supportProjectParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <h3>{copy.supportProjectAmountsTitle}</h3>
            <ul className="support-project__amounts">
              {copy.supportProjectAmounts.map((amount) => (
                <li key={amount}>{amount}</li>
              ))}
            </ul>
            <fieldset className="support-project__frequency">
              <legend>{copy.supportProjectFrequencyTitle}</legend>
              <label>
                <input
                  type="radio"
                  name="support-project-frequency"
                  checked={frequency === "once"}
                  onChange={() => setFrequency("once")}
                />
                {copy.supportProjectFrequencyOnce}
              </label>
              <label>
                <input
                  type="radio"
                  name="support-project-frequency"
                  checked={frequency === "monthly"}
                  onChange={() => setFrequency("monthly")}
                />
                {copy.supportProjectFrequencyMonthly}
              </label>
            </fieldset>
            <div className="support-project__payment">
              <p>{copy.supportProjectPaymentInstructions}</p>
              <strong>MB WAY: 931950828</strong>
              <p>{copy.supportProjectBankDetailsTitle}</p>
              <strong>NIB: 0193 0000 1050 2011 4476 4</strong>
              <strong>IBAN: PT50 0193 0000 1050 2011 4476 4</strong>
              <p>{copy.supportProjectMonthlyInstructions}</p>
            </div>
            <p className="support-project__idea">
              <strong>{copy.supportProjectIdeaTitle}</strong> {copy.supportProjectIdea}
            </p>
          </section>
        </div>
      )}
    </>
  );
}
