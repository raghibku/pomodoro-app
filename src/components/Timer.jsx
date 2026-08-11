import { useEffect, useState } from 'react'

const WORK_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60
const DURATIONS = { work: WORK_SECONDS, break: BREAK_SECONDS }

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function Timer() {
  const [mode, setMode] = useState('work')
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS)
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
    setMode((prevMode) => (prevMode === 'work' ? 'break' : 'work'))
  }, [secondsLeft, isRunning])

  useEffect(() => {
    setSecondsLeft(DURATIONS[mode])
  }, [mode])

  function handleStart() {
    setIsRunning(true)
  }

  function handlePause() {
    setIsRunning(false)
  }

  function handleReset() {
    setIsRunning(false)
    setMode('work')
    setSecondsLeft(WORK_SECONDS)
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
    </div>
  )
}

export default Timer
