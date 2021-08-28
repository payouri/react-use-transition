import { DependencyList, useEffect, useRef } from 'react';

export function useDidUpdate(
  callback: () => void,
  deps?: DependencyList
): void {
  const hasMount = useRef<boolean>(false);

  useEffect(() => {
    if (hasMount.current) {
      callback();
    } else {
      hasMount.current = true;
    }
  }, deps);
}
