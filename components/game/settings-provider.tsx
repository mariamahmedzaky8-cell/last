'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { audio, type SoundName } from '@/lib/audio'
import { translate, type Language } from '@/lib/i18n'

export type GameSettings = {
  muted: boolean
  volume: number
  reducedMotion: boolean
  language: Language
}

const STORAGE_KEY = 'last-signal:settings:v1'
const DEFAULTS: GameSettings = { muted: false, volume: 0.7, reducedMotion: false, language: 'en' }
const LANGUAGES: Language[] = ['en', 'ar', 'de', 'ru', 'it', 'es', 'fr']

type SettingsContextValue = {
  settings: GameSettings
  ready: boolean
  update: (patch: Partial<GameSettings>) => void
  play: (name: SoundName) => void
  t: (text: string) => string
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function sanitize(raw: unknown): Partial<GameSettings> {
  if (!raw || typeof raw !== 'object') return {}
  const value = raw as Record<string, unknown>
  const result: Partial<GameSettings> = {}
  if (typeof value.muted === 'boolean') result.muted = value.muted
  if (typeof value.volume === 'number' && Number.isFinite(value.volume)) {
    result.volume = Math.min(1, Math.max(0, value.volume))
  }
  if (typeof value.reducedMotion === 'boolean') result.reducedMotion = value.reducedMotion
  if (typeof value.language === 'string' && LANGUAGES.includes(value.language as Language)) {
    result.language = value.language as Language
  }
  return result
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(DEFAULTS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let stored: Partial<GameSettings> = {}
    try {
      stored = sanitize(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null'))
    } catch {
      stored = {}
    }
    const systemReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setSettings({ ...DEFAULTS, reducedMotion: systemReduced, ...stored })
    setReady(true)
  }, [])

  useEffect(() => {
    audio.setMuted(settings.muted)
    audio.setVolume(settings.volume)
    document.documentElement.dataset.reducedMotion = String(settings.reducedMotion)
    document.documentElement.lang = settings.language
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr'
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Storage can be unavailable (private mode); preferences then last for the session only.
    }
  }, [settings, ready])

  useEffect(() => {
    const unlock = () => audio.unlock()
    const opts = { capture: true, passive: true } as const
    window.addEventListener('pointerdown', unlock, opts)
    window.addEventListener('keydown', unlock, opts)
    return () => {
      window.removeEventListener('pointerdown', unlock, opts)
      window.removeEventListener('keydown', unlock, opts)
    }
  }, [])

  const update = useCallback((patch: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const play = useCallback((name: SoundName) => audio.play(name), [])

  const t = useCallback((text: string) => translate(settings.language, text), [settings.language])
  const value = useMemo(() => ({ settings, ready, update, play, t }), [settings, ready, update, play, t])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useGameSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useGameSettings must be used inside <SettingsProvider>')
  return ctx
}
