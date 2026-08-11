import { useEffect, useState } from 'react'

const WORK_SECONDS = 25 * 60

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function Timer() {
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId)
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isRunning])

  function handleStart() {
    if (secondsLeft === 0) return
    setIsRunning(true)
  }

  function handlePause() {
    setIsRunning(false)
  }

  function handleReset() {
    setIsRunning(false)
    setSecondsLeft(WORK_SECONDS)
  }

  return (
    <div className="flex flex-col items-center gap-6">
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
    </div>
  )
}

export default Timer
