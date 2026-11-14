import type { CSSProperties } from 'react'
import { SignalWaveform } from './signal-waveform'
import { useGameSettings } from './settings-provider'

const intro = (delay: string, anim = 'intro-rise', dur = '0.9s') =>
  ({ '--intro-delay': delay, '--intro-anim': anim, '--intro-dur': dur }) as CSSProperties

export function GameTitle() {
  const { t } = useGameSettings()
  return (
    <div className="relative flex flex-col items-center text-center">
      <h1 className="flex flex-col items-center">
        <span
          className="intro-el font-display text-[clamp(16px,3vh,34px)] tracking-[0.62em] text-frost/90 [text-shadow:0_0_12px_rgba(73,215,255,0.35)]"
          style={intro('1.35s', 'intro-title', '1.1s')}
        >
          <span className="pl-[0.62em]">THE</span>
        </span>
        <span
          className="intro-el title-metal mt-[1.2vh] font-display leading-[1.02] tracking-[0.03em] text-[13vw] sm:text-[min(7.2vw,11.5vh)]"
          style={intro('1.55s', 'intro-title', '1.3s')}
        >
          <span className="block sm:inline">LAST</span>
          <span className="hidden sm:inline"> </span>
          <span className="block sm:inline">SIGNAL</span>
        </span>
      </h1>

      <div
        className="intro-el mt-[1.6vh] flex items-center gap-3 sm:gap-5"
        style={intro('2.15s', 'intro-fade', '1s')}
      >
        <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-hud/80 sm:w-20" />
        <p className="font-sans text-[clamp(13px,2.4vh,26px)] font-light italic tracking-[0.42em] text-frost/90 [text-shadow:0_1px_8px_rgba(8,17,27,0.8)]">
          {t('Echoes of Exploration.')}
        </p>
        <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-hud/80 sm:w-20" />
      </div>

      <div
        className="intro-el mt-[1.2vh] flex w-[min(80vw,520px)] items-center gap-2"
        style={intro('2.35s', 'intro-fade', '1s')}
      >
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent to-ember/60" />
        <SignalWaveform bars={40} color="#F2B35D" className="h-[clamp(22px,4vh,38px)] w-[min(30vw,150px)]" />
        <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-transparent to-ember/60" />
      </div>
    </div>
  )
}
