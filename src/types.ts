import { TransitionStates } from './enum';

export type Timeout =
  | number
  | {
      appear?: number;
      enter: number;
      exit: number;
    };

export type TransitionState =
  | TransitionStates.UNMOUNTED
  | TransitionStates.EXITED
  | TransitionStates.ENTERING
  | TransitionStates.ENTERED
  | TransitionStates.EXITING;
