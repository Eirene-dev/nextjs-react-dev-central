// 샘플 — 목표별 녹화 functionCall 시퀀스. 승인 UX 는 동일(사용자가 [실행] 눌러야 진행).
export const PRODUCTS = [
  { id: 'laptop', name: 'Nimbus 7 노트북', price: 1290000 },
  { id: 'mouse', name: '무선 마우스', price: 39000 },
  { id: 'kbd', name: '메커니컬 키보드', price: 89000 },
]
export const COUPONS = { SAVE10: 0.1 }

export const SAMPLE_GOALS = {
  '노트북 담고 10% 쿠폰 적용, 결제 직전까지': [
    { name: 'add_to_cart', args: { product: 'laptop' } },
    { name: 'apply_coupon', args: { code: 'SAVE10' } },
    { name: 'go_checkout', args: {} },
  ],
  '마우스 2개랑 키보드 담아줘': [
    { name: 'add_to_cart', args: { product: 'mouse' } },
    { name: 'set_qty', args: { product: 'mouse', qty: 2 } },
    { name: 'add_to_cart', args: { product: 'kbd' } },
  ],
}
export const SAMPLE_GOAL_LIST = Object.keys(SAMPLE_GOALS)
