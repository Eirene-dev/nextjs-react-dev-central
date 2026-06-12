// scene 레지스트리 — 캔버스 모드. 모든 패널을 동시 렌더하고, 명령은 도구 union 중에서 라우팅된다.
import { THEME_TOOL } from './shared.js'
import { catalog } from './catalog.jsx'
import { dashboard } from './dashboard.jsx'

export const SCENES = [catalog, dashboard]

// Gemini 에 넘길 도구 union: 전역 THEME_TOOL + 모든 scene 의 (접두사) 도구.
export const ALL_TOOLS = [THEME_TOOL, ...SCENES.flatMap((s) => s.tools)]

// 도구 이름 → 소유 scene. set_theme 은 전역이라 여기 없음(App 에서 별도 처리).
export const TOOL_OWNER = Object.fromEntries(
  SCENES.flatMap((s) => s.tools.map((t) => [t.name, s.id]))
)

// 픽스처 union — 활성 scene 개념 없음. 도구 이름이 곧 대상 패널.
const HERO = {
  label: '다크로 바꾸고 매출 낮은 순 정렬하고 4분기 강조',
  calls: [
    { name: 'set_theme', args: { mode: 'dark' } },
    { name: 'catalog_sort_by', args: { field: 'price', order: 'asc' } },
    { name: 'dash_highlight_quarter', args: { quarter: 'q4' } },
  ],
}
export const SAMPLES = [
  HERO,
  { label: '전자제품만 보여줘', calls: [{ name: 'catalog_filter_category', args: { category: '전자제품' } }] },
  { label: '가격 낮은 순으로 정렬해줘', calls: [{ name: 'catalog_sort_by', args: { field: 'price', order: 'asc' } }] },
  { label: '선 그래프로', calls: [{ name: 'dash_set_chart_type', args: { type: 'line' } }] },
  { label: '범례 숨기고 막대로', calls: [{ name: 'dash_toggle_legend', args: { show: false } }, { name: 'dash_set_chart_type', args: { type: 'bar' } }] },
  { label: '월간으로 보고 라이트모드', calls: [{ name: 'dash_set_range', args: { period: 'month' } }, { name: 'set_theme', args: { mode: 'light' } }] },
]
// 칩(종류 혼합) — 히어로 칩을 맨 앞에.
export const CHIPS = SAMPLES.map((s) => s.label)
