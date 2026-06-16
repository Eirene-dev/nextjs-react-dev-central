// 샘플 — 목표별 녹화 functionCall 시퀀스. 승인 UX 는 동일(사용자가 [실행] 눌러야 진행).
export const PRODUCTS = [
  { id: 'laptop', name: 'Nimbus 7 노트북', price: 1290000, cat: '컴퓨터', desc: '14" · 32GB · 1TB SSD' },
  { id: 'monitor', name: '4K 27" 모니터', price: 459000, cat: '디스플레이', desc: 'IPS · USB-C 90W' },
  { id: 'arm', name: '모니터 암', price: 89000, cat: '액세서리', desc: '가스 스프링 · VESA' },
  { id: 'kbd', name: '메커니컬 키보드', price: 89000, cat: '입력장치', desc: '무선 · 적축' },
  { id: 'mouse', name: '무선 마우스', price: 39000, cat: '입력장치', desc: '8000DPI · 정숙 클릭' },
  { id: 'webcam', name: '4K 웹캠', price: 129000, cat: '화상', desc: '오토포커스 · HDR' },
  { id: 'headset', name: '노이즈캔슬 헤드셋', price: 249000, cat: '오디오', desc: 'ANC · 40시간' },
  { id: 'hub', name: 'USB-C 8in1 허브', price: 59000, cat: '액세서리', desc: 'HDMI · PD 100W' },
]
export const COUPONS = { SAVE10: 0.1, SAVE20: 0.2, WELCOME: 0.15 }
export const COUPON_LIST = [
  { code: 'SAVE10', label: '10% 할인' },
  { code: 'SAVE20', label: '20% 할인' },
  { code: 'WELCOME', label: '첫 구매 15%' },
]

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
  '모니터랑 모니터 암 담고 결제 직전까지': [
    { name: 'add_to_cart', args: { product: 'monitor' } },
    { name: 'add_to_cart', args: { product: 'arm' } },
    { name: 'go_checkout', args: {} },
  ],
  '재택 세트(웹캠·헤드셋·허브)에 20% 쿠폰': [
    { name: 'add_to_cart', args: { product: 'webcam' } },
    { name: 'add_to_cart', args: { product: 'headset' } },
    { name: 'add_to_cart', args: { product: 'hub' } },
    { name: 'apply_coupon', args: { code: 'SAVE20' } },
  ],
  '키보드 3개 대량 주문': [
    { name: 'add_to_cart', args: { product: 'kbd' } },
    { name: 'set_qty', args: { product: 'kbd', qty: 3 } },
  ],
}
export const SAMPLE_GOAL_LIST = Object.keys(SAMPLE_GOALS)
