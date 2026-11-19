import { MessageCircle, ExternalLink, X } from 'lucide-react';
import { useState } from 'react';
import { MICROMATCH_WHATSAPP } from '../data/seed';
import { formatWhatsAppHref } from '../utils/format';

export function WhatsAppFloatingButton() {
  const [open, setOpen] = useState(false);

  const brandHref = formatWhatsAppHref(
    MICROMATCH_WHATSAPP,
    'Hi MicroMatch team! I run a boutique brand in Delhi NCR and would like a vetted creator shortlist.'
  );
  const creatorHref = formatWhatsAppHref(
    MICROMATCH_WHATSAPP,
    'Hi MicroMatch team! I am a Delhi NCR creator (2k–20k followers) and have a question about the audit.'
  );

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="w-72 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl">
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-zinc-100">
            <div>
              <p className="font-display text-sm font-bold text-zinc-900">MicroMatch Concierge</p>
              <p className="text-xs text-zinc-500">South Delhi & Gurugram · Replies in under 2 hrs</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              aria-label="Close WhatsApp chat menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <a
              href={brandHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-left text-xs font-medium text-zinc-800 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors"
            >
              <span>I&apos;m a brand — ask about shortlists</span>
              <ExternalLink className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            </a>
            <a
              href={creatorHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-left text-xs font-medium text-zinc-800 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors"
            >
              <span>I&apos;m a creator — ask about vetting</span>
              <ExternalLink className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white shadow-lg transition-transform duration-150 hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        <MessageCircle className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">Chat on WhatsApp</span>
      </button>
    </div>
  );
}
