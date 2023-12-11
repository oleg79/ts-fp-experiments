type None = null | undefined;

interface Functor<A> {
  fmap<B>(fn: F<A, B>): Functor<B>;
}

interface Monad<A> {
  bind<B>(fn: F<A, Monad<B>>): Monad<B>;
}

interface Applicative<A> extends Functor<A> {
  apply<B>(ap: Applicative<B>): Applicative<B>;
}

export abstract class Maybe<T> implements Functor<T>, Monad<T>, Applicative<T> {
  abstract fmap<B>(fn: F<T, B>): Functor<B>;
  abstract bind<B>(fn: F<T, Monad<B>>): Monad<B>;
  abstract apply<B>(ap: Applicative<B>): Applicative<B>;

  static just<T>(val: T) {
    return new Just(val);
  }

  static nothing() {
    return new Nothing();
  }
}

class Just<T> implements Maybe<T> {
  constructor(private readonly val: T) {}

  fmap<B>(fn: F<T, B>): Just<B> {
    return new Just(fn(this.val));
  }

  bind<B>(fn: F<T, Just<B>>): Just<B> {
    return fn(this.val);
  }

  apply<B>(ap: Just<B>): Just<B> {
    if (typeof this.val !== "function") throw new Error("must be a function");

    return ap.fmap(this.val as F<B, B>);
  }
}

class Nothing implements Maybe<None> {
  private val = null;

  fmap(_: F<unknown>): Nothing {
    return new Nothing();
  }

  bind(_: F<unknown>): Nothing {
    return new Nothing();
  }

  apply<B>(_: Applicative<B>): Nothing {
    return new Nothing();
  }
}

export abstract class Either<L, R> implements Functor<R>, Monad<R> {
  abstract fmap<B>(fn: F<R, B>): Functor<B>;
  abstract bind<B>(fn: F<R, Monad<B>>): Monad<B>;

  static right<R>(val: R) {
    return new Right(val);
  }

  static left<L>(val: L) {
    return new Left(val);
  }
}

class Left<T> implements Either<T, unknown> {
  constructor(private readonly val: T) {}

  fmap(_: F<unknown>): Left<T> {
    return new Left(this.val);
  }

  bind(_: F<unknown>): Left<T> {
    return new Left(this.val);
  }
}

class Right<T> implements Either<unknown, T> {
  constructor(private readonly val: T) {}

  fmap<B>(fn: F<T, B>): Right<B> {
    return new Right(fn(this.val));
  }

  bind<B>(fn: F<T, Right<B>>): Right<B> {
    return fn(this.val);
  }
}
