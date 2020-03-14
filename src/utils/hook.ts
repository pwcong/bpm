import React from 'react';

export function useClosuer<F extends Function>(fn: F) {
  const ref = React.useRef<F | null>(null);

  const fnProxy = React.useCallback((...args) => {
    ref.current && ref.current(...args);
  }, []);

  React.useEffect(() => {
    ref.current = fn;
  });

  return fnProxy;
}
