// https://en.wikipedia.org/wiki/Specification_pattern
export interface ISpecification<T> {
    isSatisfiedBy: (o: T) => boolean;
    and(other: ISpecification<T>): ISpecification<T>;
    andNot(other: ISpecification<T>): ISpecification<T>;
    or(other: ISpecification<T>): ISpecification<T>;
    orNot(other: ISpecification<T>): ISpecification<T>;
    not(): ISpecification<T>;
}

export abstract class CompositeSpecification<T> implements ISpecification<T> {
    abstract isSatisfiedBy(candidate: T): boolean;

    and(other: ISpecification<T>): ISpecification<T> {
        return new AndSpecification(this, other);
    }

    andNot(other: ISpecification<T>): ISpecification<T> {
        return new AndNotSpecification(this, other);
    }

    or(other: ISpecification<T>): ISpecification<T> {
        return new OrSpecification(this, other);
    }

    orNot(other: ISpecification<T>): ISpecification<T> {
        return new OrNotSpecification(this, other);
    }

    not(): ISpecification<T> {
        return new NotSpecification(this);
    }
}

export class AndSpecification<T> extends CompositeSpecification<T> {
    left: ISpecification<T>;
    right: ISpecification<T>;

    constructor(left: ISpecification<T>, right: ISpecification<T>) {
        super();
        this.left = left;
        this.right = right;
    }

    isSatisfiedBy(candidate: T): boolean {
        return (
            this.left.isSatisfiedBy(candidate) &&
            this.right.isSatisfiedBy(candidate)
        );
    }
}

export class AndNotSpecification<T> extends CompositeSpecification<T> {
    left: ISpecification<T>;
    right: ISpecification<T>;

    constructor(left: ISpecification<T>, right: ISpecification<T>) {
        super();
        this.left = left;
        this.right = right;
    }

    isSatisfiedBy(candidate: T): boolean {
        return (
            this.left.isSatisfiedBy(candidate) &&
            !this.right.isSatisfiedBy(candidate)
        );
    }
}

export class OrSpecification<T> extends CompositeSpecification<T> {
    left: ISpecification<T>;
    right: ISpecification<T>;

    constructor(left: ISpecification<T>, right: ISpecification<T>) {
        super();
        this.left = left;
        this.right = right;
    }

    isSatisfiedBy(candidate: T): boolean {
        return (
            this.left.isSatisfiedBy(candidate) ||
            this.right.isSatisfiedBy(candidate)
        );
    }
}

export class OrNotSpecification<T> extends CompositeSpecification<T> {
    left: ISpecification<T>;
    right: ISpecification<T>;

    constructor(left: ISpecification<T>, right: ISpecification<T>) {
        super();
        this.left = left;
        this.right = right;
    }

    isSatisfiedBy(candidate: T): boolean {
        return (
            this.left.isSatisfiedBy(candidate) ||
            !this.right.isSatisfiedBy(candidate)
        );
    }
}

export class NotSpecification<T> extends CompositeSpecification<T> {
    other: ISpecification<T>;

    constructor(other: ISpecification<T>) {
        super();
        this.other = other;
    }

    isSatisfiedBy(candidate: T): boolean {
        return !this.other.isSatisfiedBy(candidate);
    }
}

export abstract class LinqSpecification<T> extends CompositeSpecification<T> {
    abstract expression: (o: T) => boolean;

    isSatisfiedBy(candidate: T): boolean {
        return this.expression(candidate);
    }
}