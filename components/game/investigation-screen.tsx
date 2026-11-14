'use client'

import { OrbitalCapsuleButton } from './orbital-capsule-button'
import { useGameSettings } from './settings-provider'

const FACTS = [
  { label: 'Landed', value: 'Jan 25, 2004' },
  { label: 'Planned mission', value: '90 sols' },
  { label: 'Last contact', value: 'Jun 10, 2018' },
]

export function InvestigationScreen({ onBack }: { onBack: () => void }) {
  const { t } = useGameSettings()
  return (
    <section
      aria-labelledby="investigation-title"
      className="parallax-near relative z-10 flex w-full max-w-5xl flex-col items-start px-6 sm:px-12"
    >
      <div className="intro-el w-full max-w-xl rounded-[28px] border border-ember/30 bg-navy/70 p-6 shadow-[0_0_40px_rgba(255,154,61,0.12)] backdrop-blur-md sm:p-9">
        <p className="text-[11px] font-semibold tracking-[0.34em] text-ember">{t('MISSION 01 · BRIEFING')}</p>
        <h2 id="investigation-title" className="mt-3 font-display text-3xl tracking-[0.06em] text-frost sm:text-4xl">
          OPPORTUNITY
        </h2>
        <p className="mt-1 text-sm italic tracking-[0.2em] text-hud/85">{t('Meridiani Planum · Mars')}</p>

        <p className="mt-5 text-pretty leading-relaxed text-frost/85">
          {t("Fourteen years after touching down, the rover’s transmissions fell silent during a planet-wide dust storm. Trace the final signals and reconstruct what it saw in its last days on the plains.")}
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-hud/20 py-4">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <dt className="text-[10px] tracking-[0.22em] text-hud/75 uppercase">{t(fact.label)}</dt>
              <dd className="mt-1 text-sm font-semibold text-frost sm:text-base">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-xs leading-relaxed text-frost/60">
          {t('Story premise inspired by the real Mars Exploration Rover mission. The investigation module is in development and is not playable in this build.')}
        </p>

        <div className="mt-7">
          <OrbitalCapsuleButton
            label={t('Back to Main Menu')}
            sound="back"
            width="min(78vw, 300px)"
            height="50px"
            phase={0.2}
            onActivate={onBack}
            autoFocus
          />
        </div>
      </div>
    </section>
  )
}
