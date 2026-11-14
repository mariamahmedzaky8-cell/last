'use client'

import { useCallback, useId, useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'
import { LANGUAGES } from '@/lib/i18n'
import { HoloDialog } from './holo-dialog'
import { useGameSettings } from './settings-provider'

function subscribeFullscreen(callback: () => void) {
  document.addEventListener('fullscreenchange', callback)
  return () => document.removeEventListener('fullscreenchange', callback)
}

function useFullscreen() {
  const isFullscreen = useSyncExternalStore(
    subscribeFullscreen,
    () => Boolean(document.fullscreenElement),
    () => false,
  )
  const supported = useSyncExternalStore(
    subscribeFullscreen,
    () => Boolean(document.fullscreenEnabled),
    () => false,
  )
  const toggle = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      // The browser or embedding frame refused the request; the switch reflects the real state.
    }
  }, [])
  return { isFullscreen, supported, toggle }
}

function SettingRow({
  label,
  description,
  children,
  htmlFor,
}: {
  label: string
  description: string
  children: React.ReactNode
  htmlFor?: string
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-hud/15 py-4 last:border-b-0">
      <div className="min-w-0">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="text-sm font-semibold tracking-[0.1em] text-frost">
            {label}
          </label>
        ) : (
          <p className="text-sm font-semibold tracking-[0.1em] text-frost">{label}</p>
        )}
        <p className="mt-0.5 text-xs text-frost/60">{description}</p>
      </div>
      {children}
    </div>
  )
}

function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-7 w-13 shrink-0 rounded-full border transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud',
        'disabled:cursor-not-allowed disabled:opacity-40',
        checked ? 'border-hud/80 bg-hud/20' : 'border-hud/25 bg-navy/60',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute top-1/2 size-5 -translate-y-1/2 rounded-full transition-all duration-300',
          checked
            ? 'left-[calc(100%-1.4rem)] bg-frost shadow-[0_0_10px_rgba(73,215,255,0.9)]'
            : 'left-1 bg-frost/50',
        )}
      />
    </button>
  )
}

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, update, play, t } = useGameSettings()
  const { isFullscreen, supported, toggle } = useFullscreen()
  const volumeId = useId()
  const volumePercent = Math.round(settings.volume * 100)

  return (
    <HoloDialog open={open} onClose={onClose} eyebrow={t('SYSTEM CONFIGURATION')} title={t('SETTINGS')}>
      <SettingRow label={t('Language')} description={t('Choose your preferred language.')} htmlFor="game-language">
        <select
          id="game-language"
          value={settings.language}
          onChange={(event) => update({ language: event.target.value as typeof settings.language })}
          className="max-w-[48%] rounded-lg border border-hud/35 bg-navy px-3 py-2 text-sm text-frost focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud sm:max-w-[55%]"
        >
          {LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.native}
            </option>
          ))}
        </select>
      </SettingRow>

      <SettingRow label={t('Sound effects')} description={t('Spacecraft interface audio.')}>
        <Switch
          label={t('Sound effects')}
          checked={!settings.muted}
          onChange={(on) => {
            update({ muted: !on })
            if (on) window.setTimeout(() => play('click'), 30)
          }}
        />
      </SettingRow>

      <SettingRow label={t('SFX volume')} description={`${volumePercent}%`} htmlFor={volumeId}>
        <input
          id={volumeId}
          type="range"
          min={0}
          max={100}
          step={1}
          value={volumePercent}
          disabled={settings.muted}
          onChange={(e) => update({ volume: Number(e.target.value) / 100 })}
          onPointerUp={() => play('click')}
          onKeyUp={() => play('hover')}
          className="holo-range w-36 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 sm:w-44"
          style={{ '--fill': `${volumePercent}%` } as React.CSSProperties}
        />
      </SettingRow>

      <SettingRow label={t('Reduced motion')} description={t('Pauses ambient animation and particles.')}>
        <Switch
          label={t('Reduced motion')}
          checked={settings.reducedMotion}
          onChange={(value) => {
            update({ reducedMotion: value })
            play('click')
          }}
        />
      </SettingRow>

      <SettingRow
        label={t('Fullscreen')}
        description={supported ? t('Immersive full-screen display.') : t('Unavailable in this view.')}
      >
        <Switch
          label={t('Fullscreen')}
          checked={isFullscreen}
          disabled={!supported}
          onChange={() => {
            play('click')
            void toggle()
          }}
        />
      </SettingRow>

      <p className="mt-4 text-xs text-frost/50">{t('Preferences are saved on this device.')}</p>
    </HoloDialog>
  )
}
