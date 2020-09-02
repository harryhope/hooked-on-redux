type Dispatch<A> = A => void

interface HookedOnStateConfig {
  namespace?: string,
  rootPath?: string
}

export const createHookedOnReducer<S>(
  initialState: S,
  namespace?: string,
  handlers?: object
)

export const useHookedOnState<S>(
  selector: string,
  defaultState: S,
  options?: HookedOnStateConfig
) : [S, Dispatch<S>]
