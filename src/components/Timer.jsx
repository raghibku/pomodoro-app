import { useEffect, useState } from 'react'
import SettingsPanel from './SettingsPanel'

const DEFAULT_WORK_MINUTES = 25
const DEFAULT_BREAK_MINUTES = 5

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
  const [workMinutes, setWorkMinutes] = useState(DEFAULT_WORK_MINUTES)
  const [breakMinutes, setBreakMinutes] = useState(DEFAULT_BREAK_MINUTES)
  const [mode, setMode] = useState('work')
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_WORK_MINUTES * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)

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
    <div className="flex flex-col items-center gap-6">
      <span
        className={`rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wide ${
          isBreak ? 'bg-sky-600' : 'bg-emerald-600'
        }`}
      >
        {isBreak ? 'Break' : 'Work'}
      </span>
      <span className="text-7xl font-mono font-semibold tabular-nums">
        {formatTime(secondsLeft)}
      </span>
      <div className="flex gap-3">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="rounded-md bg-emerald-600 px-4 py-2 font-medium disabled:opacity-40"
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
