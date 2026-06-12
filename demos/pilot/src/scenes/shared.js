// 모든 scene 이 공유하는 전역 도구. set_theme 은 앱 전역 상태(.app.light/.dark)를 바꾼다.
export const THEME_TOOL = {
  name: 'set_theme',
  description: '페이지 테마 변경(전역, 모든 화면 공통)',
  parameters: { type: 'object', properties: { mode: { type: 'string', enum: ['light', 'dark'] } }, required: ['mode'] },
}
