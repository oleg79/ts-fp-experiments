type F0<A = void> = () => A;
type F<A, B = void> = (a: A) => B;
type F2<A, B, C = void> = (a: A, b: B) => C;

// predicate
type P<A> = F<A, boolean>;
