// 장면 F — 문서 편집기. 도구 이름은 전역 유일(doc_ 접두사).
// 상태는 평면 키(App shallow-merge dispatch 와 호환). 블록 3개의 type/정렬/굵게를 반영.
const BLOCKS = [
  { i: 1, text: '제품 출시 노트' },
  { i: 2, text: '이번 업데이트로 검색 속도가 2배 빨라졌습니다.' },
  { i: 3, text: '“가장 빠른 길은, 길을 아는 것이다.”' },
]

function Block({ type, align, bold, text }) {
  const style = { textAlign: align, fontWeight: bold ? 800 : undefined }
  if (type === 'heading') return <h4 className="db" style={style}>{text}</h4>
  if (type === 'quote') return <blockquote className="db dq" style={style}>{text}</blockquote>
  if (type === 'list') return <ul className="db dl" style={style}>{text.split(/[,.]\s*/).filter(Boolean).map((t, i) => <li key={i}>{t}</li>)}</ul>
  return <p className="db" style={style}>{text}</p>
}

export const doc = {
  id: 'doc',
  label: '문서 편집기',
  tools: [
    { name: 'doc_set_block', description: '블록 종류 변경', parameters: { type: 'object', properties: { index: { type: 'integer', enum: [1, 2, 3] }, type: { type: 'string', enum: ['paragraph', 'heading', 'quote', 'list'] } }, required: ['index', 'type'] } },
    { name: 'doc_set_align', description: '블록 정렬', parameters: { type: 'object', properties: { index: { type: 'integer', enum: [1, 2, 3] }, align: { type: 'string', enum: ['left', 'center', 'right'] } }, required: ['index', 'align'] } },
    { name: 'doc_set_bold', description: '블록 굵게', parameters: { type: 'object', properties: { index: { type: 'integer', enum: [1, 2, 3] }, bold: { type: 'boolean' } }, required: ['index', 'bold'] } },
  ],
  initialState: { type1: 'heading', align1: 'left', bold1: false, type2: 'paragraph', align2: 'left', bold2: false, type3: 'quote', align3: 'left', bold3: false },
  onToolCall(name, args, dispatch) {
    const i = args.index
    if (name === 'doc_set_block') dispatch({ [`type${i}`]: args.type })
    else if (name === 'doc_set_align') dispatch({ [`align${i}`]: args.align })
    else if (name === 'doc_set_bold') dispatch({ [`bold${i}`]: !!args.bold })
  },
  render(state) {
    return (
      <>
        <div className="doc">
          {BLOCKS.map((b) => (
            <div className="docrow" key={b.i}>
              <span className="dn">{b.i}</span>
              <Block type={state[`type${b.i}`]} align={state[`align${b.i}`]} bold={state[`bold${b.i}`]} text={b.text} />
            </div>
          ))}
        </div>
        <div className="state">
          {BLOCKS.map((b) => (
            <span key={b.i}>{b.i} <b>{state[`type${b.i}`]}·{state[`align${b.i}`]}{state[`bold${b.i}`] ? '·B' : ''}</b></span>
          ))}
        </div>
      </>
    )
  },
}
