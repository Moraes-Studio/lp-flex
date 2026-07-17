import { env } from '@/config/env';

export const siteConfig = {
  name: 'Academia Flex',
  tagline: 'Academia de bairro na Vila Helena, Santo André, desde 1992.',
  url: env.NEXT_PUBLIC_SITE_URL,
  whatsappNumber: env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  instagramUrl: env.NEXT_PUBLIC_INSTAGRAM_URL,
};

export function whatsappUrl(message: string): string {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${siteConfig.whatsappNumber}?${params.toString()}`;
}
