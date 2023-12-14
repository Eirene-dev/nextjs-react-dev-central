'use client'
 
import { useReportWebVitals } from 'next/web-vitals'
import { usePathname } from 'next/navigation'

export function WebVitals() {
  const pathname = usePathname()

  useReportWebVitals((metric) => {
    // 환경 변수에서 URL, 사용자 ID, 인증 키를 가져옵니다.
    const url = process.env.NEXT_PUBLIC_ANALYTICS_URL;

    const data = {
    ...metric,
    pathname: pathname,
  };

    const body = JSON.stringify(data);

    // navigator.sendBeacon() 사용 가능한 경우 사용, 그렇지 않으면 fetch() 사용
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: 'POST', keepalive: true });
    }
  });
  return null;
}