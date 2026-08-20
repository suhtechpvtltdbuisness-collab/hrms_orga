// GA4 integration — uses internal non-PII user IDs only.
// Never send email, phone, or any PII as user_id or custom dimensions.

const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

function gtag(...args) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function initGA4() {
  if (!GA4_ID || typeof window === "undefined") return;
  if (document.getElementById("ga4-script")) return; // already injected

  window.dataLayer = window.dataLayer || [];
  gtag("js", new Date());
  gtag("config", GA4_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.id = "ga4-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);
}

// Call after login/register — pass ONLY the internal non-PII user ID
export function setGA4User(internalUserId) {
  if (!GA4_ID) return;
  gtag("config", GA4_ID, { user_id: String(internalUserId) });
}

export function clearGA4User() {
  if (!GA4_ID) return;
  gtag("config", GA4_ID, { user_id: undefined });
}

export function ga4Event(eventName, params) {
  if (!GA4_ID) return;
  gtag("event", eventName, params);
}

export function ga4PageView(pageTitle, pageLocation) {
  if (!GA4_ID) return;
  gtag("event", "page_view", {
    page_title: pageTitle,
    page_location: pageLocation || window.location.href,
  });
}
