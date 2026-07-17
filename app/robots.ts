import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'

// 검색엔진(Google/Bing 등)은 그대로 허용 — 색인은 이 사이트의 목적이다.
// 학습용 AI 크롤러만 배제한다: 색인 이득이 없으면서 크롤 부하는 그대로 얹는다.
// (robots.txt 는 어디까지나 예의 표시다 — 무시하는 봇은 막지 못하니 조회수 집계 쪽에서도 봇을 거른다.)
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'CCBot',
  'Google-Extended',
  'PerplexityBot',
  'Applebot-Extended',
  'Bytespider',
  'meta-externalagent',
  'FacebookBot',
  'Diffbot',
  'ImagesiftBot',
  'Omgilibot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, disallow: '/' },
    ],
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}
