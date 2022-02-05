type Dispatch<S> = (value: S) => void;

type HookedOnStateConfig = {
  namespace?: string;
  rootPath?: string;
};

export function createHookedOnReducer<R>(
  initialState: R,
  namespace?: string,
  handlers?: object
) : R;

export function useHookedOnState<S>(
  selector: string,
  defaultState: S,
  options?: HookedOnStateConfig
) : [S, Dispatch<S>];