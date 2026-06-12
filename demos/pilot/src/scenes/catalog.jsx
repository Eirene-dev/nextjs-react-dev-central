// 장면 A — 상품 카탈로그. 도구 이름은 전역 유일(catalog_ 접두사). set_theme 은 전역(레지스트리).
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
  chips: ['전자제품만 보여줘', '가격 낮은 순으로 정렬해줘'],
  tools: [
    { name: 'catalog_sort_by', description: '상품 정렬', parameters: { type: 'object', properties: { field: { type: 'string', enum: ['price', 'name'] }, order: { type: 'string', enum: ['asc', 'desc'] } }, required: ['field', 'order'] } },
    { name: 'catalog_filter_category', description: '상품 카테고리 필터(전자제품/주방, 없으면 전체)', parameters: { type: 'object', properties: { category: { type: 'string' } } } },
    { name: 'catalog_scroll_to', description: '카탈로그 내 위치로 스크롤', parameters: { type: 'object', properties: { target: { type: 'string', enum: ['top', 'products'] } }, required: ['target'] } },
  ],
  initialState: { sort: null, cat: null },
  onToolCall(name, args, dispatch) {
    if (name === 'catalog_sort_by') dispatch({ sort: { field: args.field, order: args.order } })
    else if (name === 'catalog_filter_category') dispatch({ cat: args.category || null })
    else if (name === 'catalog_scroll_to') {
      const el = args.target === 'top' ? document.getElementById('pilot-top') : document.getElementById('pilot-products')
      el && el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  },
  render(state) {
    let view = PRODUCTS.filter((p) => !state.cat || p.cat === state.cat)
    if (state.sort) {
      const s = state.sort
      view = [...view].sort((a, b) => (s.field === 'price' ? a.price - b.price : a.name.localeCompare(b.name)) * (s.order === 'desc' ? -1 : 1))
    }
    return (
      <>
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
      </>
    )
  },
}
