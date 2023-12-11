type F0<A = void> = () => A;
type F<A, B = void> = (a: A) => B;
type F2<A, B, C = void> = (a: A, b: B) => C;

// TODO: come up with a better type name
type FF<A, B = void> = (a1: A, a2: A) => B;

// predicate
type P<A> = F<A, boolean>;
