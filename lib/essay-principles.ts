import { z } from 'zod'

// 에세이 작성 원칙 — 시드/스키마/타입(클라이언트 안전: DB import 없음).
// DB 접근은 lib/essay-principles-db.ts(server-only). data = { sections: [{ key, label, items[] }] }.
// 시드 기본값(커스터마이즈 전 표시 / "기본값 복원"). 섹션 3개 고정.
export const SEED: PrinciplesData = {
  sections: [
    {
      key: 'write',
      label: '작성 원칙',
      items: [
        '구체적 1인칭에서 시작 (일반론 X)',
        '한 글에 하나의 주장',
        '짧은 문장과 긴 문장의 리듬',
        '판단을 회피하지 않기',
        '실패와 의심을 숨기지 않기',
      ],
    },
    {
      key: 'avoid',
      label: '피할 것 (AI 글 패턴)',
      items: [
        '"이러한", "다양한", "끊임없이", "결론적으로" 류',
        '전환어 남발, 모든 것을 번호로',
        '굵은 소제목으로 단락 쪼개기',
      ],
    },
    {
      key: 'frame',
      label: '철학 프레임 (소묻플써)',
      items: [
        '6장: "X란 무엇인가?" — 핵심 개념 정의에서 시작',
        '4장: 변증법 — 가장 강한 반론을 내가 먼저 꺼낸다',
        '9장: 명제-논증-결론 골격',
        '14장: 세 질문 — 무엇을 잘못했나 / 했나 / 못했나',
      ],
    },
  ],
}

const sectionSchema = z.object({
  key: z.string().min(1).max(40),
  label: z.string().min(1).max(80),
  items: z.array(z.string().max(400)).max(100),
})
export const principlesSchema = z.object({
  sections: z.array(sectionSchema).max(10),
})
export type PrinciplesData = z.infer<typeof principlesSchema>
