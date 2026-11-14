'use client'

import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import { useGameSettings } from './settings-provider'

type HoloDialogProps = {
  open: boolean
  onClose: () => void
  eyebrow: string
  title: string
  children: React.ReactNode
}

export function HoloDialog({ open, onClose, eyebrow, title, children }: HoloDialogProps) {
  const { t } = useGameSettings()
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close()
      }}
      className="holo-dialog m-auto max-h-[88dvh] w-[min(92vw,540px)] overflow-y-auto rounded-[28px] border border-hud/35 bg-midnight/90 p-0 text-frost shadow-[0_0_60px_rgba(73,215,255,0.14)] backdrop-blur-md"
    >
      <div className="relative p-6 sm:p-8">
        <span aria-hidden className="absolute left-4 top-4 size-4 border-l border-t border-hud/70" />
        <span aria-hidden className="absolute bottom-4 right-4 size-4 border-b border-r border-hud/70" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.34em] text-hud">{eyebrow}</p>
            <h2 id={titleId} className="mt-2 font-display text-2xl tracking-[0.06em]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={t('Close')}
            className="rounded-full border border-hud/30 p-2 text-frost/80 transition-colors hover:border-hud/70 hover:text-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </dialog>
  )
}
