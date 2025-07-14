import { useCallback, useEffect, useRef } from "react";

function useClickOutside(handler: () => Promise<void>, enabled = true) {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleClick = useCallback(
    (event: { target: any; }) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    },
    [handler]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [handleClick, enabled]);

  return ref;
}

export default useClickOutside;