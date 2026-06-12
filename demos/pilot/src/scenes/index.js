// scene 레지스트리 — 활성 scene 의 tools·initialState·render·onToolCall·samples·chips 가 함께 교체된다.
import { catalog } from './catalog.jsx'
import { dashboard } from './dashboard.jsx'

export const SCENES = [catalog, dashboard]
