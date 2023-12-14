export async function POST(request: Request) {
  const res = await request.json();

  const url = process.env.ANALYTICS_URL;

  // URL이 정의되지 않았을 경우 오류 처리
  if (!url) {
    console.error('ANALYTICS_URL is not defined');
    return new Response('Server configuration error', { status: 500 });
  }

  const data = {
    ...res,
    userEmail: process.env.ANALYTICS_USER,
    authKey: process.env.ANALYTICS_KEY,
    project: process.env.ANALYTICS_PROJECT,
  };

  // 서버 사이드에서 다른 서버로 데이터 전송
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // 응답 처리 (예: 로깅 또는 에러 핸들링)
    if (!response.ok) {
      console.error('Error sending data to ANALYTICS_URL');
      return new Response('Error sending data', { status: response.status });
    }

    return new Response('Data sent successfully', { status: 200 });
  } catch (error) {
    console.error('Failed to send data:', error);
    return new Response('Server error', { status: 500 });
  }
}
