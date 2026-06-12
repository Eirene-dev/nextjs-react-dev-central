// 장면 E — 모션 스튜디오. 도구 이름은 전역 유일(motion_ 접두사).
// 상태는 평면 키(App shallow-merge dispatch 와 호환). CSS 애니메이션을 인라인 스타일로 구동.
const SHAPES = [
  { k: 'left', label: '왼쪽' },
  { k: 'center', label: '가운데' },
  { k: 'right', label: '오른쪽' },
]
const KF = { spin: 'pilot-spin', float: 'pilot-float', pulse: 'pilot-pulse', none: 'none' }
const DUR = { slow: '2.4s', normal: '1.4s', fast: '0.7s' }

export const motion = {
  id: 'motion',
  label: '모션 스튜디오',
  chips: ['가운데 천천히 떠다니게'],
  tools: [
    { name: 'motion_animate', description: '도형 애니메이션 지정', parameters: { type: 'object', properties: { target: { type: 'string', enum: ['left', 'center', 'right'] }, type: { type: 'string', enum: ['spin', 'float', 'pulse', 'none'] } }, required: ['target', 'type'] } },
    { name: 'motion_set_speed', description: '도형 애니메이션 속도', parameters: { type: 'object', properties: { target: { type: 'string', enum: ['left', 'center', 'right'] }, speed: { type: 'string', enum: ['slow', 'normal', 'fast'] } }, required: ['target', 'speed'] } },
    { name: 'motion_toggle_play', description: '전체 재생/멈춤', parameters: { type: 'object', properties: { playing: { type: 'boolean' } }, required: ['playing'] } },
  ],
  initialState: { leftType: 'none', leftSpeed: 'normal', centerType: 'none', centerSpeed: 'normal', rightType: 'none', rightSpeed: 'normal', playing: true },
  onToolCall(name, args, dispatch) {
    if (name === 'motion_animate') dispatch({ [`${args.target}Type`]: args.type })
    else if (name === 'motion_set_speed') dispatch({ [`${args.target}Speed`]: args.speed })
    else if (name === 'motion_toggle_play') dispatch({ playing: !!args.playing })
  },
  render(state) {
    return (
      <>
        <div className="stage">
          {SHAPES.map((s) => {
            const type = state[`${s.k}Type`]
            const speed = state[`${s.k}Speed`]
            const anim = {
              animationName: KF[type] || 'none',
              animationDuration: DUR[speed] || DUR.normal,
              animationTimingFunction: type === 'spin' ? 'linear' : 'ease-in-out',
              animationIterationCount: 'infinite',
              animationPlayState: state.playing ? 'running' : 'paused',
            }
            return (
              <div className="shapebox" key={s.k}>
                <div className="shape" style={anim} />
                <span className="slab">{s.label}</span>
              </div>
            )
          })}
        </div>
        <div className="state">
          <span>재생 <b>{state.playing ? 'ON' : '멈춤'}</b></span>
          {SHAPES.map((s) => (
            <span key={s.k}>{s.label} <b>{state[`${s.k}Type`]}{state[`${s.k}Type`] !== 'none' ? `·${state[`${s.k}Speed`]}` : ''}</b></span>
          ))}
        </div>
      </>
    )
  },
}
