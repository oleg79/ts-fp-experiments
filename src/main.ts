import { compose, _const } from "./utils";
import { Maybe as M } from "./typeclasses2.ts";
import { Endomorphism, Morphism } from "./morphism.ts";

interface Semiring<A> {
  plus: FF<A, A>;
  zero: A;
  times: FF<A, A>;
  one: A;
}

const semiringNumber: Semiring<number> = {
  plus: (a1, a2) => a1 + a2,
  zero: 0,
  times: (a1, a2) => a1 * a2,
  one: 1,
};

// const ccc = composeAll(
//   (x: string[]): string[] => x.concat(x),
//   (x): number => x + x,
//   _const(7)
// );
// console.log("runtime error... no intermediate type inference...", ccc(4));

console.log(
  Morphism._(_const(7))
    .compose((x) => x * x)
    .compose((x) => [`${x}`]) // comment out this line and TS will yell at you
    .compose((x: string[]): string[] => x.concat(x))
    .apply(4),
);

console.log(
  Endomorphism._(_const(7))
    .compose(
      (x) => Number(`${x}${x}`),
      (x) => x * x,
      (x) => x + x,
    )
    .apply(4),
);

interface Contravariant<A> {
  contramap: <B>(f: F<B, A>) => Contravariant<B>;
}

class Predicate<A> implements Contravariant<A> {
  private constructor(private p: P<A>) {}
  static _ = <A>(p: P<A>) => new Predicate(p);

  getPredicate = () => this.p;

  contramap = <B>(f: F<B, A>) => Predicate._(compose(this.p, f));
}

interface Eq<A> {
  equals: FF<A, boolean>;
}

const eqNumber: Eq<number> = {
  equals: (x, y) => x === y,
};

const eqString: Eq<string> = {
  equals: (x, y) => x === y,
};

const eqTuple: Eq<[number, string]> = {
  equals: ([xn, xs], [yn, ys]) =>
    eqNumber.equals(xn, yn) && eqString.equals(xs, ys),
};

type ContramapEq = <A, B>(f: F<B, A>) => (eqA: Eq<A>) => Eq<B>;
const contramapEq: ContramapEq = (f) => (eqA) => ({
  equals: (x, y) => eqA.equals(f(x), f(y)),
});

interface User {
  id: number;
  username: string;
  name: string;
}

const eqUser: Eq<User> = contramapEq<[number, string], User>((u) => [
  u.id,
  u.username,
])(eqTuple);

console.log(
  eqUser.equals(
    { id: 1, name: "Sam_", username: "sam12" },
    { id: 1, name: "Sam", username: "sam12" },
  ),
);

const m = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
} as const;

type N = keyof typeof m;
type English = F<N, string>;
const english: English = (n) => m[n];

type Len = F<string, number>;
const len: Len = (s) => s.length;

type GreaterThanThree = Predicate<number>;
const greaterThanThree: GreaterThanThree = Predicate._((x) => x > 3);

type LengthGTThree = Predicate<string>;
const lengthGTThree: LengthGTThree = greaterThanThree.contramap(len);

type EnglishGTThree = Predicate<N>;
const englishGTThree: EnglishGTThree = lengthGTThree.contramap(english);

const arrayOfN: Array<N> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(arrayOfN.filter(englishGTThree.getPredicate()));

class A {}
class B extends A {}
class C extends A {}

const x = [new B(), new C()];

type DateFormat = `YYYY-MM-DD${"" | " HH:mm"}`;

type InitialDate = [DateFormat, DateFormat];

const format: DateFormat = "YYYY-MM-DD HH:mm";

const safeDiv =
  (a: number) =>
  (b: number): M<number> => {
    if (b === 0) return M.nothing() as unknown as M<number>;
    return M.just(a / b);
  };

console.log(
  // M.just((a: number) => (b: number) => (c: number) => a + b + c)
  M.nothing().apply(M.just(9)).apply(M.just(8)).apply(M.just(9)),
);

const OPS_MAP = {
  "<*>": "apply",
  "<$>": "fmap",
  ">>=": "bind",
} as const;

const λ = (symbols: TemplateStringsArray, ...entities: any[]) => {
  const ops = symbols.map((s) => s.trim()).filter(Boolean);

  const [init, ...rest] = entities;

  return rest.reduce((acc, curr, index) => {
    // @ts-expect-error: TODO: provide typing
    return acc[OPS_MAP[ops[index]]](curr);
  }, init);
};

const dummyAdd = (a: number) => (b: number) => (c: number) => a + b + c;

const result = λ`
${M.just(dummyAdd)}
<*> ${M.just(9)}
<*> ${M.just(80)}
<*> ${M.just(9)}
<$> ${_const(0)}
>>= ${safeDiv(100)}
`;

console.log(result);
