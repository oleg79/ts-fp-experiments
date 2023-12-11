import { composeAll } from "./utils";

function* fibGen() {
  let data = [0, 1];

  while (true) {
    yield data[0];

    data = [data[1], data[0] + data[1]];
  }
}

const takeGen = <T>(n: number) =>
  function* (iterable: Generator<T>) {
    for (const i of iterable) {
      if (n <= 0) return;
      n--;
      yield i;
    }
  };

const takeFromGen = <T>(from: number, n: number) =>
  function* (iterable: Generator<T>) {
    let j = 0;
    for (const i of iterable) {
      if (j >= from) {
        if (n <= 0) return;
        n--;
        yield i;
      }
      j++;
    }
  };

const mapGen = <A, B>(fn: F<A, B>) =>
  function* (iterable: Generator<A>) {
    for (const i of iterable) yield fn(i);
  };

const filterGen = <A>(predicate: P<A>) =>
  function* (iterable: Generator<A>) {
    for (const i of iterable) {
      if (predicate(i)) {
        yield i;
      }
    }
  };

const fib = (n: number) => {
  const output: number[] = [];
  let _n = n;
  let inter = [0, 1];

  while (_n) {
    output.push(inter[0]);
    inter = [inter[1], inter[0] + inter[1]];
    _n--;
  }

  return output;
};

const takeFrom =
  <A>(from: number, n: number) =>
  (list: A[]) => {
    const output: A[] = [];
    let j = 0;
    for (const i of list) {
      if (j >= from) {
        if (n > 0) {
          output.push(i);
          n--;
        }
      }
      j++;
    }

    return output;
  };

const map =
  <A, B>(fn: F<A, B>) =>
  (list: A[]) => {
    const output: B[] = [];

    for (const i of list) output.push(fn(i));

    return output;
  };

const filter =
  <A>(predicate: P<A>) =>
  (list: A[]) => {
    const output: A[] = [];

    for (const i of list) {
      if (predicate(i)) output.push(i);
    }

    return output;
  };

const divide = (x: number) => x / 1000;
const moreThan = (x: number) => x > 100;
const toWhole = (x: string) => x.split(".")[0];

const tF = [99990, 10] as const;

const args = [tF, Number, toWhole, String, moreThan, divide] as const;

const gfs = [takeFromGen, mapGen, mapGen, mapGen, filterGen, mapGen] as const;

const fs = [takeFrom, map, map, map, filter, map] as const;

const apply = <A, B>(a: A, f: F<A, B>) => f(a);

const zip = (zipFn: any) => (as: any, fs: any) =>
  as.map((a: any, i: number) => zipFn(a, fs[i]));

const zipApply = zip(apply);

const superItter = composeAll(
  // ...zipApply(args, gfs)
  takeFromGen(...tF),
  mapGen(Number),
  mapGen(toWhole),
  mapGen(String),
  filterGen(moreThan),
  mapGen(divide),
);

const superList = composeAll(
  // ...zipApply(args, fs)
  takeFrom(...tF),
  map(Number),
  map(toWhole),
  map(String),
  filter(moreThan),
  map(divide),
);

const measure = <A>(fn: F<void, A>, label: string) => {
  console.time(label);
  console.log(fn());
  console.timeEnd(label);
};

measure(() => [...superItter(fibGen())], "fibGen");
measure(() => superList(fib(100026)), "fib");
measure(
  () => fib(1_000_000).filter((_n, i) => i > 99990 && i <= 99990 + 10),
  "fib arr",
);
