import Link from '@/components/Link'

// 해부 전시 카드 — 인덱스/갤러리 공용. 전시 번호·제목·질문 한 줄·category 태그.
export default function AnatomyCard({
  slug,
  exhibit,
  category,
  title,
  question,
}: {
  slug: string
  exhibit: number
  category: string
  title: string
  question: string
}) {
  return (
    <Link
      href={`/showcases/anatomy/${slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-surface-2 p-5 transition hover:-translate-y-1 hover:border-coral-soft hover:shadow-soft"
    >
      <span className="anatomy-mono flex items-center gap-2 text-[10.5px] uppercase tracking-[0.12em] text-coral-2">
        <span className="anatomy-ringdot" aria-hidden />
        전시 {String(exhibit).padStart(2, '0')} · {category}
      </span>
      <h3 className="anatomy-h1 mt-2.5 text-[16.5px] group-hover:text-coral-2">{title}</h3>
      <p className="mt-2 line-clamp-2 text-[13px] leading-[1.6] text-ink-2">{question}</p>
      <span className="mt-3 text-sm font-semibold text-ink-3 group-hover:text-coral-2">
        판단해 보기 →
      </span>
    </Link>
  )
}
