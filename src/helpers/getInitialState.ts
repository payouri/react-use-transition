import { TransitionStates } from '../enum';

export const getInitialState = ({
  appearOnMount,
  unmountOnExit,
  mountOnEnter,
  ...params
}: {
  unmountOnExit?: boolean;
  mountOnEnter?: boolean;
  appearOnMount?: boolean;
  in: boolean;
}): TransitionStates => {
  if (params.in) {
    if (appearOnMount) {
      return TransitionStates.EXITED;
    }
    return TransitionStates.ENTERED;
  }
  if (unmountOnExit || mountOnEnter) {
    return TransitionStates.UNMOUNTED;
  }
  return TransitionStates.EXITED;
};
