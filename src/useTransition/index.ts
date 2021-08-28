import { useCallback, useEffect, useMemo, useState } from 'react';
import { TransitionStates } from '../enum';
import { getInitialState } from '../helpers/getInitialState';
import { getTimeout } from '../helpers/getTimeouts';
import { useDidUpdate } from '../hooks/useDidUpdate';
import { useStateWithCallback } from '../hooks/useStateWithCallback';
import { TransitionState } from '../types';
import { UseTransitionHook, UseTransitionProps } from './types';

export * from './types';

const config = { disabled: false };

export function useTransition({
  mountOnEnter = false,
  unmountOnExit = false,
  appearOnMount = false,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExited,
  onExiting,
  timeout,
  addEndListener,
  ...params
}: UseTransitionProps): UseTransitionHook {
  const { appear, enter, exit } = useMemo(() => getTimeout(timeout), [timeout]);
  const [currentState, setCurrentState] = useStateWithCallback<TransitionState>(
    getInitialState({
      appearOnMount,
      in: params.in,
      mountOnEnter,
      unmountOnExit,
    })
  );
  const [prevState, setPrevState] = useState<null | TransitionStates>(null);

  if (currentState !== prevState) {
    setPrevState(currentState);
  }

  useEffect(() => {
    if (params.in && prevState === TransitionStates.UNMOUNTED) {
      setCurrentState(TransitionStates.EXITED);
    }
  });

  const onTransitionEnd = useCallback(
    (t: number, handler: () => void) => {
      const doesNotHaveTimeoutOrListener = t == null && !addEndListener;
      if (doesNotHaveTimeoutOrListener) {
        setTimeout(handler, 0);
        return;
      }

      if (addEndListener) {
        addEndListener?.();
      }

      if (timeout != null) {
        setTimeout(handler, t);
      }
    },
    [addEndListener]
  );

  const performEnter = useCallback(
    (appearing: boolean) => {
      const enterTimeout =
        appearing && appearOnMount && appear ? appear : enter;

      if ((!appearing && !enter) || config.disabled) {
        setCurrentState(TransitionStates.ENTERED, () => {
          onEntered?.();
        });
        return;
      }

      onEnter?.();

      setCurrentState(TransitionStates.ENTERING, () => {
        onEntering?.();

        onTransitionEnd(enterTimeout, () => {
          setCurrentState(TransitionStates.ENTERED, () => {
            onEntered?.();
          });
        });
      });
    },
    [onEnter, onEntered, onEntering, enter, appear]
  );

  const performExit = useCallback(() => {
    if (!exit || config.disabled) {
      setCurrentState(TransitionStates.EXITED, () => {
        onExited?.();
      });
      return;
    }

    onExit?.();

    setCurrentState(TransitionStates.EXITING, () => {
      onExiting?.();

      onTransitionEnd(exit, () => {
        setCurrentState(TransitionStates.EXITED, () => {
          onExited?.();
        });
      });
    });
  }, [onExit, onExited, onExiting]);

  const updateState = useCallback(
    (nextState: TransitionState | null, mounting = false) => {
      if (nextState !== null) {
        if (nextState === TransitionStates.ENTERING) {
          performEnter(mounting);
        } else {
          performExit();
        }
      }
    },
    [currentState, unmountOnExit, performEnter, performExit]
  );

  useEffect(() => {
    if (params.in) {
      if (
        currentState !== TransitionStates.ENTERING &&
        currentState !== TransitionStates.ENTERED
      ) {
        updateState(TransitionStates.ENTERING);
      }
    } else if (
      currentState === TransitionStates.ENTERING ||
      currentState === TransitionStates.ENTERED
    ) {
      updateState(TransitionStates.EXITING);
    }
  }, [params.in, currentState, updateState]);

  useEffect(() => {
    if (params.in && appearOnMount) {
      updateState(TransitionStates.ENTERING, appearOnMount);
    }
  }, []);

  useDidUpdate(() => {
    if (unmountOnExit && currentState === TransitionStates.EXITED) {
      setCurrentState(TransitionStates.UNMOUNTED);
    }
  }, [unmountOnExit, currentState]);

  return {
    transitionState: currentState,
    toggleDisableAllTransitions: (val: boolean) => {
      config.disabled = val;
    },
  };
}
