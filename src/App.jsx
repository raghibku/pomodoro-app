import Timer from './components/Timer'

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-900 text-slate-100">
      <h1 className="text-4xl font-semibold">Pomodoro</h1>
      <Timer />
    </div>
  )
}

export default App
