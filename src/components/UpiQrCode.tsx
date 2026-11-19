import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { MICROMATCH_UPI_ID } from '../data/seed';
import { formatINR } from '../utils/format';

interface UpiQrCodeProps {
  amount: number;
}

// Deterministic decorative 21x21 QR-like matrix SVG for UPI checkout preview
const QR_PATTERN = [
  '111111101011011111111',
  '100000100110001000001',
  '101110101101101011101',
  '101110100010101011101',
  '101110101100101011101',
  '100000101011001000001',
  '111111101010101111111',
  '000000001101000000000',
  '101101110010110110101',
  '010010001101001001010',
  '111011101011101101100',
  '001100010100110010011',
  '110101111011001110101',
  '000000001010110001010',
  '111111101101001011101',
  '100000100010110100010',
  '101110101111001110111',
  '101110100100110001001',
  '101110101011011010110',
  '100000101100100101001',
  '111111100110111011011',
];

export function UpiQrCode({ amount }: UpiQrCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MICROMATCH_UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored in restricted frames
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 shrink-0">
          <svg
            viewBox="0 0 21 21"
            className="h-28 w-28 text-zinc-900"
            role="img"
            aria-label={`UPI QR Code for ${formatINR(amount)}`}
          >
            {QR_PATTERN.map((row, y) =>
              row.split('').map((cell, x) =>
                cell === '1' ? (
                  <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="currentColor" />
                ) : null
              )
            )}
          </svg>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-medium text-zinc-500">Pay via UPI (Manual Pilot Escrow)</p>
          <p className="mt-1 font-display text-lg font-bold text-zinc-900 tabular-nums">
            {formatINR(amount)}
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Scan using GPay, PhonePe, or Paytm, or send to the UPI ID below. Admin marks receipt within 2 hours.
          </p>
          <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
            <code className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 font-mono text-xs text-zinc-800">
              {MICROMATCH_UPI_ID}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
