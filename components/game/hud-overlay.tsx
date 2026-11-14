'use client'

import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { useGameSettings } from './settings-provider'
import { SignalWaveform } from './signal-waveform'

const hudIntro = (delay: string) =>
  ({ '--intro-anim': 'intro-fade', '--intro-delay': delay, '--intro-dur': '0.8s' }) as CSSProperties

const CORNERS = [
  'left-3 top-3 border-l border-t sm:left-5 sm:top-5',
  'right-3 top-3 border-r border-t sm:right-5 sm:top-5',
  'bottom-3 left-3 border-b border-l sm:bottom-5 sm:left-5',
  'bottom-3 right-3 border-b border-r sm:bottom-5 sm:right-5',
]

export function HudOverlay() {
  const { t } = useGameSettings()

  return (
    <div className="pointer-events-none absolute inset-0 z-20 text-hud">
      {CORNERS.map((pos, i) => (
        <span
          key={pos}
          aria-hidden
          className={cn(
            'intro-el absolute size-10 border-hud/70 sm:size-14',
            '[box-shadow:0_0_12px_rgba(73,215,255,0.08)]',
            pos,
          )}
          style={hudIntro(`${0.9 + i * 0.08}s`)}
        />
      ))}

      <p
        className="intro-el absolute left-7 top-7 max-w-[min(42vw,26rem)] text-[clamp(9px,1.1vw,12px)] font-medium tracking-[0.14em] text-frost/75 [text-wrap:balance] sm:left-10 sm:top-10"
        style={hudIntro('1.1s')}
      >
        {t('Every mission leaves a story behind.')}
      </p>

      <div
        className="intro-el absolute right-7 top-7 flex max-w-[42vw] flex-col items-end gap-1.5 text-right sm:right-10 sm:top-10"
        style={hudIntro('1.25s')}
      >
        <div className="flex items-center gap-3">
          <SignalWaveform bars={28} envelope="flat" color="#49D7FF" strokeWidth={1} className="h-5 w-24 opacity-80" />
          <div aria-hidden className="hidden grid-cols-4 gap-0.5 sm:grid">
            {[1, 1, 0.4, 1, 0.4, 1, 1, 0.25].map((o, i) => (
              <span key={i} className="size-1.5 bg-hud" style={{ opacity: o }} />
            ))}
          </div>
        </div>
        <p className="text-[clamp(8px,1vw,10px)] tracking-[0.18em] text-hud/70">{t('SIGNAL LOCK · SIMULATED')}</p>
      </div>

    </div>
  )
}
