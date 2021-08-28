import { Timeout, TransitionState } from '../types';

export type UseTransitionProps = {
  timeout: Timeout;
  in: boolean;
  appearOnMount?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  onEntered?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  onEnter?: () => void;
  onExiting?: () => void;
  onEntering?: () => void;
  addEndListener?: () => void;
};

export type UseTransitionHook = {
  transitionState: TransitionState;
  toggleDisableAllTransitions: (val: boolean) => void;
};
