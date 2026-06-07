'use client'

import { useState } from 'react'
import Link from '@/components/Link'

// bio 한/영 토글 — 카피는 저자 확정 문구만 사용(변형 금지). 기본 언어: 한국어.
const BOOK_URL = 'https://www.yes24.com/Product/Goods/126689601'

export default function AboutBio() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko')

  const btn = (active: boolean) =>
    `px-1 text-sm transition-colors ${
      active ? 'font-bold text-ink' : 'font-medium text-ink-3 hover:text-ink-2'
    }`

  return (
    <div className="mx-auto max-w-[680px]">
      <div className="mb-3 flex items-center justify-end gap-1" role="group" aria-label="Bio 언어 선택">
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

      <div className="prose dark:prose-invert">
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
              중심 소프트웨어 설계와 지속 가능한 개발 방법론에 대한 통찰을 나누고자 합니다.
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
              methodologies.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
