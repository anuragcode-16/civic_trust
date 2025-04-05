/**
 * WhatsApp API integration utilities
 */

// Default WhatsApp phone number from environment variables
const DEFAULT_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '919876543210';

// Default message text
const DEFAULT_MESSAGE = "Hello! I'm interested in learning more about CivicChain.";

/**
 * Generate a WhatsApp chat link
 * @param phone - Phone number with country code (no +, spaces or dashes)
 * @param message - Pre-filled message
 * @returns WhatsApp chat URL
 */
export function generateWhatsAppLink(
  phone: string = DEFAULT_PHONE,
  message: string = DEFAULT_MESSAGE
): string {
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Return the WhatsApp API URL
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/**
 * Open WhatsApp chat in a new window
 * @param phone - Phone number with country code
 * @param message - Pre-filled message
 */
export function openWhatsAppChat(
  phone: string = DEFAULT_PHONE,
  message: string = DEFAULT_MESSAGE
): void {
  const url = generateWhatsAppLink(phone, message);
  window.open(url, '_blank');
}

/**
 * Generate a WhatsApp group invite link
 * (Note: This requires a manually created invite link since WhatsApp API doesn't provide programmatic group creation)
 * @returns WhatsApp group invite link
 */
export function getWhatsAppGroupLink(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/example';
}

/**
 * Open WhatsApp Business chat with predefined template
 * (This is a simplified mock that uses the free API, actual WhatsApp Business API would require authentication)
 * @param templateName - Name of the template to use
 */
export function sendTemplateMessage(templateName: string = 'welcome'): void {
  // In a real implementation, this would call the WhatsApp Business API
  // For now, we just open a regular chat with a template-like message
  let message = DEFAULT_MESSAGE;
  
  switch (templateName) {
    case 'welcome':
      message = "Hello! Welcome to CivicChain. How can we help you today?";
      break;
    case 'support':
      message = "Hello! I need support with CivicChain. Can you help me?";
      break;
    case 'feedback':
      message = "Hello! I'd like to provide feedback about CivicChain.";
      break;
    default:
      message = DEFAULT_MESSAGE;
  }
  
  openWhatsAppChat(DEFAULT_PHONE, message);
} 