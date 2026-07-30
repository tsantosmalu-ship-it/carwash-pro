import { IconBrandWhatsapp } from '@tabler/icons-react'

const WHATSAPP_URL = 'https://wa.me/5531996810156'

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-20 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:bg-green-400"
    >
      <IconBrandWhatsapp size={28} stroke={1.75} />
    </a>
  )
}
