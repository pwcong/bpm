import React from 'react';

export function useClosuer<F extends Function>(fn: F) {
  const ref = React.useRef<F | null>(null);

  const fnProxy = React.useCallback(() => {
    ref.current && ref.current();
  }, []);

  React.useEffect(() => {
    ref.current = fn;
  });

  return fnProxy;
}
