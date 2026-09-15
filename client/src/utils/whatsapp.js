export const WHATSAPP_NUMBER = "233549582649";

export function buildWhatsAppLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function bookStyleLink(styleName) {
  return buildWhatsAppLink(`Hi! I'd love to book the ${styleName} style 💇🏾‍♀️`);
}

export const GENERAL_BOOKING_LINK = buildWhatsAppLink(
  "Hi Mirie Braids! I'd like to book an appointment 💇🏾‍♀️"
);
