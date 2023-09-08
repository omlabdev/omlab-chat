export default function Loader({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <span className="loader">
      <span className="dots"></span>
    </span>
  )
}