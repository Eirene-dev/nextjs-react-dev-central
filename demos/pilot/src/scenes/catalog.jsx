import { THEME_TOOL } from './shared.js'

// 장면 A — 상품 카탈로그(기존 단일 장면 이식). 정렬·필터·스크롤·테마.
const PRODUCTS = [
  { id: 1, name: '무선 이어버드', price: 89000, cat: '전자제품' },
  { id: 2, name: '머신워시 머그', price: 18000, cat: '주방' },
  { id: 3, name: '메커니컬 키보드', price: 132000, cat: '전자제품' },
  { id: 4, name: '리넨 에이프런', price: 39000, cat: '주방' },
  { id: 5, name: 'USB-C 허브', price: 54000, cat: '전자제품' },
  { id: 6, name: '핸드드립 세트', price: 47000, cat: '주방' },
]

export const catalog = {
  id: 'catalog',
  label: '상품 카탈로그',
  tools: [
    THEME_TOOL,
    { name: 'sort_by', description: '상품 정렬', parameters: { type: 'object', properties: { field: { type: 'string', enum: ['price', 'name'] }, order: { type: 'string', enum: ['asc', 'desc'] } }, required: ['field', 'order'] } },
    { name: 'filter_category', description: '카테고리 필터(전자제품/주방, 없으면 전체)', parameters: { type: 'object', properties: { category: { type: 'string' } } } },
    { name: 'scroll_to', description: '특정 위치로 스크롤', parameters: { type: 'object', properties: { target: { type: 'string', enum: ['top', 'products'] } }, required: ['target'] } },
  ],
  initialState: { sort: null, cat: null },
  onToolCall(name, args, dispatch) {
    if (name === 'sort_by') dispatch({ sort: { field: args.field, order: args.order } })
    else if (name === 'filter_category') dispatch({ cat: args.category || null })
    else if (name === 'scroll_to') {
      const el = args.target === 'top' ? document.getElementById('pilot-top') : document.getElementById('pilot-products')
      el && el.scrollIntoView({ behavior: 'smooth' })
    }
  },
  samples: [
    { label: '가격 낮은 순으로 정렬해줘', calls: [{ name: 'sort_by', args: { field: 'price', order: 'asc' } }] },
    { label: '전자제품만 보여줘', calls: [{ name: 'filter_category', args: { category: '전자제품' } }] },
    { label: '맨 위로 스크롤', calls: [{ name: 'scroll_to', args: { target: 'top' } }] },
    // 다중 도구: 한 명령 → 함수 3개 순차 적용
    { label: '전자제품만 가격 낮은 순으로, 다크모드', calls: [
      { name: 'filter_category', args: { category: '전자제품' } },
      { name: 'sort_by', args: { field: 'price', order: 'asc' } },
      { name: 'set_theme', args: { mode: 'dark' } },
    ] },
  ],
  chips: ['가격 낮은 순으로 정렬해줘', '전자제품만 보여줘', '전자제품만 가격 낮은 순으로, 다크모드'],
  render(state) {
    let view = PRODUCTS.filter((p) => !state.cat || p.cat === state.cat)
    if (state.sort) {
      const s = state.sort
      view = [...view].sort((a, b) => (s.field === 'price' ? a.price - b.price : a.name.localeCompare(b.name)) * (s.order === 'desc' ? -1 : 1))
    }
    return (
      <div className="board">
        <div className="state">
          <span>정렬 <b>{state.sort ? `${state.sort.field} ${state.sort.order}` : '없음'}</b></span>
          <span>필터 <b>{state.cat || '전체'}</b></span>
        </div>
        <div className="products" id="pilot-products">
          {view.map((p) => (
            <div className="card" key={p.id}>
              <div className="cat">{p.cat}</div>
              <div className="name">{p.name}</div>
              <div className="price">₩ {p.price.toLocaleString('ko-KR')}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
}
