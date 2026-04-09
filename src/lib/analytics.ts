export const trackGaEvent = (
  action: string,
  params?: Record<string, string | number | boolean | null>
) => {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', action, params || {});
};
