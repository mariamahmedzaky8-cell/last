'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AboutModal } from './about-modal'
import { ArchivesScreen } from './archives-screen'
import { CinematicEnvironment } from './cinematic-environment'
import { HudOverlay } from './hud-overlay'
import { InvestigationScreen } from './investigation-screen'
import { MainMenu, type MenuAction } from './main-menu'
import { SettingsModal } from './settings-modal'
import { SettingsProvider, useGameSettings } from './settings-provider'

type Screen = 'menu' | 'investigation' | 'archives'
type Modal = 'settings' | 'about' | null

const PARTICLES_AT_MS = 3700
const INTRO_DONE_MS = 4500

export function GameShell() {
  return (
    <SettingsProvider>
      <GameExperience />
    </SettingsProvider>
  )
}

function useParallax(rootRef: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (!enabled) {
      root.style.setProperty('--px', '0')
      root.style.setProperty('--py', '0')
      return
    }
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let raf = 0
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1
      target.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const tick = () => {
      current.x += (target.x - current.x) * 0.05
      current.y += (target.y - current.y) * 0.05
      root.style.setProperty('--px', current.x.toFixed(4))
      root.style.setProperty('--py', current.y.toFixed(4))
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [rootRef, enabled])
}

function GameExperience() {
  const { settings, ready, play } = useGameSettings()
  const [screen, setScreen] = useState<Screen>('menu')
  const [modal, setModal] = useState<Modal>(null)
  const [intro, setIntro] = useState<'playing' | 'complete'>('playing')
  const [particlesActive, setParticlesActive] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useParallax(rootRef, !settings.reducedMotion)

  const finishIntro = useCallback(() => {
    setIntro('complete')
    setParticlesActive(true)
  }, [])

  useEffect(() => {
    const particles = window.setTimeout(() => setParticlesActive(true), PARTICLES_AT_MS)
    const done = window.setTimeout(() => setIntro('complete'), INTRO_DONE_MS)
    return () => {
      window.clearTimeout(particles)
      window.clearTimeout(done)
    }
  }, [])

  useEffect(() => {
    if (ready && settings.reducedMotion) finishIntro()
  }, [ready, settings.reducedMotion, finishIntro])

  const goToMenu = useCallback(() => setScreen('menu'), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || modal) return
      if (intro === 'playing') {
        finishIntro()
        return
      }
      if (screen === 'investigation') {
        play('back')
        goToMenu()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [screen, modal, intro, finishIntro, goToMenu, play])

  const handleSelect = (action: MenuAction) => {
    if (action === 'start') setScreen('investigation')
    else if (action === 'archives') setScreen('archives')
    else setModal(action)
  }

  const closeModal = () => {
    play('back')
    setModal(null)
  }

  return (
    <div ref={rootRef} data-intro={intro} className="relative min-h-dvh w-full overflow-x-hidden bg-navy">
      <CinematicEnvironment reducedMotion={settings.reducedMotion} />

      <main className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-start overflow-x-hidden px-3 pt-[max(56px,8.5vh)] pb-24 sm:justify-center sm:px-5 sm:pb-[14vh] sm:pt-0">
        {screen === 'menu' && <MainMenu particlesActive={particlesActive} onSelect={handleSelect} />}
        {screen === 'investigation' && <InvestigationScreen key="investigation" onBack={goToMenu} />}
      </main>

      <HudOverlay />

      {screen === 'archives' && (
        <ArchivesScreen
          key="archives"
          onBack={goToMenu}
          onBeginInvestigation={() => setScreen('investigation')}
        />
      )}

      {intro === 'playing' && (
        <button
          type="button"
          onClick={finishIntro}
          className="intro-el absolute bottom-20 left-1/2 z-30 -translate-x-1/2 rounded-full border border-hud/40 bg-navy/60 px-5 py-2 text-[11px] font-semibold tracking-[0.3em] text-frost/85 backdrop-blur-sm transition-colors hover:border-hud hover:text-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud sm:bottom-10"
          style={{ '--intro-anim': 'intro-fade', '--intro-delay': '0.4s' } as React.CSSProperties}
        >
          SKIP INTRO
        </button>
      )}

      <SettingsModal open={modal === 'settings'} onClose={closeModal} />
      <AboutModal open={modal === 'about'} onClose={closeModal} />
    </div>
  )
}
