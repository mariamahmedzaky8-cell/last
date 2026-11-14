'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { OrbitalCapsuleButton } from '../orbital-capsule-button'
import { useGameSettings } from '../settings-provider'
import {
  OPPORTUNITY_CONTEXT,
  OPPORTUNITY_FACTS,
  OPPORTUNITY_INSTRUMENTS,
  OPPORTUNITY_OBJECTIVES,
  OPPORTUNITY_OVERVIEW,
  OPPORTUNITY_ROVER,
} from './archive-data'
import { BackChip, SourceTag } from './archive-ui'

type MissionDossierProps = {
  onBack: () => void
  onExplore: () => void
  onBegin: () => void
}

export function MissionDossier({ onBack, onExplore, onBegin }: MissionDossierProps) {
  const { t } = useGameSettings()
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])

  return (
    <section
      aria-labelledby="dossier-title"
      className="arc-panel-in arc-glass relative mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden"
      style={{ '--tone': '#ff9a3d' } as React.CSSProperties}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ember/20 px-5 py-3 sm:px-7">
        <BackChip label={t('Archives')} onClick={onBack} />
        <p className="text-[10px] font-semibold tracking-[0.32em] text-ember">{t('MISSION 01 · DOSSIER')}</p>
      </header>

      <div className="arc-scroll grid min-h-0 flex-1 gap-6 overflow-y-auto p-5 sm:p-7 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ember/30">
            <Image
              src="/images/archives/opportunity.png"
              alt="Artistic render of a six-wheeled rover on the plains of Mars"
              fill
              sizes="(min-width: 768px) 440px, 90vw"
              className="object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-full bg-navy/80 px-2.5 py-1 text-[9px] tracking-[0.2em] text-frost/70">
              {t('ARTISTIC RENDER')}
            </span>
          </div>
          <div>
            <h2
              id="dossier-title"
              ref={headingRef}
              tabIndex={-1}
              className="font-display text-[clamp(24px,4vw,40px)] uppercase leading-none tracking-[0.08em] text-frost outline-none"
            >
              Opportunity
            </h2>
            <p className="mt-2 text-sm italic tracking-[0.18em] text-hud">Meridiani Planum · Mars</p>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hud/20 bg-hud/15">
            {OPPORTUNITY_FACTS.map((f) => (
              <div key={f.label} className="bg-navy/85 p-3">
                <dt className="text-[9px] font-semibold uppercase tracking-[0.24em] text-hud/75">{t(f.label)}</dt>
                <dd className="mt-1 text-sm font-semibold text-frost">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-3 pt-1">
            <OrbitalCapsuleButton
              label={t('Explore Archive')}
              sound="archives"
              width="100%"
              height="50px"
              phase={0.6}
              onActivate={onExplore}
            />
            <OrbitalCapsuleButton
              label={t('Begin Investigation')}
              tone="amber"
              emphasis="primary"
              sound="start"
              width="100%"
              height="50px"
              phase={0.15}
              onActivate={onBegin}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 text-sm leading-relaxed text-frost/85">
          <DossierBlock title={t('Mission overview')} source="history">
            <p className="text-pretty">{t(OPPORTUNITY_OVERVIEW)}</p>
          </DossierBlock>

          <DossierBlock title={t('Mission objectives')} source="history">
            <ul className="flex flex-col gap-2">
              {OPPORTUNITY_OBJECTIVES.map((o) => (
                <li key={o} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-ember" />
                  <span>{t(o)}</span>
                </li>
              ))}
            </ul>
          </DossierBlock>

          <DossierBlock title={t('Rover')} source="history">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              {OPPORTUNITY_ROVER.map((r) => (
                <div key={r.label}>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-frost/50">{t(r.label)}</dt>
                  <dd className="text-frost">{t(r.value)}</dd>
                </div>
              ))}
            </dl>
          </DossierBlock>

          <DossierBlock title={t('Instruments')} source="history">
            <ul className="grid gap-2 sm:grid-cols-2">
              {OPPORTUNITY_INSTRUMENTS.map((i) => (
                <li key={i.name} className="rounded-xl border border-hud/15 bg-midnight/50 p-3">
                  <p className="font-semibold tracking-[0.06em] text-frost">{i.name}</p>
                  <p className="mt-0.5 text-xs text-frost/65">{t(i.detail)}</p>
                </li>
              ))}
            </ul>
          </DossierBlock>

          <DossierBlock title={t('Historical context')} source="history">
            <p className="text-pretty">{t(OPPORTUNITY_CONTEXT)}</p>
          </DossierBlock>

          <DossierBlock title="The Last Signal" source="fiction">
            <p className="text-pretty">
              Years after the mission ended, the fictional research station Outpost M-07 detects a faint echo on a
              frequency once used by the rover. Your investigation begins here.
            </p>
          </DossierBlock>
        </div>
      </div>
    </section>
  )
}

function DossierBlock({
  title,
  source,
  children,
}: {
  title: string
  source: 'history' | 'fiction'
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ember">{title}</h3>
        <span aria-hidden className="h-px flex-1 bg-ember/20" />
        <SourceTag kind={source} />
      </div>
      {children}
    </section>
  )
}
