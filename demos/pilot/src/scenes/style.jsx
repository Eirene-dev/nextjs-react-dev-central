// 장면 D — 스타일 스튜디오. 도구 이름은 전역 유일(style_ 접두사).
// ★ 토큰은 미리보기 컨테이너에 scoped(인라인 CSS 변수). 데모 크롬의 전역 --brand 는 건드리지 않는다.
// 다크/라이트는 전역 set_theme 사용(여기 전용 모드 도구 없음).
const ACCENTS = { coral: '#ff6b4a', indigo: '#6366f1', emerald: '#10b981', amber: '#f59e0b', rose: '#f43f5e' }
const RADIUS = { sharp: '0px', soft: '10px', round: '20px' }
const FONT = { small: 0.9, normal: 1, large: 1.18 }
const SPACING = { tight: '12px', normal: '20px', airy: '32px' }

export const style = {
  id: 'style',
  label: '스타일 스튜디오',
  tools: [
    { name: 'style_set_accent', description: '강조색 변경(미리보기 전용)', parameters: { type: 'object', properties: { color: { type: 'string', enum: ['coral', 'indigo', 'emerald', 'amber', 'rose'] } }, required: ['color'] } },
    { name: 'style_set_radius', description: '모서리 둥글기', parameters: { type: 'object', properties: { size: { type: 'string', enum: ['sharp', 'soft', 'round'] } }, required: ['size'] } },
    { name: 'style_set_font_scale', description: '글꼴 크기 배율', parameters: { type: 'object', properties: { scale: { type: 'string', enum: ['small', 'normal', 'large'] } }, required: ['scale'] } },
    { name: 'style_set_spacing', description: '여백 밀도', parameters: { type: 'object', properties: { density: { type: 'string', enum: ['tight', 'normal', 'airy'] } }, required: ['density'] } },
  ],
  initialState: { accent: 'coral', radius: 'soft', fontScale: 'normal', spacing: 'normal' },
  onToolCall(name, args, dispatch) {
    if (name === 'style_set_accent') dispatch({ accent: args.color })
    else if (name === 'style_set_radius') dispatch({ radius: args.size })
    else if (name === 'style_set_font_scale') dispatch({ fontScale: args.scale })
    else if (name === 'style_set_spacing') dispatch({ spacing: args.density })
  },
  render(state) {
    const accent = ACCENTS[state.accent] || ACCENTS.coral
    const radius = RADIUS[state.radius] || RADIUS.soft
    const pad = SPACING[state.spacing] || SPACING.normal
    const scale = FONT[state.fontScale] || 1
    // scoped 토큰: 이 미리보기 컨테이너 안에서만 적용. 전역 토큰과 분리.
    const scoped = { '--sv-accent': accent, '--sv-radius': radius, '--sv-pad': pad, fontSize: `${scale}em` }
    return (
      <>
        <div className="sv-preview" style={scoped}>
          <div className="sv-card">
            <h4>새 워크스페이스</h4>
            <p>팀과 함께 아이디어를 정리하고 바로 배포하세요. 토큰이 실시간 반영됩니다.</p>
            <button className="sv-btn" type="button">시작하기</button>
          </div>
        </div>
        <div className="state">
          <span>강조색 <b>{state.accent}</b></span>
          <span>모서리 <b>{state.radius}</b></span>
          <span>글꼴 <b>{state.fontScale}</b></span>
          <span>여백 <b>{state.spacing}</b></span>
        </div>
      </>
    )
  },
}
