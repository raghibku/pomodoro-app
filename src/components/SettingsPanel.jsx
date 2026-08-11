function SettingsPanel({
  workMinutes,
  breakMinutes,
  onWorkMinutesChange,
  onBreakMinutesChange,
  disabled,
}) {
  return (
    <div className="flex w-64 flex-col gap-3 rounded-lg border border-slate-700 bg-slate-800 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        Settings
      </h2>
      <label className="flex items-center justify-between gap-4 text-sm">
        Work minutes
        <input
          type="number"
          min="1"
          max="120"
          value={workMinutes}
          disabled={disabled}
          onChange={(event) => onWorkMinutesChange(Number(event.target.value))}
          className="w-16 rounded-md bg-slate-900 px-2 py-1 text-right disabled:opacity-40"
        />
      </label>
      <label className="flex items-center justify-between gap-4 text-sm">
        Break minutes
        <input
          type="number"
          min="1"
          max="60"
          value={breakMinutes}
          disabled={disabled}
          onChange={(event) => onBreakMinutesChange(Number(event.target.value))}
          className="w-16 rounded-md bg-slate-900 px-2 py-1 text-right disabled:opacity-40"
        />
      </label>
      {disabled && (
        <p className="text-xs text-slate-500">
          Pause or reset the timer to change durations.
        </p>
      )}
    </div>
  )
}

export default SettingsPanel
