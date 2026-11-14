'use client'

import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGameSettings } from '../settings-provider'

export function BackChip({ label, onClick }: { label: string; onClick: () => void }) {
  const { play } = useGameSettings()
  return (
    <button
      type="button"
      onPointerEnter={(e) => e.pointerType === 'mouse' && play('hover')}
      onClick={() => {
        play('back')
        onClick()
      }}
      className="group inline-flex items-center gap-1.5 rounded-full border border-hud/35 bg-navy/60 py-1.5 pl-2.5 pr-4 text-[11px] font-semibold tracking-[0.22em] text-frost/85 uppercase transition-[border-color,color,box-shadow] duration-300 hover:border-hud hover:text-frost hover:shadow-[0_0_18px_rgba(73,215,255,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud"
    >
      <ChevronLeft aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      {label}
    </button>
  )
}

export function SourceTag({ kind }: { kind: 'history' | 'fiction' | 'render' }) {
  const map = {
    history: { label: 'Verified history', cls: 'border-hud/40 text-hud' },
    fiction: { label: 'Fiction', cls: 'border-ember/50 text-ember' },
    render: { label: 'Artistic render', cls: 'border-frost/30 text-frost/70' },
  } as const
  const { label, cls } = map[kind]
  const { t } = useGameSettings()
  return (
    <span
      className={cn(
        'shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em]',
        cls,
      )}
    >
      {t(label)}
    </span>
  )
}
