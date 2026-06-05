// 로고 기반 동적 SVG 모티프 — hero/섹션/카드에서 재사용.
// 모두 디자인 토큰(--coral/--coral-soft/--ink)을 사용해 라이트/다크에 자동 적응.

interface MotifProps {
  className?: string
}

/**
 * Rings — 로고의 동심원 모티프(concentric circles).
 * coral-soft stroke, 바깥쪽으로 갈수록 옅어진다. 장식 전용(aria-hidden).
 */
export function Rings({
  className = '',
  count = 4,
  strokeWidth = 1.4,
}: MotifProps & { count?: number; strokeWidth?: number }) {
  const rings = Array.from({ length: count }, (_, i) => {
    const r = 10 + i * 13
    const opacity = +(1 - i * (0.72 / count)).toFixed(2)
    return <circle key={i} cx="60" cy="60" r={r} opacity={opacity} />
  })
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      fill="none"
      stroke="hsl(var(--coral-soft))"
      strokeWidth={strokeWidth}
      className={className}
    >
      {rings}
    </svg>
  )
}

/**
 * Halo — 소프트 radial 글로우(coral + ink). 05의 hero/데모 위젯 halo.
 * 위치/크기는 className(absolute, inset, w/h 등)으로 제어. 장식 전용.
 */
export function Halo({ className = '' }: MotifProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full blur-3xl ${className}`}
      style={{
        background:
          'radial-gradient(circle at 70% 20%, hsl(var(--coral) / 0.18), transparent 60%), radial-gradient(circle at 20% 90%, hsl(var(--ink) / 0.14), transparent 60%)',
      }}
    />
  )
}
