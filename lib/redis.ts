import { Redis } from '@upstash/redis'

// Upstash Redis(REST/HTTP) — 조회수·반응·투표 쓰기를 요청 경로에서 걷어내는 버퍼.
//
// 왜 Redis 인가: Neon 은 5분 비활동 후에야 정지하므로 write 1건이 5분치 compute 를 결제한다.
// 흩어진 write 20건 = wake 20회 = 100분 가동이다. Redis 는 그 바닥값이 없어서,
// 쓰기를 여기 모았다가 cron 이 하루 1회 Postgres 에 몰아 반영하면 wake 가 1회로 접힌다.
//
// HTTP 클라이언트를 쓰는 이유는 Neon 드라이버와 같다 — 서버리스에 영속 커넥션을 두지 않는다.

// 환경변수가 없으면 null 을 돌려준다. 호출부는 이때 기존처럼 Postgres 에 직접 쓴다(폴백).
// 이 설계가 중요한 이유: Upstash 를 붙이기 전에도, 또 Redis 가 죽어도 기능이 그대로 산다.
//
// 이름이 두 벌인 이유: Vercel 마켓플레이스로 Upstash 를 연동하면 KV_REST_API_* 로 주입되고,
// Upstash 콘솔에서 직접 만들면 UPSTASH_REDIS_REST_* 다. 값을 손으로 복제해 두 벌을 두면
// 토큰 로테이션 때 한쪽만 바뀌어 조용히 깨지므로, 주입된 이름을 그대로 읽는다.
//
// KV_REST_API_READ_ONLY_TOKEN 은 절대 쓰지 않는다 — 이 계층은 RPUSH/INCR/SET 을 한다.
// 읽기 전용 토큰을 넣으면 쓰기가 거부되고 아래 호출부가 조용히 Postgres 폴백으로 돌아가,
// 에러 없이 절감 효과만 사라진다. KV_URL/REDIS_URL(redis:// TCP)도 아니다 — 이건 HTTP 클라이언트다.
let client: Redis | null | undefined

export function getRedis(): Redis | null {
  if (client !== undefined) return client
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  client = url && token ? new Redis({ url, token }) : null
  return client
}

// 쓰기 op 대기열 — cron 이 드레인해 Postgres 에 재생한다.
export const OPS_KEY = 'ops:pending'

// 대기열에 쌓을 수 있는 op 상한. 초과분은 버리지 않고 그 자리에서 Postgres 에 직접 쓴다
// (아래 enqueueOp 참조) — cron 이 오래 멈춰도 데이터가 조용히 사라지지 않게.
export const OPS_MAX = 5000

export type PendingOp =
  | { t: 'view'; essayId: number; ipHash: string; day: string }
  | { t: 'react'; essayId: number; reactorId: string; action: 'like' | 'unlike' }
  | { t: 'vote'; slug: string; option: string; voterToken: string }
