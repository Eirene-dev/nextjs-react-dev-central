'use client'

import Link from '@/components/Link'
import { useAboutLang } from './AboutLang'

// bio 한/영 토글 — 카피는 저자 확정 문구만 사용(변형 금지). 기본 언어: 한국어.
// 책 타이포(.about-prose, 고운바탕 세리프·드롭캡) + 자격 칩 + 푸터 링크.
const BOOK_URL = 'https://www.yes24.com/Product/Goods/126689601'
const JUDGMENT_URL = '/book/judgment-dev'

const CHIPS = {
  ko: ['KAIST 전산학 석사', '삼성전자 16년', 'IEEE 논문', '정보통신부 장관상'],
  en: [
    'KAIST M.S. in Computer Science',
    '16 years at Samsung Electronics',
    'IEEE publications',
    'Grand Prize, Minister of ICT Award',
  ],
}

export default function AboutBio() {
  const { lang, setLang } = useAboutLang()

  const btn = (active: boolean) =>
    `px-1 text-sm transition-colors ${
      active ? 'font-bold text-ink' : 'font-medium text-ink-3 hover:text-ink-2'
    }`

  return (
    <div className="mx-auto max-w-[620px] px-5">
      {/* 자격 칩(좌) + 언어 토글(우) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {CHIPS[lang].map((c, i) => (
            <span key={c} className={`about-chip${i === 0 ? ' about-chip-dot' : ''}`}>
              {c}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1" role="group" aria-label="Bio 언어 선택">
          <button type="button" onClick={() => setLang('ko')} aria-pressed={lang === 'ko'} className={btn(lang === 'ko')}>
            한국어
          </button>
          <span aria-hidden="true" className="text-ink-3">
            |
          </span>
          <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'} className={btn(lang === 'en')}>
            English
          </button>
        </div>
      </div>

      {/* 본문 — 책 타이포(드롭캡 첫 문단) */}
      <div className="about-prose mt-8">
        {lang === 'ko' ? (
          <>
            <p>
              Pax Code는 KAIST 전산학 석사를 마친 전문 프로그래머이자 기술서 저자입니다. 폭넓은
              컴퓨터·소프트웨어 아키텍처 경험을 바탕으로 다양한 플랫폼과 웹 기술을 다뤄 왔습니다.
              삼성전자에서 16년간 소프트웨어 엔지니어로 일하며 실시간 OS와 임베디드 시스템,
              Android·Tizen 플랫폼은 물론 Chromium·WebKit 기반 웹 앱까지 작업했고,
              JSP·ASP.NET·Django·Spring Framework를 활용한 백엔드 개발과 성능 최적화에도 집중해
              왔습니다.
            </p>
            <p>
              다수의 IEEE 논문을 발표하며 성능·저전력 시스템 설계 역량을 보여 왔고, 임베디드
              소프트웨어 경진대회에서 대상(정보통신부 장관상)을 수상했습니다. 현재는 웹·모바일·AI를
              결합한 혁신적인 서비스 개발에 집중하고 있으며, 저서{' '}
              <Link href={BOOK_URL}>『Level Up React Programming with Next.js</Link>』를 통해 사용자
              중심 소프트웨어 설계와 지속 가능한 개발 방법론에 대한 통찰을 나누고자 합니다. 또한{' '}
              <Link href={JUDGMENT_URL}>『AI 시대, 판단하는 개발자』</Link>와{' '}
              <Link href="/essays">에세이</Link>를 통해 AI 시대에 개발자가 스스로 사고하고 판단하는
              힘을 어떻게 기를지 함께 고민하고자 합니다.
            </p>
          </>
        ) : (
          <>
            <p>
              Pax Code is a Professional Programmer and Technical Book Writer, with a Master&apos;s
              degree in Computer Science from KAIST. With extensive experience across computer and
              software architecture, Pax has handled a wide range of platforms and web technologies.
              During 16 years as a Software Engineer at Samsung Electronics, Pax worked on real-time
              OS, embedded systems, Android and Tizen platforms, as well as web apps based on
              Chromium and WebKit, and extended into backend development with JSP, ASP.NET, Django,
              and the Spring Framework, with a focus on performance optimization.
            </p>
            <p>
              Pax has presented numerous IEEE papers, showcasing their expertise in performance and
              low-power system design. They have also achieved recognition in the field, winning the
              grand prize (Minister of Information and Communication Award) at the Embedded Software
              Contest. Currently, Pax is dedicated to developing innovative services that combine
              web, mobile, and AI technologies. Through their book,{' '}
              <Link href={BOOK_URL}>『Level Up React Programming with Next.js</Link>』, Pax aims to
              share insights on user-centric software design and sustainable development
              methodologies. Through{' '}
              <Link href={JUDGMENT_URL}>
                『AI 시대, 판단하는 개발자』 (The Developer Who Judges in the AI Era)
              </Link>{' '}
              and his <Link href="/essays">essays</Link>, he also explores how developers can
              cultivate the ability to think and judge for themselves in the age of AI.
            </p>
          </>
        )}
      </div>

      {/* 푸터 링크 행 */}
      <div className="about-foot mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 pt-5">
        <Link href="/book">
          <span aria-hidden>📚</span> 저서
        </Link>
        <Link href="/essays">
          <span aria-hidden>✎</span> 에세이
        </Link>
        <a href="https://github.com/Eirene-dev" target="_blank" rel="noopener noreferrer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.4 9.4 0 015 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.02 10.02 0 0022 12.26C22 6.58 17.52 2 12 2z" />
          </svg>
          GitHub
        </a>
      </div>
    </div>
  )
}
