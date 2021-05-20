export interface ISpecification2<T1, T2> {
  isSatisfiedBy: (o: T1, f: T2) => boolean;
  and(other: ISpecification2<T1, T2>): ISpecification2<T1, T2>;
  andNot(other: ISpecification2<T1, T2>): ISpecification2<T1, T2>;
  or(other: ISpecification2<T1, T2>): ISpecification2<T1, T2>;
  orNot(other: ISpecification2<T1, T2>): ISpecification2<T1, T2>;
  not(): ISpecification2<T1, T2>;
}

export abstract class CompositeSpecification2<T1, T2>
  implements ISpecification2<T1, T2> {
  abstract isSatisfiedBy(candidate: T1, formGroup: T2): boolean;

  and(other: ISpecification2<T1, T2>): ISpecification2<T1, T2> {
    return new AndSpecification2(this, other);
  }

  andNot(other: ISpecification2<T1, T2>): ISpecification2<T1, T2> {
    return new AndNotSpecification2(this, other);
  }

  or(other: ISpecification2<T1, T2>): ISpecification2<T1, T2> {
    return new OrSpecification2(this, other);
  }

  orNot(other: ISpecification2<T1, T2>): ISpecification2<T1, T2> {
    return new OrNotSpecification2(this, other);
  }

  not(): ISpecification2<T1, T2> {
    return new NotSpecification2(this);
  }
}

export class AndSpecification2<T1, T2> extends CompositeSpecification2<T1, T2> {
  left: ISpecification2<T1, T2>;
  right: ISpecification2<T1, T2>;

  constructor(left: ISpecification2<T1, T2>, right: ISpecification2<T1, T2>) {
    super();
    this.left = left;
    this.right = right;
  }

  isSatisfiedBy(candidate: T1, formGroup: T2): boolean {
    return (
      this.left.isSatisfiedBy(candidate, formGroup) &&
      this.right.isSatisfiedBy(candidate, formGroup)
    );
  }
}

export class AndNotSpecification2<T1, T2> extends CompositeSpecification2<
  T1,
  T2
> {
  left: ISpecification2<T1, T2>;
  right: ISpecification2<T1, T2>;

  constructor(left: ISpecification2<T1, T2>, right: ISpecification2<T1, T2>) {
    super();
    this.left = left;
    this.right = right;
  }

  isSatisfiedBy(candidate: T1, formGroup: T2): boolean {
    return (
      this.left.isSatisfiedBy(candidate, formGroup) &&
      !this.right.isSatisfiedBy(candidate, formGroup)
    );
  }
}

export class OrSpecification2<T1, T2> extends CompositeSpecification2<T1, T2> {
  left: ISpecification2<T1, T2>;
  right: ISpecification2<T1, T2>;

  constructor(left: ISpecification2<T1, T2>, right: ISpecification2<T1, T2>) {
    super();
    this.left = left;
    this.right = right;
  }

  isSatisfiedBy(candidate: T1, formGroup: T2): boolean {
    return (
      this.right.isSatisfiedBy(candidate, formGroup) &&
      this.left.isSatisfiedBy(candidate, formGroup)
    );
  }
}

export class OrNotSpecification2<T1, T2> extends CompositeSpecification2<
  T1,
  T2
> {
  left: ISpecification2<T1, T2>;
  right: ISpecification2<T1, T2>;

  constructor(left: ISpecification2<T1, T2>, right: ISpecification2<T1, T2>) {
    super();
    this.left = left;
    this.right = right;
  }

  isSatisfiedBy(candidate: T1, formGroup: T2): boolean {
    return !(
      this.right.isSatisfiedBy(candidate, formGroup) ||
      this.left.isSatisfiedBy(candidate, formGroup)
    );
  }
}

export class NotSpecification2<T1, T2> extends CompositeSpecification2<T1, T2> {
  other: ISpecification2<T1, T2>;

  constructor(other: ISpecification2<T1, T2>) {
    super();
    this.other = other;
  }

  isSatisfiedBy(candidate: T1, formGroup: T2): boolean {
    return !this.other.isSatisfiedBy(candidate, formGroup);
  }
}

export abstract class LinqSpecification2<
  T1,
  T2
> extends CompositeSpecification2<T1, T2> {
  abstract expression: (o: T1, f: T2) => boolean;

  isSatisfiedBy(candidate: T1, formGroup: T2): boolean {
    return this.expression(candidate, formGroup);
  }
}
