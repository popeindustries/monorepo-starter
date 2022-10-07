/**
 * Factory for creating namespaced logging functions.
 * Namespaces are enabled via the `debug` localStorage key,
 * and support multiple comma/space separated namespaces with or without `*` wildcards.
 */
declare function debugFactory(namespace: string): (...data: Array<any>) => void;

declare namespace debugFactory {
  /**
   * Override log function.
   * Defaults to `console.log`.
   */
  function logFn(...data: Array<any>): void;
}

export default debugFactory;
export const namespaces: Set<string>;
export const isEnabled: (namespace: string) => boolean;
