import { useEffect, useState } from 'react'

// Returns a debounced copy of `value` that only updates after `delay` ms of
// no changes. Use for the Search tab: `const q = useDebounce(input, 300)` then
// key a TanStack Query off `q` so you don't fire a request per keystroke.
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
