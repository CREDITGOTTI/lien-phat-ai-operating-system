export type AnalyticsEvent =
  | "page_view"
  | "cta_click"
  | "form_open"
  | "form_start"
  | "form_submit"
  | "form_success"
  | "calculator_completion"
  | "pricing_cta_click"
  | "outbound_click";

export function track(event: AnalyticsEvent, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const payload = { event, ...properties, timestamp: new Date().toISOString() };
  window.dispatchEvent(new CustomEvent("lienphat:analytics", { detail: payload }));
  const dataLayer = (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer;
  dataLayer?.push(payload);
}