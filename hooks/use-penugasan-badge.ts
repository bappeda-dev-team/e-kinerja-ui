"use client"

import { useCallback, useEffect, useState } from "react"

import { getPenugasan, markAllPenugasanAsRead } from "@/app/programmer/penugasan/services"

export const PENUGASAN_ALL_READ_EVENT = "penugasan:all-read"

const POLLING_INTERVAL_MS = 60_000

interface UsePenugasanBadgeProps {
  userId?: string
}

export function usePenugasanBadge({ userId }: UsePenugasanBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshUnreadCount = useCallback(async () => {
    if (!userId) {
      return 0
    }

    try {
      const res = await getPenugasan()

      if (res.status !== 200) {
        return null
      }

      const unreadItems = (res.data?.data ?? []).filter((item) => {
        const programmerId = item.programmer?.id ?? ""
        const belongsToCurrentUser = programmerId ? programmerId === userId : true
        return belongsToCurrentUser && item.is_read === false
      })

      return unreadItems.length
    } catch {
      // Badge bukan fitur kritis, jadi error diabaikan.
      return null
    }
  }, [userId])

  const markAllAsRead = useCallback(async () => {
    setUnreadCount(0)

    try {
      await markAllPenugasanAsRead()
    } catch {
      // Badge bukan fitur kritis, jadi error diabaikan.
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    const syncUnreadCount = async () => {
      const nextCount = await refreshUnreadCount()
      if (!isCancelled && nextCount !== null) {
        setUnreadCount(nextCount)
      }
    }

    void syncUnreadCount()

    if (!userId) {
      return () => {
        isCancelled = true
      }
    }

    const intervalId = window.setInterval(() => {
      void syncUnreadCount()
    }, POLLING_INTERVAL_MS)

    return () => {
      isCancelled = true
      window.clearInterval(intervalId)
    }
  }, [refreshUnreadCount, userId])

  useEffect(() => {
    const handleAllRead = () => {
      setUnreadCount(0)
    }

    window.addEventListener(PENUGASAN_ALL_READ_EVENT, handleAllRead)

    return () => {
      window.removeEventListener(PENUGASAN_ALL_READ_EVENT, handleAllRead)
    }
  }, [])

  return {
    unreadCount,
    refreshUnreadCount,
    markAllAsRead,
  }
}
