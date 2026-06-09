'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// 에세이 드래프트 저장 훅 — 저장 포맷=마크다운. 저장 비용 절감 개편:
//  - 키 입력마다 디바운스 저장(제거). 대신 수동 '저장' + 선택적 자동저장(5분 주기, dirty 일 때만).
//  - dirty 추적 + beforeunload 경고(dirty 일 때만). 초안 전환/생성 시 dirty 면 먼저 저장.
//  - 빈 글은 생성 안 함. 마지막 연 드래프트 id 를 localStorage 보관 → 새로고침 복원.

export type DraftListItem = { id: number; title: string; updatedAt: string }
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
const LS_KEY = 'essay:lastDraftId'
const AUTOSAVE_LS_KEY = 'essay-editor-autosave'
const AUTOSAVE_INTERVAL_MS = 5 * 60 * 1000 // 5분 주기 점검(상수 — 쉽게 수정)

// initialId: 관리 목록 "편집"(/admin/editor?id=N)에서 열 글. 있으면 localStorage 마지막 글보다 우선.
export function useDrafts(basePath = '/api/essay-drafts', initialId?: number) {
  const [draftId, setDraftId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [drafts, setDrafts] = useState<DraftListItem[]>([])
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [dirty, setDirty] = useState(false)
  const [autosave, setAutosave] = useState(true) // 기본 ON

  const skipDirty = useRef(true) // 첫 마운트/프로그램 로드 직후 dirty 억제
  const saving = useRef(false)
  const draftIdRef = useRef<number | null>(null)
  draftIdRef.current = draftId
  const dirtyRef = useRef(false)
  dirtyRef.current = dirty
  const titleRef = useRef(title)
  titleRef.current = title
  const bodyRef = useRef(body)
  bodyRef.current = body

  const refreshList = useCallback(async () => {
    try {
      const r = await fetch(basePath)
      if (r.ok) setDrafts(await r.json())
    } catch {
      /* 목록 갱신 실패는 무시 */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 실제 저장(POST 생성 → PATCH). refs 로 최신값을 읽어 안정적 콜백 유지(타이머/핸들러 재사용).
  const saveNow = useCallback(async () => {
    if (saving.current) return
    const t = titleRef.current
    const bd = bodyRef.current
    if (!t.trim() && !bd.trim()) return // 빈 글은 생성 안 함
    saving.current = true
    setStatus('saving')
    try {
      let id = draftIdRef.current
      if (id == null) {
        const r = await fetch(basePath, { method: 'POST' })
        if (!r.ok) throw new Error('create failed')
        id = (await r.json()).id as number
        setDraftId(id)
        try {
          localStorage.setItem(LS_KEY, String(id))
        } catch {
          /* noop */
        }
      }
      const r2 = await fetch(`${basePath}/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: t, body: bd }),
      })
      if (!r2.ok) throw new Error('patch failed')
      const { updatedAt } = await r2.json()
      setSavedAt(new Date(updatedAt))
      setStatus('saved')
      setDirty(false)
      refreshList()
    } catch {
      setStatus('error')
    } finally {
      saving.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshList])

  const loadInto = useCallback((id: number, t: string, b: string, updatedAt: string) => {
    skipDirty.current = true
    setDraftId(id)
    setTitle(t)
    setBody(b)
    setSavedAt(new Date(updatedAt))
    setStatus('saved')
    setDirty(false)
    try {
      localStorage.setItem(LS_KEY, String(id))
    } catch {
      /* noop */
    }
  }, [])

  const loadDraft = useCallback(
    async (id: number) => {
      if (dirtyRef.current) await saveNow() // 전환 전 손실 방지
      try {
        const r = await fetch(`${basePath}/${id}`)
        if (!r.ok) {
          if (r.status === 404) {
            try {
              localStorage.removeItem(LS_KEY)
            } catch {
              /* noop */
            }
          }
          return
        }
        const d = await r.json()
        loadInto(d.id, d.title ?? '', d.body ?? '', d.updatedAt)
      } catch {
        /* noop */
      }
    },
    [loadInto, saveNow]
  )

  const newDraft = useCallback(async () => {
    if (dirtyRef.current) await saveNow() // 새 초안 전 현재 저장
    skipDirty.current = true
    setDraftId(null)
    setTitle('')
    setBody('')
    setStatus('idle')
    setSavedAt(null)
    setDirty(false)
    try {
      localStorage.removeItem(LS_KEY)
    } catch {
      /* noop */
    }
  }, [saveNow])

  const deleteDraft = useCallback(
    async (id: number) => {
      try {
        const r = await fetch(`${basePath}/${id}`, { method: 'DELETE' })
        if (!r.ok) return
        if (id === draftIdRef.current) await newDraft()
        refreshList()
      } catch {
        /* noop */
      }
    },
    [newDraft, refreshList]
  )

  const toggleAutosave = useCallback((on: boolean) => {
    setAutosave(on)
    try {
      localStorage.setItem(AUTOSAVE_LS_KEY, on ? '1' : '0')
    } catch {
      /* noop */
    }
  }, [])

  // 마운트: 자동저장 설정 복원 + 목록 로드 + 마지막 연 드래프트 복원
  useEffect(() => {
    try {
      const v = localStorage.getItem(AUTOSAVE_LS_KEY)
      if (v === '0') setAutosave(false)
    } catch {
      /* noop */
    }
    refreshList()
    // URL 의 ?id=N(initialId)이 있으면 그 글을 우선 로드(없는/본인 아님 → loadDraft 가 안전 처리).
    if (initialId && initialId > 0) {
      loadDraft(initialId)
      return
    }
    let last: string | null = null
    try {
      last = localStorage.getItem(LS_KEY)
    } catch {
      /* noop */
    }
    if (last && /^\d+$/.test(last)) loadDraft(Number(last))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // dirty 추적 — 프로그램 로드/생성 직후는 1회 무시, 그 외 본문/제목 변경은 dirty
  useEffect(() => {
    if (skipDirty.current) {
      skipDirty.current = false
      return
    }
    setDirty(true)
  }, [title, body])

  // 자동저장 — ON 일 때만 5분 주기 점검, dirty 면 1회 저장(디바운스 아님). OFF 면 미동작.
  useEffect(() => {
    if (!autosave) return
    const id = setInterval(() => {
      if (dirtyRef.current) saveNow()
    }, AUTOSAVE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [autosave, saveNow])

  // 데이터 보호 — dirty 일 때만 이탈 경고(쓰기 비용 0)
  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  return {
    draftId,
    title,
    setTitle,
    body,
    setBody,
    drafts,
    status,
    savedAt,
    dirty,
    autosave,
    toggleAutosave,
    saveNow,
    loadDraft,
    newDraft,
    deleteDraft,
  }
}
