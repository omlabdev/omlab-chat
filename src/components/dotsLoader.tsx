export default function DotsLoader({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <span className="loader-dots" role="status" aria-label="Loading">
      <span className="dots"></span>
    </span>
  )
}