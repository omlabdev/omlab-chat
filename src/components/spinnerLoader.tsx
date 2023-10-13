export default function SpinnerLoader({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="loader-spinner" role="status" aria-label="Loading">
      <style jsx global>{`body{overflow:hidden}`}</style>
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}