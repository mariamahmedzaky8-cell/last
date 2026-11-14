'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Activity, Images, Map as MapIcon, NotebookPen, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGameSettings } from '../settings-provider'
import {
  MEDIA,
  OPPORTUNITY_INSTRUMENTS,
  OPPORTUNITY_OBJECTIVES,
  SIGNAL_LOGS,
  TRAVERSE,
  TRAVERSE_DISTANCE,
} from './archive-data'
import { BackChip, SourceTag } from './archive-ui'

export type SectionId = 'media' | 'signals' | 'notes' | 'traverse'

const SECTIONS: { id: SectionId; label: string; desc: string; icon: LucideIcon }[] = [
  { id: 'media', label: 'Mission Media', desc: 'Imagery, panoramas, captions', icon: Images },
  { id: 'signals', label: 'Signal Logs', desc: 'Communications timeline', icon: Activity },
  { id: 'notes', label: 'Field Notes', desc: 'Instruments and observations', icon: NotebookPen },
  { id: 'traverse', label: 'Traverse Data', desc: 'Route and work sites', icon: MapIcon },
]

type ScientificArchiveProps = {
  section: SectionId | null
  onSection: (s: SectionId | null) => void
  onBack: () => void
}

export function ScientificArchive({ section, onSection, onBack }: ScientificArchiveProps) {
  const { play, t } = useGameSettings()
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [section])

  const current = SECTIONS.find((s) => s.id === section)

  return (
    <section
      aria-labelledby="sci-title"
      className="arc-panel-in arc-glass relative mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden"
      style={{ '--tone': '#49d7ff' } as React.CSSProperties}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-hud/20 px-5 py-3 sm:px-7">
        <BackChip label={t(section ? 'Archive index' : 'Dossier')} onClick={() => (section ? onSection(null) : onBack())} />
        <h2
          id="sci-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-[10px] font-semibold tracking-[0.32em] text-hud uppercase outline-none"
        >
          Opportunity · {current ? t(current.label) : t('Scientific archive')}
        </h2>
      </header>

      {section && (
        <nav aria-label={t('Archive sections')} className="arc-scroll flex gap-2 overflow-x-auto border-b border-hud/10 px-5 py-2.5 sm:px-7">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-current={s.id === section ? 'page' : undefined}
              onClick={() => {
                play('click')
                onSection(s.id)
              }}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud',
                s.id === section
                  ? 'border-hud/80 bg-hud/15 text-frost'
                  : 'border-hud/20 text-frost/65 hover:border-hud/50 hover:text-frost',
              )}
            >
              <s.icon aria-hidden className="size-3.5" />
              {t(s.label)}
            </button>
          ))}
        </nav>
      )}

      <div key={section ?? 'hub'} className="arc-swap arc-scroll min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
        {!section && (
          <ul className="grid h-full gap-4 sm:grid-cols-2">
            {SECTIONS.map((s, i) => (
              <li key={s.id} className="arc-rise" style={{ '--d': `${0.08 * i}s` } as React.CSSProperties}>
                <button
                  type="button"
                  onPointerEnter={(e) => e.pointerType === 'mouse' && play('hover')}
                  onClick={() => {
                    play('archives')
                    onSection(s.id)
                  }}
                  className="group relative flex h-full min-h-32 w-full flex-col justify-between overflow-hidden rounded-2xl border border-hud/25 bg-midnight/50 p-5 text-left transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-0.5 hover:border-hud/70 hover:shadow-[0_0_30px_rgba(73,215,255,0.22)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud"
                >
                  <span aria-hidden className="absolute -right-10 -top-10 size-36 rounded-full bg-hud/10 blur-2xl transition-opacity duration-500 group-hover:bg-hud/20" />
                  <s.icon aria-hidden className="size-6 text-hud" />
                  <span className="mt-6">
                    <span className="block font-display text-lg tracking-[0.08em] text-frost">{t(s.label)}</span>
                    <span className="mt-1 block text-xs tracking-[0.12em] text-frost/60">{t(s.desc)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {section === 'media' && <MediaSection />}
        {section === 'signals' && <SignalSection />}
        {section === 'notes' && <NotesSection />}
        {section === 'traverse' && <TraverseSection />}
      </div>
    </section>
  )
}

function Unavailable({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-frost/20 px-4 py-3 text-xs leading-relaxed text-frost/55">{children}</p>
  )
}

function MediaSection() {
  const { t } = useGameSettings()
  const [index, setIndex] = useState(0)
  const item = MEDIA[index]
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <figure className="flex flex-col gap-3">
        <div key={item.src} className="arc-swap relative aspect-video overflow-hidden rounded-2xl border border-hud/25">
          <Image src={item.src} alt={t(item.caption)} fill sizes="(min-width: 1024px) 700px, 90vw" className="object-cover" />
        </div>
        <figcaption className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold tracking-[0.06em] text-frost">{t(item.title)}</span>
            <SourceTag kind={item.credit.startsWith('Artistic') ? 'render' : 'fiction'} />
          </div>
          <span className="text-sm text-frost/70">{t(item.caption)}</span>
          <span className="text-xs text-frost/45">{t(item.credit)}</span>
        </figcaption>
      </figure>
      <div className="flex flex-col gap-3">
        <ul className="grid grid-cols-3 gap-2 lg:grid-cols-1" aria-label="Media items">
          {MEDIA.map((m, i) => (
            <li key={m.src}>
              <button
                type="button"
                aria-pressed={i === index}
                aria-label={m.title}
                onClick={() => setIndex(i)}
                className={cn(
                  'relative block aspect-video w-full overflow-hidden rounded-xl border transition-[border-color,opacity] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud',
                  i === index ? 'border-hud' : 'border-hud/15 opacity-60 hover:opacity-100',
                )}
              >
                <Image src={m.src} alt="" fill sizes="200px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
        <Unavailable>
          Original NASA/JPL photographs and panoramas are not bundled in this build. Images shown are artistic
          renders or fictional environment art.
        </Unavailable>
      </div>
    </div>
  )
}

function SignalSection() {
  const { t } = useGameSettings()
  const [id, setId] = useState(SIGNAL_LOGS[0].id)
  const log = SIGNAL_LOGS.find((l) => l.id === id) ?? SIGNAL_LOGS[0]
  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <ol className="relative flex flex-col gap-1 border-l border-hud/25 pl-4" aria-label={t('Signal records')}>
        {SIGNAL_LOGS.map((l) => (
          <li key={l.id}>
            <button
              type="button"
              aria-pressed={l.id === id}
              onClick={() => setId(l.id)}
              className={cn(
                'relative w-full rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-hud',
                l.id === id ? 'bg-hud/10' : 'hover:bg-hud/5',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'absolute -left-[21px] top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 border-navy',
                  l.kind === 'fiction' ? 'bg-ember' : 'bg-hud',
                  l.id === id && 'shadow-[0_0_10px_currentColor]',
                )}
              />
              <span className="block font-mono text-[10px] tracking-[0.18em] text-frost/50">{l.stamp}</span>
              <span className="block text-sm font-semibold text-frost">{t(l.title)}</span>
            </button>
          </li>
        ))}
      </ol>
      <article key={log.id} aria-live="polite" className="arc-swap flex flex-col gap-3 rounded-2xl border border-hud/20 bg-midnight/50 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs tracking-[0.18em] text-hud">{log.stamp}</span>
          <SourceTag kind={log.kind} />
        </div>
        <h3 className="font-display text-xl tracking-[0.06em] text-frost">{t(log.title)}</h3>
        <p className="text-sm leading-relaxed text-frost/80">{t(log.body)}</p>
        <div aria-hidden className="mt-auto flex h-10 items-end gap-[3px] pt-4">
          {Array.from({ length: 40 }, (_, i) => (
            <span
              key={i}
              className={cn('arc-bar w-full rounded-full', log.kind === 'fiction' ? 'bg-ember/50' : 'bg-hud/40')}
              style={{ height: `${30 + ((i * 37) % 70)}%`, '--t': `${0.9 + (i % 5) * 0.2}s`, '--delay': `${-i * 0.07}s` } as React.CSSProperties}
            />
          ))}
        </div>
        <p className="text-[11px] text-frost/45">
          {t('Waveform is decorative. Original transmission data and audio are not included.')}
        </p>
      </article>
    </div>
  )
}

function NotesSection() {
  const { t } = useGameSettings()
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-hud">{t('Key observation')}</h3>
          <SourceTag kind="history" />
        </div>
        <p className="max-w-3xl text-pretty text-sm leading-relaxed text-frost/80">
          {t('Near its landing site, Opportunity found small hematite-rich spherules, nicknamed “blueberries,” embedded in layered sedimentary rock. Together with other mineral evidence, they indicated that liquid water was once present at Meridiani Planum.')}
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-hud">{t('Instrument suite')}</h3>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OPPORTUNITY_INSTRUMENTS.map((i) => (
            <li key={i.name} className="rounded-xl border border-hud/15 bg-midnight/50 p-4">
              <p className="font-semibold text-frost">{i.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-frost/65">{t(i.detail)}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-hud">{t('Research goals')}</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {OPPORTUNITY_OBJECTIVES.map((o) => (
            <li key={o} className="flex gap-3 text-sm text-frost/80">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-hud" />
              {t(o)}
            </li>
          ))}
        </ul>
      </section>
      <Unavailable>{t('Raw instrument readings and spectra are not included in this build.')}</Unavailable>
    </div>
  )
}

const ROUTE = [
  { x: 40, y: 40 },
  { x: 70, y: 62 },
  { x: 110, y: 90 },
  { x: 175, y: 128 },
  { x: 300, y: 188 },
  { x: 318, y: 222 },
]

function TraverseSection() {
  const { t } = useGameSettings()
  const [active, setActive] = useState(0)
  const stop = TRAVERSE[active]
  const d = ROUTE.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ')
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-2">
        <div className="relative overflow-hidden rounded-2xl border border-hud/25 bg-[radial-gradient(circle_at_30%_30%,rgba(255,154,61,0.12),transparent_60%),#0a1420]">
          <svg viewBox="0 0 360 260" className="block w-full" role="group" aria-label={t('Schematic traverse route')}>
            <defs>
              <pattern id="arc-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(73,215,255,0.08)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="360" height="260" fill="url(#arc-grid)" />
            <path d={d} fill="none" stroke="rgba(242,179,93,0.25)" strokeWidth="6" strokeLinecap="round" />
            <path d={d} fill="none" stroke="#f2b35d" strokeWidth="1.6" strokeDasharray="4 4" />
            {ROUTE.map((p, i) => (
              <g
                key={i}
                role="button"
                tabIndex={0}
                aria-label={t(TRAVERSE[i].site)}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setActive(i))}
                className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-frost"
              >
                <circle cx={p.x} cy={p.y} r={i === active ? 9 : 6} fill="rgba(73,215,255,0.15)" stroke="#49d7ff" strokeWidth="1.2" />
                <circle cx={p.x} cy={p.y} r="2.5" fill={i === active ? '#fff3de' : '#49d7ff'} />
                <text x={p.x + 12} y={p.y + 4} fill="rgba(234,244,255,0.75)" fontSize="9" letterSpacing="1">
                  {t(TRAVERSE[i].site)}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <p className="text-[11px] text-frost/45">{t('Schematic only. Not to scale and not based on orbital mapping data.')}</p>
      </div>
      <div className="flex flex-col gap-4">
        <article key={active} aria-live="polite" className="arc-swap rounded-2xl border border-hud/20 bg-midnight/50 p-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-[0.18em] text-ember">{stop.year}</span>
            <SourceTag kind="history" />
          </div>
          <h3 className="mt-2 font-display text-xl tracking-[0.06em] text-frost">{t(stop.site)}</h3>
          <p className="mt-2 text-sm leading-relaxed text-frost/80">{t(stop.note)}</p>
        </article>
        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-hud/15 bg-midnight/40 p-3">
            <dt className="text-[9px] uppercase tracking-[0.24em] text-hud/75">{t('Total distance')}</dt>
            <dd className="mt-1 text-sm font-semibold text-frost">{TRAVERSE_DISTANCE}</dd>
          </div>
          <div className="rounded-xl border border-hud/15 bg-midnight/40 p-3">
            <dt className="text-[9px] uppercase tracking-[0.24em] text-hud/75">{t('Region')}</dt>
            <dd className="mt-1 text-sm font-semibold text-frost">Meridiani Planum</dd>
          </div>
        </dl>
        <ol className="flex flex-col gap-1">
          {TRAVERSE.map((t, i) => (
            <li key={t.site}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-hud',
                  i === active ? 'bg-hud/10 text-frost' : 'text-frost/60 hover:text-frost',
                )}
              >
                <span>{t.site}</span>
                <span className="font-mono text-frost/45">{t.year}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
