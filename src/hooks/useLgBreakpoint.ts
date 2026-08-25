import { useEffect, useState } from 'react'

const LG_QUERY = '(min-width: 1024px)'

/**
 * True when viewport matches Tailwind `lg` (1024px) and up — desktop shell breakpoint.
 */
export const useLgBreakpoint = (): boolean => {
  const [isLgUp, setIsLgUp] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(LG_QUERY).matches
  })

  useEffect(() => {
    const mq = window.matchMedia(LG_QUERY)
    const onChange = () => setIsLgUp(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isLgUp
}
