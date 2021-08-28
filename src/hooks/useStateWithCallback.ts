import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export function useStateWithCallback<T extends unknown = unknown>(
  initialValue: T
): [T, (v: SetStateAction<T>, callback?: (val: T) => void) => void] {
  const [state, innerSetState] = useState<T>(initialValue);
  const active = useRef<boolean>(false);
  const callbackRef = useRef<((currentState: T) => void) | undefined>(
    undefined
  );

  useEffect(() => {
    if (callbackRef.current && active.current) {
      active.current = false;
      callbackRef.current(state);
    }
  }, [state]);

  const setState = useCallback(
    (val: SetStateAction<T>, callback?: (currentState: T) => void) => {
      if (callback) {
        callbackRef.current = callback;
        active.current = true;
      }
      innerSetState(val);
    },
    [innerSetState]
  );

  return [state, setState];
}
