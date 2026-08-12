import { useEffect, useState } from 'react'
import SettingsPanel from './SettingsPanel'

const DEFAULT_WORK_MINUTES = 25
const DEFAULT_BREAK_MINUTES = 5
const STORAGE_KEY = 'pomodoro-state'

function readStoredState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function playBeep() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return

  const context = new AudioContextClass()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.frequency.value = 880
  gain.gain.value = 0.2
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.2)
  oscillator.onended = () => context.close()
}

function notifySessionEnd(endedMode) {
  const title = endedMode === 'work' ? 'Work session complete' : 'Break complete'

  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification(title)
  } else {
    playBeep()
  }
}

function Timer() {
  const [workMinutes, setWorkMinutes] = useState(
    () => readStoredState().workMinutes ?? DEFAULT_WORK_MINUTES,
  )
  const [breakMinutes, setBreakMinutes] = useState(
    () => readStoredState().breakMinutes ?? DEFAULT_BREAK_MINUTES,
  )
  const [mode, setMode] = useState('work')
  const [secondsLeft, setSecondsLeft] = useState(() => workMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(
    () => readStoredState().sessionsCompleted ?? 0,
  )

  useEffect(() => {
    const state = { workMinutes, breakMinutes, sessionsCompleted }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // localStorage may be unavailable (e.g. private browsing) - persistence is best-effort
    }
  }, [workMinutes, breakMinutes, sessionsCompleted])

  useEffect(() => {
    if (!isRunning) return

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isRunning])

  // `mode` deliberately excluded from deps: secondsLeft already changes every
  // tick, which keeps this closure's `mode` fresh without re-running on a
  // mode-only change (that would double-fire and skip the break segment).
  useEffect(() => {
    if (secondsLeft !== 0 || !isRunning) return
    if (mode === 'work') {
      setSessionsCompleted((count) => count + 1)
    }
    notifySessionEnd(mode)
    setMode((prevMode) => (prevMode === 'work' ? 'break' : 'work'))
  }, [secondsLeft, isRunning])

  useEffect(() => {
    setSecondsLeft(mode === 'work' ? workMinutes * 60 : breakMinutes * 60)
  }, [mode, workMinutes, breakMinutes])

  function handleWorkMinutesChange(minutes) {
    if (!Number.isFinite(minutes) || minutes < 1) return
    setWorkMinutes(minutes)
  }

  function handleBreakMinutesChange(minutes) {
    if (!Number.isFinite(minutes) || minutes < 1) return
    setBreakMinutes(minutes)
  }

  function handleStart() {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    setIsRunning(true)
  }

  function handlePause() {
    setIsRunning(false)
  }

  function handleReset() {
    setIsRunning(false)
    setMode('work')
    setSecondsLeft(workMinutes * 60)
  }

  const isBreak = mode === 'break'

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10 text-slate-100 transition-colors duration-700 sm:gap-8 ${
        isBreak
          ? 'bg-linear-to-b from-sky-950 to-slate-900'
          : 'bg-linear-to-b from-emerald-950 to-slate-900'
      }`}
    >
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pomodoro</h1>
      <span
        className={`rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wide transition-colors duration-700 ${
          isBreak ? 'bg-sky-600' : 'bg-emerald-600'
        }`}
      >
        {isBreak ? 'Break' : 'Work'}
      </span>
      <span className="font-mono text-6xl font-semibold tabular-nums sm:text-7xl md:text-8xl">
        {formatTime(secondsLeft)}
      </span>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className={`rounded-md px-4 py-2 font-medium transition-colors disabled:opacity-40 ${
            isBreak ? 'bg-sky-600' : 'bg-emerald-600'
          }`}
        >
          Start
        </button>
        <button
          onClick={handlePause}
          disabled={!isRunning}
          className="rounded-md bg-amber-600 px-4 py-2 font-medium disabled:opacity-40"
        >
          Pause
        </button>
        <button
          onClick={handleReset}
          className="rounded-md bg-slate-600 px-4 py-2 font-medium"
        >
          Reset
        </button>
      </div>
      <p className="text-sm text-slate-400">
        Sessions completed: {sessionsCompleted}
      </p>
      <SettingsPanel
        workMinutes={workMinutes}
        breakMinutes={breakMinutes}
        onWorkMinutesChange={handleWorkMinutesChange}
        onBreakMinutesChange={handleBreakMinutesChange}
        disabled={isRunning}
      />
    </div>
  )
}

export default Timer
