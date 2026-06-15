'use client'

import 'lenis/dist/lenis.css'
import { useEffect, type ComponentType } from 'react'
import { ScrollTrigger } from '@/components/showcases/scroll/gsap'
import { useLenis } from '@/components/showcases/scroll/useLenis'
import AuraOneNarrative from './AuraOneNarrative'
import VantaNarrative from './VantaNarrative'
import LedgrNarrative from './LedgrNarrative'
import DriftNarrative from './DriftNarrative'
import SlateNarrative from './SlateNarrative'
import FolioNarrative from './FolioNarrative'

// 실험 서사형 인트로(본 사이트). ★ 데모가 scroll-native/시그니처이므로 내러티브는 "연구한 디자인 문법"의
// 메타 해설 전용 — 데모의 제품 시퀀스를 재연하지 않는다(슬러그별 컴포넌트에 가드레일 명시).
// 인프라(부드러운 스크롤·핀 보정)는 여기서 공유, 안무는 슬러그별 컴포넌트에서 맞춤.
type NarrativeProps = { title: string; demoHref: string }

const REGISTRY: Record<string, ComponentType<NarrativeProps>> = {
  'aura-one': AuraOneNarrative,
  'vanta-ev': VantaNarrative,
  ledgr: LedgrNarrative,
  drift: DriftNarrative,
  slate: SlateNarrative,
  folio: FolioNarrative,
}

export default function ExperimentNarrative({
  slug,
  title,
  demoHref,
}: {
  slug: string
} & NarrativeProps) {
  useLenis()

  // 웹폰트(Pretendard) 스왑 후 핀 측정 보정 — 레이아웃 시프트 방지.
  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
  }, [])

  const Body = REGISTRY[slug]
  if (!Body) return null
  return <Body title={title} demoHref={demoHref} />
}
