import { trackCustomEvent } from 'gatsby-plugin-google-analytics'

export default function sendToGoogleAnalytics({name, delta, id}) {
  trackCustomEvent({
    category: "Web Vitals",
    action: name,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    label: id,
    nonInteraction: true,
  });
}
