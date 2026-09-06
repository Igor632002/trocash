// Pure domain rules for creating an offer — no React, no Supabase, reusable anywhere (hooks, API routes, Server Components)

// Matches DB enum: 'Objeto' | 'Serviço' | 'Horas'
export function deriveOfferKind(form, category) {
  if (form.kind && form.kind.trim()) return form.kind;
  if (category === "Serviços") return "Serviço";
  if (category === "Tempo") return "Horas";
  return "Objeto";
}

export function buildOfferPayload(form, category) {
  return {
    ...form,
    kind: deriveOfferKind(form, category),
    area: form.area || "Faro",
    category_id: category === "Todas" ? null : category,
  };
}

export function validateOfferForm(form) {
  if (!form?.title || !form.title.trim()) {
    return { valid: false, error: "missingTitle" };
  }
  return { valid: true };
}
