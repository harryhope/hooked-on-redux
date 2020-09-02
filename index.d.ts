type Dispatch<A> = A => void

interface HookedOnStateConfig {
  namespace?: string,
  rootPath?: string
}

export const createHookedOnReducer<R>(
  initialState: R,
  namespace?: string,
  handlers?: object
) : R

export const useHookedOnState<S>(
  selector: string,
  defaultState: S,
  options?: HookedOnStateConfig
) : [S, Dispatch<S>]
