'use client'

import { useAboutLang } from './AboutLang'

// 회랑 일러스트 캡션 + 2문장 해석 — 그림이 의도가 있음을 알리는 절제된 글.
// 언어 토글(useAboutLang)에 연동. 「아테네 학당」/The School of Athens 는 이탤릭만(링크 없음).
export default function AboutColonnadeCaption() {
  const { lang } = useAboutLang()

  const caption =
    lang === 'ko' ? '직접 그린 1점 투시 회랑' : 'An original one-point-perspective colonnade'

  return (
    <div className="mx-auto mt-6 max-w-[520px] px-5 text-center">
      <p className="text-[13px] italic text-ink-2">{caption}</p>
      <div className="mx-auto my-3 h-px w-6 bg-coral/60" aria-hidden />
      <p className="about-cap-note">
        {lang === 'ko' ? (
          <>
            <em>「아테네 학당」</em>의 인물들이 누구의 답도 받아쓰지 않고 저마다의 방식으로 진리를
            탐구하듯, 이 자리도 빌려온 결론이 아니라 스스로 사고하고 판단하는 태도를 추구합니다.
            코끼리 한 마리가 묵묵히 걷듯, 천천히 그러나 자기 걸음으로.
          </>
        ) : (
          <>
            Just as the figures in Raphael&apos;s <em>The School of Athens</em> pursue truth each in
            their own way — taking no one&apos;s answer on faith — this space seeks not borrowed
            conclusions but the habit of thinking and judging for oneself. Like a single elephant
            walking on: slowly, but at its own pace.
          </>
        )}
      </p>
    </div>
  )
}
