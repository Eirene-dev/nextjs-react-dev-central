'use client'

import { createContext, useContext, useState } from 'react'

// /about 언어 토글(한/영) 공유 상태 — bio·칩·회랑 캡션이 같은 토글에 연동되도록 컨텍스트로 끌어올림.
// 기본 언어: 한국어.
export type AboutLang = 'ko' | 'en'

const Ctx = createContext<{ lang: AboutLang; setLang: (l: AboutLang) => void }>({
  lang: 'ko',
  setLang: () => {},
})

export function AboutLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<AboutLang>('ko')
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>
}

export const useAboutLang = () => useContext(Ctx)
