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
  supportProjectAmountLabel: string;
  supportProjectOtherAmountLabel: string;
  supportProjectManualTransferInstructions: string;
  supportProjectCopyNumberButton: string;
  supportProjectCopyNumberSuccess: string;
  supportProjectCopyNumberFailure: string;
  supportProjectTransferredButton: string;
  supportProjectConfirmationTitle: string;
  supportProjectConfirmationBody: string;
  supportProjectBackButton: string;
  supportProjectIdeaTitle: string;
  supportProjectIdea: string;
  supportProjectCloseLabel: string;
};

type SupportProjectProps = {
  copy: SupportProjectCopy;
};

const MB_WAY_NUMBER = "931950828";

export function SupportProject({ copy }: SupportProjectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [selectedAmountIndex, setSelectedAmountIndex] = useState<number | null>(null);
  const [otherAmount, setOtherAmount] = useState("");
  const [copyStatus, setCopyStatus] = useState<"copied" | "failed" | null>(null);
  const [transferConfirmed, setTransferConfirmed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const selectedAmount = selectedAmountIndex === null
    ? null
    : copy.supportProjectAmounts[selectedAmountIndex];
  const isOtherAmount = selectedAmountIndex === copy.supportProjectAmounts.length - 1;
  const parsedOtherAmount = Number(otherAmount);
  const isOtherAmountValid = Number.isFinite(parsedOtherAmount) && parsedOtherAmount > 0;
  const formattedOtherAmount = isOtherAmountValid
    ? `€${new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parsedOtherAmount)}`
    : null;
  const presetAmount = selectedAmount?.match(/€\s*[\d.,]+/)?.[0] ?? selectedAmount;
  const amountToTransfer = isOtherAmount ? formattedOtherAmount : presetAmount;

  const handleCopyNumber = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API is unavailable");
      }
      await navigator.clipboard.writeText(MB_WAY_NUMBER);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  };

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
          onClick={() => {
            setSelectedAmountIndex(null);
            setOtherAmount("");
            setCopyStatus(null);
            setTransferConfirmed(false);
            setIsOpen(true);
          }}
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
            {selectedAmountIndex === null ? (
              <>
                <h3>{copy.supportProjectAmountsTitle}</h3>
                <ul className="support-project__amounts">
                  {copy.supportProjectAmounts.map((amount, index) => (
                    <li key={amount}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAmountIndex(index);
                          setOtherAmount("");
                          setCopyStatus(null);
                          setTransferConfirmed(false);
                        }}
                      >
                        {amount}
                      </button>
                    </li>
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
                  <strong>MB WAY: {MB_WAY_NUMBER}</strong>
                  <p>{copy.supportProjectBankDetailsTitle}</p>
                  <strong>NIB: 0193 0000 1050 2011 4476 4</strong>
                  <strong>IBAN: PT50 0193 0000 1050 2011 4476 4</strong>
                  <p>{copy.supportProjectMonthlyInstructions}</p>
                </div>
                <p className="support-project__idea">
                  <strong>{copy.supportProjectIdeaTitle}</strong> {copy.supportProjectIdea}
                </p>
              </>
            ) : transferConfirmed ? (
              <div className="support-project__payment-result" role="status">
                <h3>{copy.supportProjectConfirmationTitle}</h3>
                <p>{copy.supportProjectConfirmationBody}</p>
              </div>
            ) : (
              <div className="support-project__payment">
                <p>{copy.supportProjectManualTransferInstructions}</p>
                <p>
                  <strong>{copy.supportProjectAmountLabel}</strong>{" "}
                  {isOtherAmount ? (
                    <label className="support-project__custom-amount">
                      {copy.supportProjectOtherAmountLabel}
                      <span>
                        €
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          inputMode="decimal"
                          value={otherAmount}
                          onChange={(event) => {
                            setOtherAmount(event.target.value);
                            setCopyStatus(null);
                          }}
                        />
                      </span>
                    </label>
                  ) : (
                    amountToTransfer
                  )}
                </p>
                <p>
                  <strong>MB WAY: {MB_WAY_NUMBER}</strong>
                </p>
                <p>
                  {copy.supportProjectFrequencyTitle}{" "}
                  {frequency === "once"
                    ? copy.supportProjectFrequencyOnce
                    : copy.supportProjectFrequencyMonthly}
                </p>
                <div className="support-project__payment-actions">
                  <button
                    className="support-project__payment-action"
                    type="button"
                    onClick={handleCopyNumber}
                  >
                    {copy.supportProjectCopyNumberButton}
                  </button>
                  <button
                    className="support-project__payment-action support-project__payment-action--primary"
                    type="button"
                    disabled={!amountToTransfer}
                    onClick={() => setTransferConfirmed(true)}
                  >
                    {copy.supportProjectTransferredButton}
                  </button>
                </div>
                {copyStatus && (
                  <p className="support-project__copy-status" role="status">
                    {copyStatus === "copied"
                      ? (
                        <>
                          {copy.supportProjectCopyNumberSuccess}
                          <strong>{MB_WAY_NUMBER}</strong>
                        </>
                      )
                      : copy.supportProjectCopyNumberFailure}
                  </p>
                )}
                <button
                  className="support-project__back"
                  type="button"
                  onClick={() => {
                    setSelectedAmountIndex(null);
                    setOtherAmount("");
                    setCopyStatus(null);
                  }}
                >
                  {copy.supportProjectBackButton}
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
