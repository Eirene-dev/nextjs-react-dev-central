// 콘텐츠 데이터 단일 진입점 — contentlayer/generated + pliny/utils/contentlayer 를 대체.
// Velite 출력(.velite)을 재export 하고, 기존 코드가 쓰던 유틸/타입을 벤더링한다.
//
// 런타임은 JSON 을 직접 import 한다(.velite/index.js 의 import-attributes 를 번들러가
// 파싱하지 못하는 경우를 피하기 위함). 타입은 velite 가 생성한 .d.ts 에서 가져온다.
import allBlogsData from '../.velite/allBlogs.json'
import allDocsData from '../.velite/allDocs.json'
import allExamplesData from '../.velite/allExamples.json'
import allLevelupsData from '../.velite/allLevelups.json'
import allEssaysData from '../.velite/allEssays.json'
import allAuthorsData from '../.velite/allAuthors.json'
import type { Blog, Doc, Example, Levelup, Essay, Authors } from '../.velite'

export type { Blog, Doc, Example, Levelup, Essay, Authors }

export const allBlogs = allBlogsData as unknown as Blog[]
export const allDocs = allDocsData as unknown as Doc[]
export const allExamples = allExamplesData as unknown as Example[]
export const allLevelups = allLevelupsData as unknown as Levelup[]
export const allEssays = allEssaysData as unknown as Essay[]
export const allAuthors = allAuthorsData as unknown as Authors[]

// pliny/utils/contentlayer 대체 ----------------------------------------------
export type CoreContent<T> = Omit<T, 'body'>

export function coreContent<T extends { body?: unknown }>(content: T): CoreContent<T> {
  // prev/next 경계에서 undefined 가 들어올 수 있다(레이아웃이 truthy 체크로 처리). 그대로 통과.
  if (!content) return content as CoreContent<T>
  const { body, ...rest } = content
  return rest as CoreContent<T>
}

export function allCoreContent<T extends { body?: unknown; draft?: boolean }>(
  contents: T[]
): CoreContent<T>[] {
  return contents.map(coreContent)
}

// pliny sortPosts 동일: 날짜 내림차순(원본 불변)
export function sortPosts<T extends { date: string | number }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
