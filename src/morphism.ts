import { compose } from "./utils";
export class Morphism<A, B> {
  private constructor(private f: F<A, B>) {}
  static _ = <A, B>(f: F<A, B>) => new Morphism(f);

  apply: F<A, B> = (a) => this.f(a);

  compose = <C>(g: F<B, C>): Morphism<A, C> => Morphism._(compose(g, this.f));
}

export class Endomorphism<A> {
  private constructor(private f: F<A, A>) {}
  static _ = <A>(f: F<A, A>) => new Endomorphism(f);

  apply: F<A, A> = (a) => this.f(a);

  compose = (...fs: F<A, A>[]): Endomorphism<A> =>
    Endomorphism._(fs.concat(this.f).reduce(compose));
}
