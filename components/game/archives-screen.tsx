'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OrbitalCapsuleButton } from './orbital-capsule-button'
import { useGameSettings } from './settings-provider'
import { ArchiveEnvironment } from './archives/archive-environment'
import { MISSIONS } from './archives/archive-data'
import { MissionDossier } from './archives/mission-dossier'
import { MissionPlatform } from './archives/mission-platform'
import { ScientificArchive, type SectionId } from './archives/scientific-archive'
import './archives/archives.css'

type View = 'select' | 'dossier' | 'archive'

const INTRO_MS = 4600
const FOCUS_MS = 950

type ArchivesScreenProps = {
  onBack: () => void
  onBeginInvestigation: () => void
}

export function ArchivesScreen({ onBack, onBeginInvestigation }: ArchivesScreenProps) {
  const { settings, play, t } = useGameSettings()
  const calm = settings.reducedMotion
  const [intro, setIntro] = useState(!calm)
  const [view, setView] = useState<View>('select')
  const [focus, setFocus] = useState(false)
  const [section, setSection] = useState<SectionId | null>(null)
  const [selectedMissionId, setSelectedMissionId] = useState<(typeof MISSIONS)[number]['id']>('opportunity')
  const [mobileIndex, setMobileIndex] = useState(1)
  const focusTimer = useRef<number>(0)

  useEffect(() => {
    if (!intro) return
    const t = window.setTimeout(() => setIntro(false), INTRO_MS)
    return () => window.clearTimeout(t)
  }, [intro])

  useEffect(() => () => window.clearTimeout(focusTimer.current), [])

  const openDossier = useCallback(() => {
    setFocus(true)
    window.clearTimeout(focusTimer.current)
    focusTimer.current = window.setTimeout(() => setView('dossier'), calm ? 0 : FOCUS_MS)
  }, [calm])

  const backToSelect = useCallback(() => {
    setView('select')
    setFocus(false)
  }, [])

  const goBack = useCallback(() => {
    if (view === 'archive') {
      if (section) setSection(null)
      else setView('dossier')
    } else if (view === 'dossier') backToSelect()
    else onBack()
  }, [view, section, backToSelect, onBack])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return
      if (intro) {
        setIntro(false)
        return
      }
      play('back')
      goBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [intro, goBack, play])

  const skip = !intro
  const overlay = view !== 'select'

  return (
    <div
      className="arc absolute inset-0 z-40 overflow-hidden bg-[#04080e]"
      data-skip={skip || calm}
      data-focus={focus}
      data-view={view}
      aria-label={t('Mission Archives')}
      role="region"
    >
      <div className="arc-camera absolute inset-0">
        <div className="arc-camera-focus absolute inset-0">
          <ArchiveEnvironment calm={calm} />

          <div
            className={cn('relative flex h-full flex-col', overlay && 'pointer-events-none')}
            aria-hidden={overlay || undefined}
            inert={overlay || undefined}
          >
            <ArchiveTopBar />

            <header className="flex flex-col items-center px-4 pt-[clamp(4px,1.5vh,16px)] text-center">
              <h1 className="arc-title font-display text-[clamp(20px,5.2vh,58px)] uppercase leading-none text-frost [text-shadow:0_0_30px_rgba(255,154,61,0.35)]">
                {t('Mission Archives')}
              </h1>
              <div className="mt-[clamp(6px,1.4vh,14px)] flex w-full max-w-3xl items-center gap-4">
                <span className="arc-line h-px flex-1 origin-right bg-gradient-to-l from-hud/70 to-transparent" />
                <p className="arc-rise text-[clamp(8px,1.35vh,12px)] font-semibold tracking-[0.3em] text-hud uppercase" style={{ '--d': '3.4s' } as React.CSSProperties}>
                  {t('Explore recorded missions, findings, and final transmissions')}
                </p>
                <span className="arc-line h-px flex-1 origin-left bg-gradient-to-r from-hud/70 to-transparent" />
              </div>
            </header>

            <div className="arc-stage relative flex min-h-0 flex-1 items-center justify-center gap-[clamp(16px,3vw,56px)] px-4 pb-[clamp(20px,5vh,56px)]">
              {MISSIONS.map((m, i) => {
                const primary = !m.locked
                const rotate = i === 0 ? 14 : i === 2 ? -14 : 0
                return (
                  <MissionPlatform
                    key={m.id}
                    mission={m}
                    primary={primary}
                    calm={calm}
                    delay={primary ? 2.3 : i === 0 ? 2.7 : 3}
                    baseRotate={rotate}
                    onBegin={() => {
                      play('archives')
                      setSelectedMissionId(m.id)
                      openDossier()
                    }}
                    className={cn(
                      primary ? 'w-[min(86vw,360px)] md:w-[min(34vw,46vh,440px)]' : 'w-[min(86vw,340px)] md:w-[min(22vw,36vh,300px)]',
                      i === mobileIndex ? 'flex' : 'hidden',
                      'md:flex',
                    )}
                  />
                )
              })}
            </div>

            <MobileSwitcher index={mobileIndex} onChange={setMobileIndex} />
            <ArchiveBottomBar onBack={onBack} />
          </div>
        </div>
      </div>

      {overlay && (
        <div className="absolute inset-0 z-20 flex p-3 sm:p-6 lg:p-10">
          {view === 'dossier' && (
            <MissionDossier
              missionId={selectedMissionId}
              onBack={backToSelect}
              onExplore={() => setView('archive')}
              onBegin={onBeginInvestigation}
            />
          )}
          {view === 'archive' && (
            <ScientificArchive section={section} onSection={setSection} onBack={() => setView('dossier')} />
          )}
        </div>
      )}

      <div aria-hidden className="arc-blackout pointer-events-none absolute inset-0 z-30 bg-[#04080e]" />

      {intro && !calm && (
        <button
          type="button"
          onClick={() => setIntro(false)}
          className="arc-rise absolute bottom-[clamp(80px,14vh,120px)] right-5 z-40 rounded-full border border-hud/40 bg-navy/70 px-5 py-2 text-[11px] font-semibold tracking-[0.3em] text-frost/85 backdrop-blur-sm transition-colors hover:border-hud hover:text-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud"
          style={{ '--d': '0.3s' } as React.CSSProperties}
        >
          SKIP INTRO
        </button>
      )}
    </div>
  )
}

function ArchiveTopBar() {
  const { t } = useGameSettings()
  return (
    <div className="arc-rise flex items-start justify-between px-[clamp(14px,2.5vw,36px)] pt-[clamp(10px,2.4vh,26px)]" style={{ '--d': '3.6s' } as React.CSSProperties}>
      <div className="border-l border-t border-hud/40 pl-3 pt-2">
        <p className="text-[clamp(9px,1.4vh,13px)] font-semibold tracking-[0.3em] text-frost">{t('MARS INVESTIGATION · ONLINE')}</p>
      </div>
      <div className="hidden flex-col items-center md:flex">
        <p className="text-[9px] tracking-[0.5em] text-frost/60">THE</p>
        <p className="font-display text-[clamp(12px,2.2vh,20px)] tracking-[0.18em] text-frost">LAST SIGNAL</p>
      </div>
      <div className="flex flex-col items-end border-r border-t border-hud/40 pr-3 pt-2">
        <div aria-hidden className="flex h-3 items-end gap-[2px]">
          {Array.from({ length: 18 }, (_, i) => (
            <span
              key={i}
              className="arc-bar h-full w-[2px] bg-hud/70"
              style={{ '--t': `${0.8 + (i % 4) * 0.3}s`, '--delay': `${-i * 0.11}s` } as React.CSSProperties}
            />
          ))}
        </div>
        <p className="mt-1.5 text-[9px] tracking-[0.3em] text-hud">{t('SIGNAL LOCK · SIMULATED')}</p>
      </div>
    </div>
  )
}

function MobileSwitcher({ index, onChange }: { index: number; onChange: (i: number) => void }) {
  const { play, t } = useGameSettings()
  const go = (dir: number) => {
    play('click')
    onChange((index + dir + MISSIONS.length) % MISSIONS.length)
  }
  return (
    <div className="arc-rise -mt-6 mb-3 flex items-center justify-center gap-3 md:hidden" style={{ '--d': '3.5s' } as React.CSSProperties}>
      <button type="button" aria-label={t('Previous mission')} onClick={() => go(-1)} className="flex size-9 items-center justify-center rounded-full border border-hud/40 bg-navy/60 text-frost focus-visible:outline-2 focus-visible:outline-hud">
        <ChevronLeft aria-hidden className="size-4" />
      </button>
      <div className="flex gap-2" role="tablist" aria-label={t('Missions')}>
        {MISSIONS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={m.name}
            onClick={() => onChange(i)}
            className={cn('h-1.5 rounded-full transition-all', i === index ? 'w-6 bg-ember' : 'w-2.5 bg-frost/30')}
          />
        ))}
      </div>
      <button type="button" aria-label={t('Next mission')} onClick={() => go(1)} className="flex size-9 items-center justify-center rounded-full border border-hud/40 bg-navy/60 text-frost focus-visible:outline-2 focus-visible:outline-hud">
        <ChevronRight aria-hidden className="size-4" />
      </button>
    </div>
  )
}

function ArchiveBottomBar({ onBack }: { onBack: () => void }) {
  const { t } = useGameSettings()
  return (
    <div
      className="arc-rise mx-[clamp(10px,1.6vw,28px)] mb-[clamp(10px,2vh,24px)] flex items-center justify-between gap-4 rounded-sm border border-hud/30 bg-[#060c14]/75 px-[clamp(12px,2.5vw,40px)] py-[clamp(8px,1.4vh,14px)] backdrop-blur-md"
      style={{ '--d': '3.7s' } as React.CSSProperties}
    >
      <div className="hidden min-w-0 items-center gap-4 sm:flex">
        <Database aria-hidden className="size-6 shrink-0 text-hud" />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-frost">{t('ARCHIVE VAULT')}</p>
          <p className="truncate text-[9px] tracking-[0.24em] text-hud/80">{t('RECORDED MISSIONS · SCIENTIFIC DATA · FIELD LOGS')}</p>
        </div>
      </div>
      <OrbitalCapsuleButton
        label={t('Back to Main Menu')}
        sound="back"
        width="min(80vw, 320px)"
        height="clamp(40px, 6vh, 50px)"
        phase={0.55}
        onActivate={onBack}
        className="mx-auto sm:mx-0"
      />
      <div className="hidden items-center gap-4 sm:flex">
        <div aria-hidden className="flex h-6 items-center gap-[3px]">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className="arc-bar w-[2px] bg-hud/80" style={{ height: `${40 + ((i * 29) % 60)}%`, '--t': `${0.9 + (i % 3) * 0.25}s`, '--delay': `${-i * 0.13}s` } as React.CSSProperties} />
          ))}
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-frost">{t('ARCHIVE STATUS')}</p>
          <p className="text-[9px] tracking-[0.24em] text-hud/80">{t('3 / 3 AVAILABLE')}</p>
        </div>
      </div>
    </div>
  )
}
