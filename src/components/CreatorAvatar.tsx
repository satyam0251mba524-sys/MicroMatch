import { useState } from 'react';
import type { CreatorNiche } from '../types';

interface CreatorAvatarProps {
  name: string;
  niche: CreatorNiche;
  avatarUrl?: string;
  className?: string;
}

const NICHE_GRADIENTS: Record<CreatorNiche, string> = {
  fashion: 'from-rose-100 via-orange-50 to-violet-100 text-rose-900',
  skincare: 'from-emerald-50 via-teal-50 to-sky-100 text-teal-900',
  lifestyle: 'from-violet-100 via-fuchsia-50 to-rose-50 text-violet-900',
  food: 'from-amber-100 via-orange-50 to-rose-100 text-amber-900',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

export function CreatorAvatar({ name, niche, avatarUrl, className = 'h-16 w-16' }: CreatorAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  if (avatarUrl && !imgFailed) {
    return (
      <div className={`overflow-hidden rounded-xl bg-zinc-100 shrink-0 ${className}`}>
        <img
          src={avatarUrl}
          alt={`${name} — vetted Delhi NCR micro-creator`}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-gradient-to-br ${NICHE_GRADIENTS[niche]} border border-zinc-200/80 font-display font-bold tracking-tight shrink-0 ${className}`}
      aria-label={name}
    >
      <span className="text-lg sm:text-xl">{getInitials(name)}</span>
    </div>
  );
}
