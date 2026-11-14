'use client'

import Image from 'next/image'
import { useRef, useState, type CSSProperties } from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OrbitalCapsuleButton } from '../orbital-capsule-button'
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
  const tone = primary ? '#ff9a3d' : '#49d7ff'

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
          className="arc-card"
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
                primary ? 'text-ember' : 'text-frost/60',
              )}
            >
              {t(mission.index)}
            </p>
            <h3
              id={`mission-${mission.id}`}
              className={cn(
                'mt-1 font-display uppercase leading-none text-frost',
                primary
                  ? 'text-[clamp(22px,4.6vh,42px)] tracking-[0.08em] [text-shadow:0_0_24px_rgba(255,154,61,0.35)]'
                  : 'text-[clamp(16px,3vh,26px)] tracking-[0.1em]',
              )}
            >
              {mission.name}
            </h3>
            <p
              className={cn(
                'mt-1.5 text-[clamp(10px,1.5vh,14px)] italic tracking-[0.18em]',
                primary ? 'text-hud' : 'text-frost/50',
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
                  !primary && 'grayscale-[0.5] saturate-[0.7]',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060c14] via-transparent to-transparent" />
            </div>

            {primary ? (
              <>
                <p className="mt-[clamp(8px,1.6vh,14px)] line-clamp-3 text-pretty text-[clamp(11px,1.65vh,14px)] leading-relaxed text-frost/85 [@media(max-height:640px)]:line-clamp-2">
                  {t(mission.blurb ?? '')}
                </p>
                <div className="mt-[clamp(10px,1.8vh,18px)] flex justify-center">
                  <OrbitalCapsuleButton
                    label={t('Begin Mission')}
                    tone="amber"
                    emphasis="primary"
                    sound="start"
                    width="min(100%, 340px)"
                    height="clamp(40px, 6.4vh, 54px)"
                    phase={0.1}
                    onActivate={() => onBegin?.()}
                  />
                </div>
              </>
            ) : (
              <div className="mt-[clamp(10px,2vh,18px)] flex flex-col items-center gap-2">
                <div className="flex w-full items-center gap-3">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-hud/40" />
                  <span className="flex size-8 items-center justify-center rounded-full border border-hud/40 bg-navy/60">
                    <Lock aria-hidden className="size-3.5 text-frost/80" />
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-hud/40" />
                </div>
                <p className="text-[clamp(9px,1.3vh,11px)] font-semibold tracking-[0.34em] text-frost/70">
                  {t('COMING SOON')}
                </p>
              </div>
            )}
          </article>
          <span aria-hidden className="arc-frame" />
          <span aria-hidden className="arc-frame-sweep" />
        </div>
      </div>

      <div aria-hidden className="arc-pad relative -mt-2 h-0 w-[118%]" style={{ '--d': `${delay - 0.5}s` } as CSSProperties}>
        <span
          className="arc-pad-ring aspect-square w-full"
          style={{
            background: `radial-gradient(closest-side, ${primary ? 'rgba(255,154,61,0.28)' : 'rgba(73,215,255,0.16)'}, transparent 70%)`,
            border: `2px solid ${primary ? 'rgba(255,170,80,0.75)' : 'rgba(73,215,255,0.5)'}`,
            boxShadow: `0 0 ${hot ? 60 : 34}px ${primary ? 'rgba(255,154,61,0.7)' : 'rgba(73,215,255,0.45)'}, inset 0 0 40px ${primary ? 'rgba(255,154,61,0.4)' : 'rgba(73,215,255,0.25)'}`,
            transition: 'box-shadow 0.6s ease',
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
