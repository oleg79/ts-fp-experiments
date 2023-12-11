export const identity = <T>(a: T): T => a;

export const compose = <A, B, C>(g: F<B, C>, f: F<A, B>): F<A, C> => (
  a: A
): C => g(f(a));

export const _const = <A>(a: A): F<any, A> => (_) => a;

// TODO: find out a more proper typing
export const composeAll = <A, C>(
  ...fs: [F<A, any>, ...any[], F<any, C>]
): F<A, C> => fs.reduce(compose);