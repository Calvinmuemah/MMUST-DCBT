/**
 * Google Analytics 4 (GA4) Utility for MMUST DCBT Client
 * Provides zero-dependency GA4 initialization, SPA route tracking, and custom event logging.
 */

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

/**
 * Initialize Google Tag (gtag.js) dynamically
 */
export const initGA = () => {
  if (typeof window === "undefined") return;

  if (!GA_MEASUREMENT_ID) {
    if (import.meta.env.DEV) {
      console.info("[Analytics] VITE_GA_MEASUREMENT_ID is not configured. Google Analytics tracking is disabled.");
    }
    return;
  }

  // Prevent multiple injections
  if (document.getElementById("ga-gtag-script")) return;

  // 1. Inject gtag script
  const script = document.createElement("script");
  script.id = "ga-gtag-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // 2. Setup dataLayer & gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  // Disable automatic initial pageview so React Router can accurately report SPA navigation
  gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  });

  if (import.meta.env.DEV) {
    console.info(`[Analytics] GA4 initialized successfully with ID: ${GA_MEASUREMENT_ID}`);
  }
};

/**
 * Track SPA Pageviews on React Router location change
 * @param {string} path - Current pathname and search query
 * @param {string} [title] - Page title
 */
export const trackPageView = (path, title) => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: title || document.title,
  });

  if (import.meta.env.DEV) {
    console.log(`[Analytics] Pageview tracked: ${path}`);
  }
};

/**
 * Track Custom Student Interaction Events
 * Examples: APK download, crisis call, assessment complete, login
 * @param {string} action - Event name (e.g. 'download_apk', 'crisis_support_click')
 * @param {object} [params] - Key-value event attributes
 */
export const trackEvent = (action, params = {}) => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", action, params);

  if (import.meta.env.DEV) {
    console.log(`[Analytics] Event tracked: ${action}`, params);
  }
};
