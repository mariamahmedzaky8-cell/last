'use client'

import Image from 'next/image'
import { useRef, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { useGameSettings } from '../settings-provider'
import type { Mission } from './archive-data'

type MissionPlatformProps = {
  mission: Mission
  primary: boolean
  delay: number
  baseRotate?: number
  calm: boolean
  className?: string
  onBegin?: () => void
}

export function MissionPlatform({ mission, primary, delay, baseRotate = 0, calm, className, onBegin }: MissionPlatformProps) {
  const { play, t } = useGameSettings()
  const cardRef = useRef<HTMLDivElement>(null)
  const [hot, setHot] = useState(false)
  const tone = hot ? '#ff9a3d' : '#49d7ff'

  const onMove = (e: React.PointerEvent) => {
    if (calm || e.pointerType !== 'mouse') return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--tx', (((e.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3))
    el.style.setProperty('--ty', (((e.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3))
  }
  const reset = () => {
    setHot(false)
    cardRef.current?.style.setProperty('--tx', '0')
    cardRef.current?.style.setProperty('--ty', '0')
  }

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      <div
        className="arc-display relative w-full"
        style={{ '--d': `${delay}s` } as CSSProperties}
      >
        <div
          ref={cardRef}
          data-hot={hot}
          data-primary={primary}
          onPointerEnter={(e) => {
            setHot(true)
            if (e.pointerType === 'mouse') play('hover')
          }}
          onPointerMove={onMove}
          onPointerLeave={reset}
          onFocusCapture={() => setHot(true)}
          onBlurCapture={reset}
          onClick={() => onBegin?.()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onBegin?.()
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`${mission.name} mission dossier`}
          className="arc-card cursor-pointer rounded-[22px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
          style={{ '--tone': tone, '--base-ry': `${baseRotate}deg` } as CSSProperties}
        >
          <article
            aria-labelledby={`mission-${mission.id}`}
            className={cn(
              'arc-glass relative flex flex-col overflow-hidden',
              primary
                ? 'h-[min(58vh,560px)] p-[clamp(14px,2.4vh,24px)]'
                : 'h-[min(46vh,440px)] p-[clamp(12px,2vh,20px)]',
            )}
          >
            <p
              className={cn(
                'text-[clamp(9px,1.3vh,12px)] font-semibold tracking-[0.3em]',
                hot ? 'text-ember' : 'text-hud/75',
              )}
            >
              {t(mission.index)}
            </p>
            <h3
              id={`mission-${mission.id}`}
              className={cn(
                'mt-1 font-display uppercase leading-none text-frost',
                primary
                  ? 'text-[clamp(22px,4.6vh,42px)] tracking-[0.08em]'
                  : 'text-[clamp(16px,3vh,26px)] tracking-[0.1em]',
                hot && '[text-shadow:0_0_24px_rgba(255,154,61,0.45)]',
              )}
            >
              {mission.name}
            </h3>
            <p
              className={cn(
                'mt-1.5 text-[clamp(10px,1.5vh,14px)] italic tracking-[0.18em]',
                hot ? 'text-ember' : 'text-frost/55',
              )}
            >
              {mission.site} · {mission.body}
            </p>

            <div className="relative mt-[clamp(8px,1.6vh,16px)] min-h-0 flex-1 overflow-hidden rounded-xl">
              <Image
                src={mission.image}
                alt={mission.imageAlt}
                fill
                sizes={primary ? '(min-width: 768px) 440px, 86vw' : '320px'}
                className={cn(
                  'object-cover transition-transform duration-[1200ms] ease-out',
                  hot && 'scale-[1.04]',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060c14] via-transparent to-transparent" />
            </div>

            {mission.blurb ? (
              <p className="mt-[clamp(8px,1.6vh,14px)] line-clamp-3 text-pretty text-[clamp(11px,1.65vh,14px)] leading-relaxed text-frost/85 [@media(max-height:640px)]:line-clamp-2">
                {t(mission.blurb)}
              </p>
            ) : (
              <div className="mt-[clamp(8px,1.6vh,14px)] flex-1" aria-hidden="true" />
            )}
            <div className="mt-[clamp(10px,1.8vh,18px)] flex justify-center">
              <span className={cn(
                'inline-flex min-h-[clamp(40px,6.4vh,54px)] w-full items-center justify-center rounded-full border px-4 text-[10px] font-semibold tracking-[0.24em] transition-[border-color,color,box-shadow,background-color] duration-500',
                hot ? 'border-amber-300/80 bg-amber-300/10 text-amber-100 shadow-[0_0_24px_rgba(255,154,61,0.32)]' : 'border-hud/40 bg-navy/50 text-frost/75',
              )}>
                {t('Open mission dossier')}
              </span>
            </div>
          </article>
          <span aria-hidden className="arc-frame" />
          <span aria-hidden className="arc-frame-sweep" />
        </div>
      </div>

      <div aria-hidden className="arc-pad relative -mt-2 h-0 w-[118%]" style={{ '--d': `${delay - 0.5}s` } as CSSProperties}>
        <span
          className="arc-pad-ring aspect-square w-full"
          style={{
            background: `radial-gradient(closest-side, ${hot ? 'rgba(255,154,61,0.28)' : 'rgba(73,215,255,0.16)'}, transparent 70%)`,
            border: `2px solid ${hot ? 'rgba(255,170,80,0.75)' : 'rgba(73,215,255,0.5)'}`,
            boxShadow: `0 0 ${hot ? 60 : 34}px ${hot ? 'rgba(255,154,61,0.7)' : 'rgba(73,215,255,0.45)'}, inset 0 0 40px ${hot ? 'rgba(255,154,61,0.4)' : 'rgba(73,215,255,0.25)'}`,
            transition: 'background 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease',
          }}
        />
        <span
          className="arc-pad-ring aspect-square w-[78%]"
          style={{ border: `1px solid ${primary ? 'rgba(255,200,140,0.5)' : 'rgba(73,215,255,0.35)'}` }}
        />
      </div>
    </div>
  )
}
