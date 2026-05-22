export default function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="3" y="6" width="22" height="20" rx="3" fill="#d4943a" />
        <rect x="7" y="3" width="22" height="20" rx="3" fill="#0c0c0e" stroke="#d4943a" strokeWidth="1.5" />
      </svg>
      <span style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>SZZ Flashcards</span>
    </div>
  )
}
