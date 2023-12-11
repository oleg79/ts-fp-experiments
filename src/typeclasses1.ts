export interface Functor<A> {
  map<B>(fn: F<A, B>): Functor<B>;
  _unwrap(): A;
}

export interface Applicative<A> extends Functor<A> {
  // static pure(a: A): Applicative<A>;
  apply<B>(a: Applicative<A>): Applicative<B>;
}

export interface Alternative<A> extends Applicative<A> {
  // static empty
  or<B>(b: Alternative<B>): Alternative<A> | Alternative<B>;
}

export interface Monad<A> extends Functor<A> {
  bind<B>(fn: F<A, Monad<B>>): Monad<B>;
}

export class Maybe<A> implements Applicative<A>, Monad<A>, Alternative<A> {
  private constructor(private readonly val: A) {}

  static none() {
    return new Maybe(null);
  }

  static empty(): Alternative<null> {
    return new Maybe(null);
  }

  static some<A>(val: A) {
    return new Maybe(val);
  }

  static pure<A>(a: A): Applicative<A> {
    return Maybe.some(a);
  }

  _unwrap() {
    return this.val;
  }

  map<B>(fn: F<A, B>): Functor<B> {
    if (this.val === null) return Maybe.none() as unknown as Functor<B>;
    if (this.val === undefined) return Maybe.none() as unknown as Functor<B>;

    return Maybe.some(fn(this.val));
  }

  apply<B, C>(a: Applicative<B>): Applicative<C> {
    if (typeof this.val !== "function")
      return Maybe.none() as unknown as Applicative<C>;

    if (a._unwrap() === null) return Maybe.none() as unknown as Applicative<C>;
    if (a._unwrap() === undefined)
      return Maybe.none() as unknown as Applicative<C>;

    return Maybe.some(this.val(a._unwrap()));
  }

  bind<B>(fn: F<A, Maybe<B>>): Maybe<B> {
    if (this.val === null) return Maybe.none() as Maybe<B>;
    if (this.val === undefined) return Maybe.none() as Maybe<B>;

    return fn(this.val);
  }

  or<B>(b: Alternative<B>): Alternative<A> | Alternative<B> {
    if (this.val === null) return b;
    if (this.val === undefined) return b;

    return this;
  }
}
