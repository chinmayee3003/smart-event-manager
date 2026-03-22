export default function Badge({ label, color = '#6366f1' }) {
  return (
    <span className="badge" style={{
      background: color + '22',
      color,
      border: `1px solid ${color}44`,
    }}>
      {label}
    </span>
  )
}
