type IsCovariant<C, P> = C extends P ? true : false;

type IsContravariant<C, P> = P extends C ? true : false;

type IsBivariant<C, P> = IsCovariant<C, P> extends true
  ? IsContravariant<C, P> extends true
    ? true
    : false
  : false;

type IsInvariant<C, P> = IsCovariant<C, P> extends false
  ? IsContravariant<C, P> extends false
    ? true
    : false
  : false;


interface IAnimal {
  name: string;
}
interface ICat extends IAnimal {
  meow: F0;
}
interface IDog extends IAnimal {
  bark: F0;
}

// if test fails then the final type is `never`.
type CovariantTest1 = IsCovariant<ICat, IAnimal> & true;
type CovariantTest2 = IsCovariant<Promise<IDog>, Promise<IAnimal>> & true;
type CovariantTest3 = IsCovariant<ICat[], IAnimal[]> & true;
type CovariantTest4 = IsCovariant<IDog, IAnimal> & true;
type CovariantTest5 = IsCovariant<ICat, IDog> & false;
type CovariantTest6 = IsCovariant<F<number, ICat>, F<number, IAnimal>> & true;
type CovariantTest7 = IsCovariant<F<string, ICat>, F<number, IAnimal>> & false;

type BivariantTest1 = IsBivariant<ICat, IAnimal> & false;
type BivariantTest2 = IsBivariant<IAnimal, IAnimal> & true;
type BivariantTest3 = IsBivariant<{ name: string }, { name: string }> & true;

type InvariantTest1 = IsInvariant<ICat, IDog> & true;
type InvariantTest2 = IsInvariant<ICat, IAnimal> & false;
type InvariantTest3 = IsInvariant<IAnimal, IDog> & false;
