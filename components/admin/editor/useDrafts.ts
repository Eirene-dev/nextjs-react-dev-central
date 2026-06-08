'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// 에세이 드래프트 자동저장 훅 — 저장 포맷=마크다운.
// 빈 글은 생성하지 않음(내용이 생긴 뒤 첫 POST). 이후 PATCH. 디바운스 1.5s.
// 마지막 연 드래프트 id 를 localStorage 에 보관 → 새로고침 시 DB 에서 로드(유지 증거).

export type DraftListItem = { id: number; title: string; updatedAt: string }
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
const LS_KEY = 'essay:lastDraftId'
const DEBOUNCE = 1500

export function useDrafts(basePath = '/api/essay-drafts') {
  const [draftId, setDraftId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [drafts, setDrafts] = useState<DraftListItem[]>([])
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  const skipSave = useRef(true) // 첫 마운트/프로그램 로드 직후 자동저장 억제
  const saving = useRef(false)
  const dirty = useRef(false)
  const draftIdRef = useRef<number | null>(null)
  draftIdRef.current = draftId

  const refreshList = useCallback(async () => {
    try {
      const r = await fetch(basePath)
      if (r.ok) setDrafts(await r.json())
    } catch {
      /* 목록 갱신 실패는 무시 */
    }
  }, [])

  const loadInto = useCallback((id: number, t: string, b: string, updatedAt: string) => {
    skipSave.current = true
    setDraftId(id)
    setTitle(t)
    setBody(b)
    setSavedAt(new Date(updatedAt))
    setStatus('saved')
    try {
      localStorage.setItem(LS_KEY, String(id))
    } catch {
      /* noop */
    }
  }, [])

  const loadDraft = useCallback(
    async (id: number) => {
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
    [loadInto]
  )

  const newDraft = useCallback(() => {
    skipSave.current = true
    setDraftId(null)
    setTitle('')
    setBody('')
    setStatus('idle')
    setSavedAt(null)
    try {
      localStorage.removeItem(LS_KEY)
    } catch {
      /* noop */
    }
  }, [])

  // 실제 저장(POST 생성 → PATCH). 동시 저장 방지: 진행 중이면 dirty 표시 후 종료.
  const save = useCallback(async () => {
    if (saving.current) {
      dirty.current = true
      return
    }
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
        body: JSON.stringify({ title, body }),
      })
      if (!r2.ok) throw new Error('patch failed')
      const { updatedAt } = await r2.json()
      setSavedAt(new Date(updatedAt))
      setStatus('saved')
      refreshList()
    } catch {
      setStatus('error')
    } finally {
      saving.current = false
      if (dirty.current) {
        dirty.current = false
        save()
      }
    }
  }, [title, body, refreshList])

  const deleteDraft = useCallback(
    async (id: number) => {
      try {
        const r = await fetch(`${basePath}/${id}`, { method: 'DELETE' })
        if (!r.ok) return
        if (id === draftIdRef.current) newDraft()
        refreshList()
      } catch {
        /* noop */
      }
    },
    [newDraft, refreshList]
  )

  // 마운트: 목록 로드 + 마지막 연 드래프트 복원(새로고침 후 유지)
  useEffect(() => {
    refreshList()
    let last: string | null = null
    try {
      last = localStorage.getItem(LS_KEY)
    } catch {
      /* noop */
    }
    if (last && /^\d+$/.test(last)) loadDraft(Number(last))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 디바운스 자동저장 — 빈 글은 생성하지 않음
  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false
      return
    }
    if (!title.trim() && !body.trim()) return
    const t = setTimeout(() => save(), DEBOUNCE)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body])

  return {
    draftId,
    title,
    setTitle,
    body,
    setBody,
    drafts,
    status,
    savedAt,
    loadDraft,
    newDraft,
    deleteDraft,
  }
}
